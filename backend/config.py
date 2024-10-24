import os

class Config:
    SECRET_KEY = os.environ.get('CLAVETV') or 'clavetv'  # Asegúrate de que sea un string
    SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'  # Base de datos SQLite para desarrollo
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'

    # Configuración para Flask-Mail
    MAIL_SERVER = 'mail.hostinsane.es'
    MAIL_PORT = int(os.environ.get('MAIL_PORT') or 587)
    MAIL_USE_SSL = False  # Usar SSL para el puerto 465
    MAIL_USERNAME = os.environ.get('MAIL_USERNAME') or 'disfruta@hostinsane.es'
    MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD') or '$YP-^DMoTB5q'
    MAIL_DEFAULT_SENDER = os.environ.get('MAIL_DEFAULT_SENDER') or 'disfruta@hostinsane.es'
