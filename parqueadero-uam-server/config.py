from os import environ 
class Config:    
    """Base config"""    
    FLASK_APP = environ.get('FLASK_APP')    
    ENVIRONMENT = environ.get('ENVIRONMENT') 

class DevelopmentConfig(Config):    
    """Development config"""    
    SECRET_KEY = environ.get('DEVELOPMENT_SECRET_KEY')    
    TESTING = True 
    
class ProductionConfig(Config):    
    """Production config"""    
    SECRET_KEY = environ.get('PRODUCTION_SECRET_KEY')    
    TESTING = False
