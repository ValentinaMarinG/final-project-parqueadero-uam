from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt,get_jwt_identity
from http import HTTPStatus
from src.database import db
from bson import ObjectId
from bson.errors import InvalidId
from cerberus import Validator

from src.models.parking import Parking
parking = Blueprint("parking",
                    __name__,
                    url_prefix="/api/v1/parking")

    
schema = {
    'name':{'type': 'string', 'required': True},
    'type':{'type': 'string', 'required': True},
    'numberofCars':{'type': 'integer', 'required': True},
    'payable':{'type': 'boolean', 'required': True}, 
    'price':{'type':'float', 'required':True},
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
    'payments': {
        'type': 'list',
        'required': False,
        'schema': {
            'type': 'boolean'
        },
        'minlength': 0,
        'maxlength': 10
    },
    'categoryId': {'required': True}
}


schema_patch= {
    'name':{'type': 'string', 'required': False},
    'type':{'type': 'string', 'required': False},
    'numberofCars':{'type': 'int', 'required': False},
    'payable':{'type': 'boolean', 'required': False}, 
    'price':{'type':'float'},
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
    'payments': {
        'type': 'list',
        'required': False,
        'schema': {
            'type': 'boolean'
        },
        'minlength': 0,
        'maxlength': 10
    },
    'categoryId': {'required': False}
}



#Listar todos los parqueaderos, permisos de admin
@parking.route("/all", methods=["GET"])
@jwt_required()
def read_all():
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    parking = db['parking'].find()  # Cambia el nombre de la colección si es necesario
    resultado = [parking for parking in parking]
    return jsonify(resultado)



#Listar la información de un parqueadero por su ID, permisos de admin
@parking.route('/<string:id>', methods=['GET'])
@jwt_required()
def read_one(id):
    claims = get_jwt()
    rol = claims.get('rol')
    if rol != 'admin':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
    obj_id = ObjectId(id)
    parking = db['parking'].find_one({"_id": obj_id})

    if not parking:
        return {"error": "Resource not found"}, HTTPStatus.NOT_FOUND

    return {"data": parking}, HTTPStatus.OK




#Crear parqueadero, permisos de admin
@parking.route('/', methods=['POST'])
@jwt_required()
def create_parking():
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        payable_str = request.form.get('payable')
        if payable_str is not None:
            payable_bool = payable_str.lower() == 'true'
        else:
            payable_bool = False
        
        numberofCars_str = request.form.get('numberofCars')
        if numberofCars_str is not None:
            try:
                numberofCars_int = int(numberofCars_str)
            except ValueError:
                return 'Invalid value for price', HTTPStatus.BAD_REQUEST
        else:
            numberofCars_int = 0
        
        price_str = request.form.get('price')
        if price_str is not None:
            try:
                price_float = float(price_str)
            except ValueError:
                return 'Invalid value for price', HTTPStatus.BAD_REQUEST
        else:
            price_float = 0.0
        
        
            
        # Crear una instancia de parqueadero con los datos recibidos
        parking = Parking(
            name=request.form['name'],
            type=request.form['type'],
            numberofCars=numberofCars_int,
            payable=payable_bool,
            price=price_float,
            plate=[],
            payments= [],
            categoryId=ObjectId(request.form['categoryId']) 
        )
        
        parking_json = parking.to_json(parking)
        validator = Validator(schema)
        if not validator.validate(parking_json):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        # Guardar el parqueadero en la base de datos
        db['parking'].insert_one(parking_json)

        return jsonify({"data": parking_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



#Actualizar parqueadero, permisos de admin
@parking.route('/<string:id>', methods=['PUT','PATCH'])
@jwt_required()
def update_parking(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        parking = db['parking'].find_one({"_id": obj_id})

        if not parking:
            return jsonify({'error': 'parking no encontrado'}), HTTPStatus.NOT_FOUND

        # Actualizar los campos del parking con los datos recibidos
        if 'name' in request.form:
            parking['name'] = request.form['name']
        if 'type' in request.form:
            parking['type'] = request.form['type']
        if 'numberofCars' in request.form:
            numberofCars_str = request.form.get('numberofCars')
            if numberofCars_str is not None:
                try:
                    numberofCars_int = int(numberofCars_str)
                except ValueError:
                    return 'Invalid value for price', HTTPStatus.BAD_REQUEST
            else:
                numberofCars_int = 0
            parking['numberofCars'] = numberofCars_int
        if 'price' in request.form:
            price_str = request.form.get('price')
            if price_str is not None:
                try:
                    price_float = float(price_str)
                except ValueError:
                    return 'Invalid value for price', HTTPStatus.BAD_REQUEST
            else:
                price_float = 0.0
            parking['price'] = price_float
        if 'plate' in request.form:
            parking['plate'] = request.form.getlist('plate[]')
        
        updated_fields = {field: value for field, value in request.form.items() if field in schema}
        validator = Validator(schema_patch)
        if not validator.validate(updated_fields):
            errors = validator.errors
            return {'error': errors}, HTTPStatus.BAD_REQUEST
        
        # Actualizar el documento en la base de datos
        db['parking'].update_one({"_id": obj_id}, {"$set": parking})

        return jsonify({"data": parking}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



#Eliminar parqueadero, permisos de admin
@parking.route('/<string:id>', methods=['DELETE'])
@jwt_required()
def delete_parking(id):
    try:
        claims = get_jwt()
        rol = claims.get('rol')
        if rol != 'admin':
            return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED
        obj_id = ObjectId(id)
        parking = db['parking'].find_one({"_id": obj_id})

        if not parking:
            return jsonify({'error': 'Parqueadero no encontrado'}), HTTPStatus.NOT_FOUND

        # Eliminar la Parqueadero de la base de datos
        db['parking'].delete_one({"_id": obj_id})
        
        return jsonify({"message": "Parqueadero eliminada correctamente"}), HTTPStatus.OK
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST
    



#Agregar placa debido al ingreso de un vehiculo, permisos de delegado
@parking.route('/plate', methods=['POST'])
@jwt_required()
def add_plate_to_parking():
    # Verificar si el usuario tiene rol de delegado
    jwt_data = get_jwt()
    rol = jwt_data.get('rol')
    if rol != 'delegate':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED

    delegate_id = get_jwt_identity()
    obj_id = ObjectId(delegate_id)
    delegate = db['delegates'].find_one({"_id": obj_id})
    id= delegate['parkingId']
    if not id :
        return jsonify({'error': 'No tienes un parqueadero asignado'}), HTTPStatus.BAD_REQUEST

    
    # Obtener el parqueadero por su ID
    parqueadero = db['parking'].find_one({'_id': ObjectId(id)})
    if not parqueadero:
        return jsonify({'error': 'Parqueadero no encontrado'}), HTTPStatus.NOT_FOUND

    plate = request.form.get('plate')
    # Verificar si la placa ya existe en la lista
    if plate in parqueadero['plate']:
        return jsonify({'error': 'La placa ya existe en el parqueadero'}), HTTPStatus.BAD_REQUEST

    # Agregar la placa a la lista
    parqueadero['plate'].append(plate)
    if parqueadero['payable']:
        parqueadero['payments'].append(False)
    else:
        parqueadero['payments'].append(True)
    # Actualizar el parqueadero en la base de datos
    db['parking'].update_one({'_id': ObjectId(id)}, {'$set': {'plate': parqueadero['plate'], 'payments': parqueadero['payments']}})

    return jsonify({'message': 'Placa agregada correctamente'})



#Eliminar una placa debido al retiro de un vehiculo, permisos de delegado
@parking.route('/plate', methods=['DELETE'])
@jwt_required()
def remove_plate_from_parking():
    # Verificar si el usuario tiene rol de delegado
    jwt_data = get_jwt()
    rol = jwt_data.get('rol')
    if rol != 'delegate':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED

    delegate_id = get_jwt_identity()
    obj_id = ObjectId(delegate_id)
    delegate = db['delegates'].find_one({"_id": obj_id})
    id= delegate['parkingId']
    if not id :
        return jsonify({'error': 'No tienes un parqueadero asignado'}), HTTPStatus.BAD_REQUEST
    
    # Obtener el parqueadero por su ID
    parqueadero = db['parking'].find_one({'_id': ObjectId(id)   })
    if not parqueadero:
        return jsonify({'error': 'Parqueadero no encontrado'}), HTTPStatus.NOT_FOUND

    # Obtener la placa a eliminar del cuerpo de la solicitud
    plate = request.form['plate']

    # Verificar si la placa existe en la lista
    if plate not in parqueadero['plate']:
        return jsonify({'error': 'La placa no existe en el parqueadero'}), HTTPStatus.BAD_REQUEST

    index = parqueadero['plate'].index(plate)
    if parqueadero['payments'][index] == False:
        return jsonify({'error': 'El carro no ha pagado'}), HTTPStatus.BAD_REQUEST
    
    parqueadero['plate'].remove(plate)
    del parqueadero['payments'][index]
    # Actualizar el parqueadero en la base de datos
    db['parking'].update_one({'_id': ObjectId(id)}, {'$set': {'plate': parqueadero['plate'], 'payments': parqueadero['payments']}})

    return jsonify({'message': 'Placa eliminada correctamente'})


