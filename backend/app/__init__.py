from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS

# Inicializar las extensiones (sin app todavía)
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()  # Inicializar Flask-Mail
blacklist = set()  # Lista negra de tokens revocados

def create_app():
    app = Flask(__name__)

    # Cargar configuración de la aplicación
    app.config.from_object('backend.config.Config')

    # Configuración del servidor de correo
    app.config['MAIL_SERVER'] = 'smail.hostinsane.es'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USE_SSL'] = True  # Cambia MAIL_USE_TLS por MAIL_USE_SSL para el puerto 465
    app.config['MAIL_USERNAME'] = 'disfruta@hostinsane.es'
    app.config['MAIL_PASSWORD'] = '$YP-^DMoTB5q'

    # Inicializar las extensiones con la aplicación
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)  # Inicializar Mail
    CORS(app)

    # Configurar el token_in_blocklist_loader
    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in blacklist

    # Importar y registrar los blueprints después de inicializar db
    from .routes import api_bp
    from .auth import auth_bp

    app.register_blueprint(api_bp, url_prefix='/api')  # Registrar rutas de API
    app.register_blueprint(auth_bp, url_prefix='/auth')  # Registrar rutas de autenticación

    return app

app = create_app()  # Crear la instancia de la aplicación

if __name__ == "__main__":
    app.run(debug=True)
