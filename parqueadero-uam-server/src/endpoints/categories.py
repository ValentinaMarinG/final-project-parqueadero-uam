from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from http import HTTPStatus
from werkzeug.utils import secure_filename
import os
from src.database import db
from bson import ObjectId
from cerberus import Validator

from src.models.category import Category
categories = Blueprint("categories",
                    __name__,
                    url_prefix="/api/v1/categories")


schema = {
    "services":{'type': 'string', 'required': True},
    "accessibility":{'type': 'boolean', 'required': True},
    "reserved":{'type': 'boolean', 'required': True}
}


@categories.route("/all", methods=["GET"])
@jwt_required()
def read_all():
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    categories = db['categories'].find()  # Cambia el nombre de la colección si es necesario
    resultado = [category for category in categories]
    return jsonify(resultado)


@categories.route('/<string:id>', methods=['GET'])
@jwt_required()
def read_one(id):
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    obj_id = ObjectId(id)
    category = db['categories'].find_one({"_id": obj_id})

    if not category:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": category}, HTTPStatus.OK

@categories.route('/', methods=['POST'])
@jwt_required()
def create_category():
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        accesitibility_str = request.form.get('accessibility')
        if accesitibility_str is not None:
            accesibility_bool = accesitibility_str.lower() == 'true'
        else:
            accesibility_bool = False
        
        reserved_str = request.form.get('reserved')
        if reserved_str is not None:
            reserved_bool = reserved_str.lower() == 'true'
        else:
            reserved_bool = False
        
        # Crear una instancia de categoria con los datos recibidos
        category = Category(
            services=request.form['services'],
            accessibility=accesibility_bool,
            reserved=reserved_bool,
        )
        category_json = category.to_json(category)
        validator = Validator(schema)
        if not validator.validate(category_json):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        
        # Guardar la categoria en la base de datos
        db['categories'].insert_one(category_json)

        return jsonify({"data": category_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



@categories.route('/<string:id>', methods=['PUT','PATCH'])
@jwt_required()
def update_category(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        category = db['categories'].find_one({"_id": obj_id})

        if not category:
            return jsonify({'error': 'category no encontrado'}), HTTPStatus.NOT_FOUND

        # Actualizar los campos del category con los datos recibidos
        if 'services' in request.form:
            category['services'] = request.form['services']
        if 'accessibility' in request.form:
            accesitibility_str = request.form.get('accessibility')
            if accesitibility_str is not None:
                accesibility_bool = accesitibility_str.lower() == 'true'
            else:
                accesibility_bool = False
            category['accessibility'] = accesibility_bool
        if 'reserved' in request.form:
            reserved_str = request.form.get('reserved')
            if reserved_str is not None:
                reserved_bool = reserved_str.lower() == 'true'
            else:
                reserved_bool = False
            category['reserved'] = reserved_bool
        
        # Actualizar el documento en la base de datos
        db['categories'].update_one({"_id": obj_id}, {"$set": category})

        return jsonify({"data": category}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



@categories.route('/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_category(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        category = db['categories'].find_one({"_id": obj_id})

        if not category:
            return jsonify({'error': 'Categoria no encontrada'}), HTTPStatus.NOT_FOUND

        # Eliminar la Categoria de la base de datos
        db['categories'].delete_one({"_id": obj_id})
        
        return jsonify({"message": "Categoria eliminada correctamente"}), HTTPStatus.OK
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST

