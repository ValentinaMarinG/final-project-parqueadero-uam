from flask import Flask
from os import environ
import datetime
from src.database import db, jwt
from flask_pymongo import PyMongo
from src.endpoints.users import users
from src.endpoints.auth import auth
from src.endpoints.delegate import delegates
from src.endpoints.categories import categories
from src.endpoints.parking import parking
from src.endpoints.admin import admin
from bson import ObjectId
from flask.json import JSONEncoder
from flask_cors import CORS

class CustomJSONEncoder(JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)
mongo = PyMongo()

def create_app(test_config=None):
    app = Flask(__name__,
                instance_relative_config=True)
    app.config['ENVIRONMENT'] = environ.get("ENVIRONMENT")    
    config_class = 'config.DevelopmentConfig'        
    app.json_encoder = CustomJSONEncoder
    match app.config['ENVIRONMENT']:        
        case "development":            
            config_class = 'config.DevelopmentConfig'        
        case "production":
            config_class = 'config.ProductionConfig'
        case _:
            print(f"ERROR: environment unknown: {app.config.get('ENVIRONMENT')}")
    app.config['MONGO_URI'] = environ.get("MONGO_URI")
    app.config['MONGO_DBNAME'] = "software_db"
    app.config['ENVIRONMENT'] = "development"    
    app.config["JWT_SECRET_KEY"] = environ.get('DEVELOPMENT_JWT_SECRET_KEY')
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 3600  # Duración de 1 hora para los tokens de acceso
    app.config['JWT_REFRESH_TOKEN_EXPIRES'] = 2592000  # Duración de 30 días para los tokens de actualización

    app.config.from_object(config_class)        
    CORS(app)
    app.register_blueprint(users)
    app.register_blueprint(delegates)
    app.register_blueprint(categories)
    app.register_blueprint(parking)
    app.register_blueprint(admin)
    app.register_blueprint(auth)
    mongo.init_app(app)
    jwt.init_app(app)
    return app
