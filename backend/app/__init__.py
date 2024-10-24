from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_cors import CORS

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()
mail = Mail()  
blacklist = set()  

def create_app():
    app = Flask(__name__)

    app.config.from_object('backend.config.Config')

    app.config['MAIL_SERVER'] = 'mail.hostinsane.es'
    app.config['MAIL_PORT'] = 465
    app.config['MAIL_USE_SSL'] = True  
    app.config['MAIL_USERNAME'] = 'disfruta@hostinsane.es'
    app.config['MAIL_PASSWORD'] = '$YP-^DMoTB5q'

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    mail.init_app(app)  
    CORS(app)


    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        jti = jwt_payload["jti"]
        return jti in blacklist


    @app.route('/')
    def index():
        return "Backend is running!"


    @app.before_first_request
    def create_default_configuration():
        from .models import Configuration

        config = Configuration.query.first()
        if not config:
            initial_api_key = '05902896074695709d7763505bb88b4d'  
            config = Configuration(themoviedb_api_key=initial_api_key)
            db.session.add(config)
            db.session.commit()


    from .routes import api_bp
    from .auth import auth_bp

    app.register_blueprint(api_bp, url_prefix='/api') 
    app.register_blueprint(auth_bp, url_prefix='/auth') 

    return app

app = create_app() 

if __name__ == "__main__":
    app.run(debug=True)
