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
        'schema': {
            'type': 'string',
            'min': 0,
            'max': 100
        },
        'minlength': 0,
        'maxlength': 10
    },
    'active':{'type':'boolean'},
    'avatar':{'type':'string'}
}


schema_patch = {
            'documentType': {'type': 'string', 'allowed': ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de identidad'], 'required': False},
            'documentNumber': {'type': 'string', 'required': False},
            'firstname': {'type': 'string', 'required': False},
            'lastname': {'type': 'string', 'required': False},
            'email': {'type': 'string', 'regex': r'^[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$', 'coerce': lambda x: x.lower(), 'required': False},
            'phoneNumber': {'type': 'string', 'required': False},
            'password': {'type': 'string', 'required': False},
            'plate': {'type': 'list', 'schema': {'type': 'string', 'minlength': 0, 'maxlength': 100}, 'required': False},
        }

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


@users.route('/me', methods=['GET'])
@jwt_required()
def read_one():
    user_id = get_jwt_identity()
    obj_id = ObjectId(user_id)
    user = db['users'].find_one({"_id": obj_id})

    if not user:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": user}, HTTPStatus.OK

@users.route('/<string:id>', methods=['GET'])
@jwt_required()
def read_one_admin(id):
    claims = get_jwt()
    rol = claims.get('rol')
    
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    obj_id = ObjectId(id)
    user = db['users'].find_one({"_id": obj_id})

    if not user:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": user}, HTTPStatus.OK

@users.route('/', methods=['POST'])
def create_user():
    try:
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


        # Crear una instancia de Usuario con los datos recibidos
        usuario = User(
            documentType=request.form['documentType'],
            documentNumber=request.form['documentNumber'],
            firstname=request.form['firstname'],
            lastname=request.form['lastname'],
            email=request.form['email'],
            phoneNumber=request.form['phoneNumber'],
            password=request.form['password'],
            plate=request.form.getlist('plate[]'),
            active=False,
            avatar=avatar_relative_path 
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



@users.route('/', methods=['PUT','PATCH'])
@jwt_required()
def update_user():
    try:
        user_id = get_jwt_identity()
        obj_id = ObjectId(user_id)
        user = db['users'].find_one({"_id": obj_id})

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND

        # Actualizar los campos del usuario con los datos recibidos
        if 'documentType' in request.form:
            user['documentType'] = request.form['documentType']
        if 'documentNumber' in request.form:
            user['documentNumber'] = request.form['documentNumber']
        if 'firstname' in request.form:
            user['firstname'] = request.form['firstname']
        if 'lastname' in request.form:
            user['lastname'] = request.form['lastname']
        if 'email' in request.form:
            user['email'] = request.form['email']
        if 'phoneNumber' in request.form:
            user['phoneNumber'] = request.form['phoneNumber']
        if 'password' in request.form:
            user['password'] = request.form['password']
        if 'plate[]' in request.form:
            user['plate'] = request.form.getlist('plate[]')
        if 'avatar' in request.files:
            avatar = request.files['avatar']
            if avatar:
                # Guardar el archivo de imagen en una ubicación deseada
                avatar.save('../uploads/avatar' + avatar.filename)
                user['avatar'] = avatar.filename
        
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



@users.route('/<string:id>', methods=['PUT','PATCH'])
@jwt_required()
def update_user_admin(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        user = db['users'].find_one({"_id": obj_id})

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND

        # Actualizar los campos del usuario con los datos recibidos
        if 'documentType' in request.form:
            user['documentType'] = request.form['documentType']
        if 'documentNumber' in request.form:
            user['documentNumber'] = request.form['documentNumber']
        if 'firstname' in request.form:
            user['firstname'] = request.form['firstname']
        if 'lastname' in request.form:
            user['lastname'] = request.form['lastname']
        if 'email' in request.form:
            user['email'] = request.form['email']
        if 'phoneNumber' in request.form:
            user['phoneNumber'] = request.form['phoneNumber']
        if 'password' in request.form:
            user['password'] = request.form['password']
        if 'plate[]' in request.form:
            user['plate'] = request.form.getlist('plate[]')
        if 'avatar' in request.files:
            avatar = request.files['avatar']
            if avatar:
                # Guardar el archivo de imagen en una ubicación deseada
                avatar.save('../uploads/avatar' + avatar.filename)
                user['avatar'] = avatar.filename
        
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


@users.route('/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol') 
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        user = db['users'].find_one({"_id": obj_id})

        if not user:
            return jsonify({'error': 'Usuario no encontrado'}), HTTPStatus.NOT_FOUND

        # Eliminar el usuario de la base de datos
        db['users'].delete_one({"_id": obj_id})
        
        return jsonify({"message": "Usuario eliminado correctamente"}), HTTPStatus.OK
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST

