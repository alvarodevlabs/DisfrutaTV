import os

class Config:
    SECRET_KEY = os.environ.get('CLAVETV') or 'clavetv'  
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db' 
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'

    MAIL_SERVER = 'mail.hostinsane.es'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_SSL = False  
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'disfruta@hostinsane.es'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or '$YP-^DMoTB5q'
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'disfruta@hostinsane.es'
