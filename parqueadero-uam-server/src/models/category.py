from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
import re 

from src.database import db



class Category:
    def __init__(self, services, accessibility, reserved):
        self.services = services
        self.accessibility = accessibility
        self.reserved = reserved

    @staticmethod
    def to_json(Category):
        return Category.__dict__
    
    def __repr__(self) -> str:
        return f"Category >>> {self.name}"
    
    def __setattr__(self, name, value):
        if(name == "password"):
            value = Category.hash_password(value)
        
        super(Category, self).__setattr__(name, value)
        
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

