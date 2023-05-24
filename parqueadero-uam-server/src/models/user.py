from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import re 

from src.database import db

tiposDocumentoValidos = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de identidad']


class User:
    def __init__(self, documentType, documentNumber, firstname, lastname, email, phoneNumber, password, plate, active, avatar):
        self.documentType = documentType
        self.documentNumber = documentNumber
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.phoneNumber = phoneNumber
        self.password = password
        self.plate = plate
        self.active = active
        self.avatar = avatar

    @staticmethod
    def to_json(User):
        return User.__dict__
    
    def __repr__(self) -> str:
        return f"User >>> {self.firstname} {self.lastname}"
    
    def __setattr__(self, name, value):
        if(name == "password"):
            value = User.hash_password(value)
        
        super(User, self).__setattr__(name, value)
        
    @staticmethod
    def hash_password(password):
        if not password:
            raise AssertionError("Password not provided")
        
        if not re.match("^(?=.*\d)(?=.*[A-Z]).+$", password):
            raise AssertionError("Password must contain 1 capital letter and 1 number")
        
        if len(password) < 8 or len(password) > 50:
            raise AssertionError("Password must be between 8 and 50 characters")
        
        return generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password, password)
    



