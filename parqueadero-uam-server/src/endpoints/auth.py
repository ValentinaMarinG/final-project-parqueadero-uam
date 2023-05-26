from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from http import HTTPStatus
from bson import ObjectId
from werkzeug.security import check_password_hash
from src.database import db
from src.models.user import User
import base64

from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization

# Cargar la clave privada desde el archivo
with open('private_key.pem', 'rb') as f:
    private_pem = f.read()
private_key = serialization.load_pem_private_key(private_pem, password=None)


auth = Blueprint("auth",
                    __name__,
                    url_prefix="/api/v1/auth")

@auth.route("/login", methods=["POST"])
def authentication_login():
    email = request.json.get("email")
    password = request.json.get("password")
    decrypted_password = private_key.decrypt(
    password,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=padding.SHA256()),
        algorithm=padding.SHA256(),
        label=None
        )
    )
    user = db['users'].find_one({"email": email})
    rol = 'user'
    if not user:
        user = db['delegates'].find_one({"email": email})
        rol = 'delegate'
        if not user:
            user = db['admin'].find_one({"email": email})
            rol = 'admin'

    if not user or not check_password_hash(user['password'], decrypted_password):
        return {"error": "Wrong email or password"}, HTTPStatus.UNAUTHORIZED

    if not user.get('active', False):
        return {"error": "Account is not active"}, HTTPStatus.UNAUTHORIZED

    access_token = create_access_token(identity=str(user["_id"]), additional_claims={'rol': rol})
    refresh_token = create_refresh_token(identity=str(user["_id"]), additional_claims={'rol': rol})

    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}),HTTPStatus.OK


# Generar el par de claves
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)
public_key = private_key.public_key()

# Serializar y guardar la clave privada
private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)
with open('private_key.pem', 'wb') as f:
    f.write(private_pem)

# Serializar y guardar la clave pública
public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)
with open('public_key.pem', 'wb') as f:
    f.write(public_pem)

from flask import send_file

@auth.route("/public-key", methods=["GET"])
def public_key():

    with open('public_key.pem', 'rb') as f:
        public_key = f.read()
        encoded_key = base64.b64encode(public_key).decode('utf-8')


    # Construir la respuesta con la clave pública en formato PEM
    # Retornar la respuesta con la clave pública en formato PEM y el encabezado apropiado
    return public_key, HTTPStatus.OK

