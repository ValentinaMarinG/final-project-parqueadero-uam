from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from http import HTTPStatus
from werkzeug.utils import secure_filename
import os
from src.database import db
from bson import ObjectId

from src.models.delegate import Delegate
delegates = Blueprint("delegates",
                    __name__,
                    url_prefix="/api/v1/delegates")


@delegates.route("/all", methods=["GET"])
@jwt_required()
def read_all():
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    delegates = db['delegates'].find()  
    result = [delegate for delegate in delegates]
    return jsonify(result)


@delegates.route('/<string:id>', methods=['GET'])
@jwt_required()
def read_one(id):
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    obj_id = ObjectId(id)
    delegate = db['delegates'].find_one({"_id": obj_id})

    if not delegate:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": delegate}, HTTPStatus.OK

@delegates.route('/', methods=['POST'])
@jwt_required()
def create_delegate():
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
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


        # Crear una instancia de delegado con los datos recibidos
        delegate = Delegate(
            documentType=request.form['documentType'],
            documentNumber=request.form['documentNumber'],
            firstname=request.form['firstname'],
            lastname=request.form['lastname'],
            email=request.form['email'],
            phoneNumber=request.form['phoneNumber'],
            password=request.form['password'],
            position=request.form['position'],
            active=False,
            avatar=avatar_relative_path,
            parkingId= ObjectId(request.form['parkingId'])
        )
        
        delegate_json = delegate.to_json(delegate)
        # Guardar el    delegate en la base de datos
        db['delegates'].insert_one(delegate_json)

        return jsonify({"data": delegate_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



@delegates.route('/<string:id>', methods=['PUT','PATCH'])
@jwt_required()
def update_delegate(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        delegate = db['delegates'].find_one({"_id": obj_id})

        if not delegate:
            return jsonify({'error': 'Delegado no encontrado'}), HTTPStatus.NOT_FOUND

        # Actualizar los campos del delegado con los datos recibidos
        if 'documentType' in request.form:
            delegate['documentType'] = request.form['documentType']
        if 'documentNumber' in request.form:
            delegate['documentNumber'] = request.form['documentNumber']
        if 'firstname' in request.form:
            delegate['firstname'] = request.form['firstname']
        if 'lastname' in request.form:
            delegate['lastname'] = request.form['lastname']
        if 'email' in request.form:
            delegate['email'] = request.form['email']
        if 'phoneNumber' in request.form:
            delegate['phoneNumber'] = request.form['phoneNumber']
        if 'password' in request.form:
            delegate['password'] = request.form['password']
        if 'position' in request.form:
            delegate['position'] = request.form['position']
        if 'avatar' in request.files:
            avatar = request.files['avatar']
            if avatar:
                # Guardar el archivo de imagen en una ubicación deseada
                avatar.save('../uploads/avatar' + avatar.filename)
                delegate['avatar'] = avatar.filename
        
        # Actualizar el documento en la base de datos
        db['delegates'].update_one({"_id": obj_id}, {"$set": delegate})

        return jsonify({"data": delegate}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



@delegates.route('/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_delegate(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        delegate = db['delegates'].find_one({"_id": obj_id})

        if not delegate:
            return jsonify({'error': 'Delegado no encontrado'}), HTTPStatus.NOT_FOUND

        # Eliminar el Delegado de la base de datos
        db['delegates'].delete_one({"_id": obj_id})
        
        return jsonify({"message": "Delegado eliminado correctamente"}), HTTPStatus.OK
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


