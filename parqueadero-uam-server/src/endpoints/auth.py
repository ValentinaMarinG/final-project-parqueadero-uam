from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token
from http import HTTPStatus
from bson import ObjectId
from werkzeug.security import check_password_hash
from src.database import db
from src.models.user import User


auth = Blueprint("auth",
                    __name__,
                    url_prefix="/api/v1/auth")

@auth.route("/login", methods=["POST"])
def authentication_login():
    email = request.json.get("email")
    password = request.json.get("password")
    user = db['users'].find_one({"email": email})
    rol = 'user'
    if not user:
        user = db['delegates'].find_one({"email": email})
        rol = 'delegate'
        if not user:
            user = db['admin'].find_one({"email": email})
            rol = 'admin'

    if not user or not check_password_hash(user['password'], password):
        return {"error": "Wrong email or password"}, HTTPStatus.UNAUTHORIZED

    if not user.get('active', False):
        return {"error": "Account is not active"}, HTTPStatus.UNAUTHORIZED

    access_token = create_access_token(identity=str(user["_id"]), additional_claims={'rol': rol})
    refresh_token = create_refresh_token(identity=str(user["_id"]), additional_claims={'rol': rol})

    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}),HTTPStatus.OK
