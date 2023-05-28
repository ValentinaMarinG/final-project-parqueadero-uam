from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from http import HTTPStatus
import werkzeug
from werkzeug.utils import secure_filename
from bson import json_util
import os
from src.database import db
from bson import ObjectId
from cerberus import Validator
import sendgrid
from venv.constants import SENDGRID_API_KEY, SENDGRID_SENDER_EMAIL
from sendgrid.helpers.mail import Mail
from werkzeug.security import generate_password_hash, check_password_hash



from src.models.user import User
users = Blueprint("users",
                    __name__,
                    url_prefix="/api/v1/users")


schema = {
    'documentType':{'type': 'string', 'allowed':['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de identidad'],'required': True},
    'documentNumber':{'type': 'string', 'required': True},
    'firstname':{'type': 'string', 'required': True},
    'lastname':{'type': 'string', 'required': True},
    'email': {
        'type': 'string',
        'required': True,
        'regex': r'^[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$', 
        'coerce': lambda x: x.lower()  
    },
    'phoneNumber':{'type': 'string', 'required': True},
    'password':{'type': 'string', 'required': True}, 
    'plate': {
        'type': 'list',
        'required':False,
        'schema': {
            'type': 'string',
            'min': 0,
            'max': 100
        },
        'minlength': 0,
        'maxlength': 10
    },
    'active':{'type':'boolean'},
    'avatar':{'type':'string'},
    'department':{'type':'string','required': True},
    'municipality':{'type':'string','required': True}
}


schema_patch = {
            'documentType': {'type': 'string', 'allowed': ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de identidad'], 'required': False},
            'documentNumber': {'type': 'string', 'required': False},
            'firstname': {'type': 'string', 'required': False},
            'lastname': {'type': 'string', 'required': False},
            'email': {'type': 'string', 'regex': r'^[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$', 'coerce': lambda x: x.lower(), 'required': False},
            'phoneNumber': {'type': 'string', 'required': False},
            'department':{'type':'string','required': False},
            'municipality':{'type':'string','required': False}
        }




#Listar informacion propia, permiso usuario
@users.route('/me', methods=['GET'])
@jwt_required()
def read_one():
    claims = get_jwt()
    rol = claims.get('rol')
    if not rol == 'user':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    user_id = get_jwt_identity()
    obj_id = ObjectId(user_id)
    user = db['users'].find_one({"_id": obj_id})

    if not user:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": user}, HTTPStatus.OK


#Crear usuario, sin autenticación
@users.route('/', methods=['POST'])
def create_user():
    try:
        #validar numero de documento
        documentNumber=request.form['documentNumber']
        # Verificar si ya existe un usuario con el mismo documentNumber
        existing_user = db['users'].find_one({'documentNumber': documentNumber})
        if existing_user:
            return {'error': 'Ya existe un usuario con el mismo número de documento'}, HTTPStatus.BAD_REQUEST 
        email=request.form['email']
        # Verificar si ya existe un usuario con el mismo email
        existing_user_em = db['users'].find_one({'email': email})
        if existing_user_em:
            return {'error': 'Ya existe un usuario con el mismo correo'}, HTTPStatus.BAD_REQUEST        
        # Crear una instancia de Usuario con los datos recibidos    
        usuario = User(
            documentType=request.form['documentType'],
            documentNumber=documentNumber,
            firstname=request.form['firstname'],
            lastname=request.form['lastname'],
            email=request.form['email'],
            phoneNumber=request.form['phoneNumber'],
            password=request.form['password'],
            plate=[],
            active=True,
            avatar="" ,
            department=request.form['department'],
            municipality=request.form['municipality'],
        )
        usuario_json = usuario.to_json(usuario)
        validator = Validator(schema)
        if not validator.validate(usuario_json):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        # Guardar el usuario en la base de datos
        db['users'].insert_one(usuario_json)

        return jsonify({"data": usuario_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST




@users.route('/avatar', methods=['PUT'])
@jwt_required()
def update_avatar():
    try:
        user_id = get_jwt_identity()
        obj_id = ObjectId(user_id)
        user = db['users'].find_one({"_id": obj_id})

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND
        
        # Obtener el archivo de imagen
        avatar = request.files.get('avatar')

        # Asignar un valor predeterminado a avatar_path
        avatar_path = None

        if avatar:
            # Obtener la ruta absoluta de la carpeta "uploads"
            uploads_folder = os.path.abspath('uploads')

            # Verificar si la carpeta "uploads" existe, de lo contrario, crearla
            if not os.path.exists(uploads_folder):
                os.makedirs(uploads_folder)

            # Obtener la ruta absoluta de la carpeta "avatar" dentro de "uploads"
            avatar_folder = os.path.join(uploads_folder, 'avatar')

            # Verificar si la carpeta "avatar" existe, de lo contrario, crearla
            if not os.path.exists(avatar_folder):
                os.makedirs(avatar_folder)

            # Guardar el archivo de imagen en la carpeta "avatar"
            avatar_filename = secure_filename(avatar.filename)
            avatar_path = os.path.join(avatar_folder, avatar_filename)
            avatar.save(avatar_path)

            # Obtener la ruta relativa del archivo incluyendo "uploads"
            avatar_relative_path = os.path.join('uploads', os.path.relpath(avatar_path, uploads_folder))
            user['avatar'] = avatar_relative_path
            db['users'].update_one({"_id": obj_id}, {"$set": user})

        return jsonify({'message': 'Foto de perfil actualizada correctamente'}), HTTPStatus.OK

    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


#Editar informacion propia, permiso de usuario
@users.route('/', methods=['PUT','PATCH'])
@jwt_required()
def update_user():
    try:
        user_id = get_jwt_identity()
        obj_id = ObjectId(user_id)
        user = db['users'].find_one({"_id": obj_id})

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND
        if 'firstname' in request.form:
            if request.form['firstname'] != "":
                user['firstname'] = request.form['firstname']
        if 'lastname' in request.form:
            if request.form['lastname'] != "":
                user['lastname'] = request.form['lastname']
        if 'phoneNumber' in request.form:
            if request.form['phoneNumber'] != "":
                user['phoneNumber'] = request.form['phoneNumber']
        
        updated_fields = {field: value for field, value in request.form.items() if field in schema}
        validator = Validator(schema_patch)
        if not validator.validate(updated_fields):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        
        # Actualizar el documento en la base de datos
        db['users'].update_one({"_id": obj_id}, {"$set": user})

        return jsonify({"data": user}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



#Añadir placa a lista de usuarios, permisos de usuarios
@users.route("/plate", methods=['POST'])
@jwt_required()
def add_plate(): 
    claims = get_jwt()
    rol = claims.get('rol')
    if not rol == 'user':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    user_id = get_jwt_identity()
    obj_id = ObjectId(user_id)
    user = db['users'].find_one({"_id": obj_id})
    if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND
    placa_buscada = request.form['plate']
    if 'plate' in user and placa_buscada in user['plate']:
        return jsonify({'error': 'La placa ya existe'}), HTTPStatus.BAD_REQUEST
    db['users'].update_one({"_id": obj_id}, {"$push": {"plate": placa_buscada}})
    return jsonify({'message': 'Placa agregada correctamente'}), HTTPStatus.OK



#Elimar una placa a la lista de usuarios, permiso usuarios
@users.route("/plate", methods=['DELETE'])
@jwt_required()
def delete_plate(): 
    claims = get_jwt()
    rol = claims.get('rol')
    if not rol == 'user':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    user_id = get_jwt_identity()
    obj_id = ObjectId(user_id)
    user = db['users'].find_one({"_id": obj_id})
    if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND
    placa_buscada = request.form['plate']
    if 'plate' in user and not placa_buscada in user['plate']:
        return jsonify({'error': 'La placa no existe'}), HTTPStatus.BAD_REQUEST
    db['users'].update_one({"_id": obj_id}, {"$pull": {"plate": placa_buscada}})
    return jsonify({'message': 'Placa eliminada correctamente'}), HTTPStatus.OK




#Buscar mi carro, permisos de usuario
@users.route('/plate', methods=['GET'])
@jwt_required()
def find_car():
    claims = get_jwt()
    rol = claims.get('rol')
    if not rol == 'user':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    user_id = get_jwt_identity()
    obj_id = ObjectId(user_id)
    user = db['users'].find_one({"_id": obj_id})
    placa_buscada = request.form['plate']  
    if placa_buscada not in user.get('plate', []):
            return jsonify({'error': 'Placa no encontrada para el usuario'}), HTTPStatus.NOT_FOUND

    resultado = db['parking'].find_one({'plate': placa_buscada})
    
    if resultado is None:
        return jsonify({'message': f'La placa {placa_buscada} no se encuentra en ningún parqueadero.'}), HTTPStatus.NOT_FOUND
    else:
        parqueadero = resultado['name']  # Ajusta según la estructura de tus documentos
        return jsonify({'message': f'La placa {placa_buscada} se encuentra en el parqueadero {parqueadero}.'}), 200



@users.route("/change-password", methods=["POST"])
@jwt_required()
def change_password():
    # Obtener el ID de usuario del token JWT
    user_id = get_jwt_identity()
    obj_id = ObjectId(user_id)

    # Buscar al usuario en la base de datos por su ID
    user = db['users'].find_one({"_id": obj_id})
    if not user:
        return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND

    # Obtener la contraseña actual y la nueva contraseña del cuerpo de la solicitud
    current_password = request.json.get("current_password")
    new_password = request.json.get("new_password")

    # Verificar si la contraseña actual es correcta
    if not check_password_hash(user['password'], current_password):
        return jsonify({'error': 'Contraseña actual incorrecta'}), HTTPStatus.UNAUTHORIZED

    # Generar el hash de la nueva contraseña
    new_password_hash = generate_password_hash(new_password)

    # Actualizar la contraseña del usuario en la base de datos
    db['users'].update_one({"_id": obj_id}, {"$set": {"password": new_password_hash}})

    return jsonify({'message': 'Contraseña actualizada correctamente'}), HTTPStatus.OK





#ADMINISTRADOR




#Listar todos, permiso de administrador
@users.route("/all", methods=["GET"])
@jwt_required()
def read_all():
    claims = get_jwt()
    rol = claims.get('rol')
    
    if rol == 'admin':
        usuarios = db['users'].find()  # Cambia el nombre de la colección si es necesario
        resultado = [usuario for usuario in usuarios]
        return jsonify(resultado)
    else :
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED



#Listar información de un usuario por su id, permiso admin
@users.route('/<string:documento>', methods=['GET'])
@jwt_required()
def read_one_admin(documento):
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    user = db['users'].find_one({"documentNumber": documento})

    if not user:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": user}, HTTPStatus.OK




#Crear un usuario, permiso de admin
@users.route('/admin', methods=['POST'])
@jwt_required()
def create_user_admin():
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        
        #validar numero de documento
        documentNumber=request.form['documentNumber']
        # Verificar si ya existe un usuario con el mismo documentNumber
        existing_user = db['users'].find_one({'documentNumber': documentNumber})
        if existing_user:
            return {'error': 'Ya existe un usuario con el mismo número de documento'}, HTTPStatus.BAD_REQUEST
        
        email=request.form['email']
        # Verificar si ya existe un usuario con el mismo documentNumber
        existing_user_em = db['users'].find_one({'email': email})
        if existing_user_em:
            return {'error': 'Ya existe un usuario con el mismo correo'}, HTTPStatus.BAD_REQUEST  
        usuario = User(
            documentType=request.form['documentType'],
            documentNumber=request.form['documentNumber'],
            firstname=request.form['firstname'],
            lastname=request.form['lastname'],
            email=request.form['email'],
            phoneNumber=request.form['phoneNumber'],
            password=request.form['password'],
            plate=[],
            active=True,
            avatar="" ,
            department=request.form['department'],
            municipality=request.form['municipality'],
        )
        usuario_json = usuario.to_json(usuario)
        validator = Validator(schema)
        if not validator.validate(usuario_json):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        # Guardar el usuario en la base de datos
        db['users'].insert_one(usuario_json)

        enviar_correo_sendgrid(email, 'Bienvenido a parqueadero UAM', '¡Fuiste registrado en el sistema de parqueadero UAM por uno de nuestros administradores!')
        
        return jsonify({"data": usuario_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST

def enviar_correo_sendgrid(destinatario, asunto, contenido):
    message = Mail(
        from_email=SENDGRID_SENDER_EMAIL,
        to_emails=destinatario,
        subject=asunto,
        plain_text_content=contenido)
    
    try:
        sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
    except Exception as e:
        print(str(e))

#Actualizar usuario, permisos de admin
@users.route('/<string:documento>', methods=['PUT','PATCH'])
@jwt_required()
def update_user_admin(documento):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        user = db['users'].find_one({"documentNumber": documento})

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND
        
        # Actualizar los campos del usuario con los datos recibidos
        if 'documentType' in request.form:
            if request.form['documentType'] != "":
                user['documentType'] = request.form['documentType']
        if 'documentNumber' in request.form:
            if request.form['documentNumber'] != "":
                #validar numero de documento
                documentNumber=request.form['documentNumber']
                # Verificar si ya existe un usuario con el mismo documentNumber
                existing_user = db['users'].find_one({'documentNumber': documentNumber})
                if existing_user:
                    return {'error': 'Ya existe un usuario con el mismo número de documento'}, HTTPStatus.BAD_REQUEST  
                user['documentNumber'] = documentNumber
        if 'firstname' in request.form:
            if request.form['firstname'] != "":
                user['firstname'] = request.form['firstname']
        if 'lastname' in request.form:
            if request.form['lastname'] != "":
                user['lastname'] = request.form['lastname']
        if 'email' in request.form:
            if request.form['email'] != "":
                email=request.form['email']
                # Verificar si ya existe un usuario con el mismo documentNumber
                existing_user_em = db['users'].find_one({'email': email})
                if existing_user_em:
                    return {'error': 'Ya existe un usuario con el mismo correo'}, HTTPStatus.BAD_REQUEST  
                user['email'] = email
        if 'phoneNumber' in request.form:
            if request.form['phoneNumber'] != "":
                user['phoneNumber'] = request.form['phoneNumber']
        updated_fields = {field: value for field, value in request.form.items() if field in schema}
        validator = Validator(schema_patch)
        if not validator.validate(updated_fields):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        # Actualizar el documento en la base de datos
        db['users'].update_one({"documentNumber": documento}, {"$set": user})

        return jsonify({"data": user}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



#Eliminar usuario, permisos de admin
@users.route('/<string:documento>', methods=['DELETE'])
@jwt_required()
def delete_user(documento):
    try:
        claims = get_jwt()
        rol = claims.get('rol') 
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        user = db['users'].find_one({"documentNumber": documento})

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND

        # Eliminar el usuario de la base de datos
        db['users'].delete_one({"documentNumber": documento})
        
        return jsonify({"message": "Usuario eliminado correctamente"}), HTTPStatus.OK
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



#DELEGADO

#Buscar usuario por su placa
@users.route('/<string:placa>/placa', methods=['GET'])
@jwt_required()
def find_user(placa):
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'delegate':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    user = db['users'].find_one({"plate": placa})

    if not user:
        return {"error": "Ningun usuario contiene esa placa"}, HTTPStatus.NOT_FOUND

    return {"data": user}, HTTPStatus.OK

