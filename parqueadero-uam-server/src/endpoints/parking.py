from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from http import HTTPStatus
from src.database import db
from bson import ObjectId
from cerberus import Validator

from src.models.parking import Parking
parking = Blueprint("parking",
                    __name__,
                    url_prefix="/api/v1/parking")

schema = {
    'name':{'type': 'string', 'required': True},
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
        # Guardar el parqueadero en la base de datos
        db['parking'].insert_one(parking_json)

        return jsonify({"data": parking_json}), HTTPStatus.CREATED
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



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
        
        # Actualizar el documento en la base de datos
        db['parking'].update_one({"_id": obj_id}, {"$set": parking})

        return jsonify({"data": parking}), HTTPStatus.OK
        
    except Exception as e:
        return jsonify({'error': str(e)}), HTTPStatus.BAD_REQUEST



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
    


@parking.route('/<string:id>/plateI', methods=['PUT'])
@jwt_required()
def add_plate_to_parqueadero(id):
    # Verificar si el usuario tiene rol de delegado
    jwt_data = get_jwt()
    rol = jwt_data.get('rol')
    if rol != 'delegate':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED

    # Obtener el parqueadero por su ID
    parqueadero = db['parking'].find_one({'_id': ObjectId(id)})
    if not parqueadero:
        return jsonify({'error': 'Parqueadero no encontrado'}), HTTPStatus.NOT_FOUND

    # Obtener la placa del cuerpo de la solicitud
    plate = request.form.getlist('plate')
    # Verificar si la placa ya existe en la lista
    if plate in parqueadero['plate']:
        return jsonify({'error': 'La placa ya existe en el parqueadero'}), HTTPStatus.BAD_REQUEST

    # Agregar la placa a la lista
    parqueadero['plate'].append(plate)
    if parqueadero['playable'] == True:
        parqueadero['payments'].append(False)
    else :
        parqueadero['payments'].append(True)
    # Actualizar el parqueadero en la base de datos
    db['parking'].update_one({'_id': id}, {'$set': {'plate': parqueadero['plate'], 'payments':parqueadero['payments']}})

    return jsonify({'message': 'Placa agregada correctamente'})

@parking.route('/<string:id>/plateO', methods=['PUT'])
@jwt_required()
def remove_plate_from_parqueadero(id):
    # Verificar si el usuario tiene rol de delegado
    jwt_data = get_jwt()
    rol = jwt_data.get('rol')
    if rol != 'delegate':
        return {"error": "Unauthorized"}, HTTPStatus.UNAUTHORIZED

    # Obtener el parqueadero por su ID
    parqueadero = db['parking'].find_one({'_id': id})
    if not parqueadero:
        return jsonify({'error': 'Parqueadero no encontrado'}), HTTPStatus.NOT_FOUND

    # Obtener la placa a eliminar del cuerpo de la solicitud
    plate = request.json.get('plate')

    # Verificar si la placa existe en la lista
    if plate not in parqueadero['plate']:
        return jsonify({'error': 'La placa no existe en el parqueadero'}), HTTPStatus.BAD_REQUEST

    index = parqueadero['plate'].index(plate)
    if parqueadero['payments'][index] == False:
        return jsonify({'error': 'El carro no ha pagado'}), HTTPStatus.BAD_REQUEST
    
    parqueadero['plate'].remove(plate)
    del parqueadero['payments'][index]
    # Actualizar el parqueadero en la base de datos
    db['parking'].update_one({'_id': id}, {'$set': {'plate': parqueadero['plate'], 'payments': parqueadero['payments']}})

    return jsonify({'message': 'Placa eliminada correctamente'})


