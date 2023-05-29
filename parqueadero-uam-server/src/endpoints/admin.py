from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from http import HTTPStatus
from werkzeug.utils import secure_filename
import os
from src.database import db
from bson import ObjectId
from cerberus import Validator

from src.models.admin import Admin
admin = Blueprint("admin",
                    __name__,
                    url_prefix="/api/v1/admin")

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
    'active':{'type':'boolean'},
    'avatar':{'type':'string'},
}


schema_patch = {
            'documentType': {'type': 'string', 'allowed': ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de identidad'], 'required': False},
            'documentNumber': {'type': 'string', 'required': False},
            'firstname': {'type': 'string', 'required': False},
            'lastname': {'type': 'string', 'required': False},
            'email': {'type': 'string', 'regex': r'^[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$', 'coerce': lambda x: x.lower(), 'required': False},
            'phoneNumber': {'type': 'string', 'required': False},
}


@admin.route("/all", methods=["GET"])
@jwt_required()
def read_all():
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    admins = db['admin'].find()  
    result = [admin for admin in admins]
    return jsonify(result)


@admin.route('/me', methods=['GET'])
@jwt_required()
def read_one():
    user_id = get_jwt_identity()
    obj_id = ObjectId(user_id)
    admin = db['admin'].find_one({"_id": obj_id})
    if not admin:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": admin}, HTTPStatus.OK

@admin.route('/', methods=['POST'])
@jwt_required()
def create_admin():
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED


        # Crear una instancia de delegado con los datos recibidos
        admin = Admin(
            documentType=request.form['documentType'],
            documentNumber=request.form['documentNumber'],
            firstname=request.form['firstname'],
            lastname=request.form['lastname'],
            email=request.form['email'],
            phoneNumber=request.form['phoneNumber'],
            password=request.form['password'],
            active=False,
            avatar="",
        )
        
        admin_json = admin.to_json(admin)
        validator = Validator(schema)
        if not validator.validate(admin_json):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        # Guardar el    admin en la base de datos
        db['admin'].insert_one(admin_json)

        return jsonify({"data": admin_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST

@admin.route('/avatar', methods=['PUT'])
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

@admin.route('/<string:id>', methods=['PUT','PATCH'])
@jwt_required()
def update_admin(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        admin = db['admin'].find_one({"_id": obj_id})

        if not admin:
            return jsonify({'error': 'Delegado no encontrado'}), HTTPStatus.NOT_FOUND

        # Actualizar los campos del delegado con los datos recibidos
        if 'documentType' in request.form:
            admin['documentType'] = request.form['documentType']
        if 'documentNumber' in request.form:
            #validar numero de documento
            documentNumber=request.form['documentNumber']
            # Verificar si ya existe un usuario con el mismo documentNumber
            existing_admin = db['admin'].find_one({'documentNumber': documentNumber})
            if existing_admin:
                return {'error': 'Ya existe un usuario con el mismo número de documento'}, HTTPStatus.BAD_REQUEST  
            admin['documentNumber'] = documentNumber
        if 'firstname' in request.form:
            admin['firstname'] = request.form['firstname']
        if 'lastname' in request.form:
            admin['lastname'] = request.form['lastname']
        if 'email' in request.form:
            admin['email'] = request.form['email']
        if 'phoneNumber' in request.form:
            admin['phoneNumber'] = request.form['phoneNumber']
        if 'password' in request.form:
            admin['password'] = request.form['password']
        
        updated_fields = {field: value for field, value in request.form.items() if field in schema}
        validator = Validator(schema_patch)
        if not validator.validate(updated_fields):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        
        # Actualizar el documento en la base de datos
        db['admin'].update_one({"_id": obj_id}, {"$set": admin})

        return jsonify({"data": admin}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



@admin.route('/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_admin(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        admin = db['admin'].find_one({"_id": obj_id})

        if not admin:
            return jsonify({'error': 'Admin no encontrado'}), HTTPStatus.NOT_FOUND

        # Eliminar el Admin de la base de datos
        db['admin'].delete_one({"_id": obj_id})
        
        return jsonify({"message": "Admin eliminado correctamente"}), HTTPStatus.OK
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


