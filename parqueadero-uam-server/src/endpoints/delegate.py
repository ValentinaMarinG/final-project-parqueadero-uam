from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from http import HTTPStatus
from werkzeug.utils import secure_filename
import os
from src.database import db
from bson import ObjectId
from cerberus import Validator

from src.models.delegate import Delegate
delegates = Blueprint("delegates",
                    __name__,
                    url_prefix="/api/v1/delegates")


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
    'position':{'type':'string','required': True},
}


schema_patch = {
            'documentType': {'type': 'string', 'allowed': ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de identidad'], 'required': False},
            'documentNumber': {'type': 'string', 'required': False},
            'firstname': {'type': 'string', 'required': False},
            'lastname': {'type': 'string', 'required': False},
            'email': {'type': 'string', 'regex': r'^[\w+\-.]+@[a-z\d\-]+(\.[a-z]+)*\.[a-z]+$', 'coerce': lambda x: x.lower(), 'required': False},
            'phoneNumber': {'type': 'string', 'required': False},
            'position':{'type':'string','required': False},
}

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
            active=True,
            avatar="",
            parkingId= ObjectId(request.form['parkingId'])
        )
        
        delegate_json = delegate.to_json(delegate)
        validator = Validator(schema)
        if not validator.validate(delegate_json):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        # Guardar el    delegate en la base de datos
        db['delegates'].insert_one(delegate_json)

        return jsonify({"data": delegate_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



@delegates.route('/<string:documento>', methods=['PUT','PATCH'])
@jwt_required()
def update_delegate(documento):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        delegate = db['delegates'].find_one({"documentNumber": documento})

        if not delegate:
            return jsonify({'error': 'Delegado no encontrado'}), HTTPStatus.NOT_FOUND

        # Actualizar los campos del delegado con los datos recibidos
        if 'documentType' in request.form:
            delegate['documentType'] = request.form['documentType']
        if 'documentNumber' in request.form:
            #validar numero de documento
            documentNumber=request.form['documentNumber']
            # Verificar si ya existe un usuario con el mismo documentNumber
            existing_delegate = db['delegates'].find_one({'documentNumber': documentNumber})
            if existing_delegate:
                return {'error': 'Ya existe un usuario con el mismo número de documento'}, HTTPStatus.BAD_REQUEST  
            delegate['documentNumber'] = documentNumber
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
        
        updated_fields = {field: value for field, value in request.form.items() if field in schema}
        validator = Validator(schema_patch)
        if not validator.validate(updated_fields):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        
        # Actualizar el documento en la base de datos
        db['delegates'].update_one({"documentNumber": documento}, {"$set": delegate})

        return jsonify({"data": delegate}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



@delegates.route('/<string:documento>', methods=['DELETE'])
@jwt_required()
def delete_delegate(documento):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        delegate = db['delegates'].find_one({"documentNumber": documento})

        if not delegate:
            return jsonify({'error': 'Delegado no encontrado'}), HTTPStatus.NOT_FOUND

        # Eliminar el Delegado de la base de datos
        db['delegates'].delete_one({"documentNumber": documento})
        
        return jsonify({"message": "Delegado eliminado correctamente"}), HTTPStatus.OK
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST


