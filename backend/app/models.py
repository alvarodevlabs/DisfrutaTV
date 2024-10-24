from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from itsdangerous import URLSafeTimedSerializer
from flask import current_app

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    favorites = db.relationship('Favorite', backref='user', lazy='dynamic')
    pendings = db.relationship('Pending', backref='user', lazy='dynamic')
    viewed_movies = db.relationship('Viewed', backref='user', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_reset_token(self, expires_sec=1800):
        """Genera un token para restablecer la contraseña, válido por 30 minutos"""
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        return s.dumps({'user_id': self.id})


    @staticmethod
    def verify_reset_token(token):
        """Verifica el token de restablecimiento de contraseña"""
        s = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
        try:
            user_id = s.loads(token)['user_id']
        except Exception:
            return None
        return User.query.get(user_id)


class Movie(db.Model):
    __tablename__ = 'movies'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    favorites = db.relationship('Favorite', backref='movie', lazy='dynamic', foreign_keys="Favorite.movie_id")
    pendings = db.relationship('Pending', backref='movie', lazy='dynamic', foreign_keys="Pending.movie_id")
    viewed_movies = db.relationship('Viewed', backref='movie', lazy='dynamic', foreign_keys="Viewed.movie_id")


class Series(db.Model):
    __tablename__ = 'series'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relaciones
    favorites = db.relationship('Favorite', backref='series', lazy='dynamic', foreign_keys="Favorite.series_id")
    pendings = db.relationship('Pending', backref='series', lazy='dynamic', foreign_keys="Pending.series_id")
    viewed_series = db.relationship('Viewed', backref='series', lazy='dynamic', foreign_keys="Viewed.series_id")


class Configuration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    themoviedb_api_key = db.Column(db.String(128), nullable=False)


class Favorite(db.Model):
    __tablename__ = 'favorites'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=True)
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=True)


class Pending(db.Model):
    __tablename__ = 'pending'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=True)
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=True)


class Viewed(db.Model):
    __tablename__ = 'viewed'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    movie_id = db.Column(db.Integer, db.ForeignKey('movies.id'), nullable=True)
    series_id = db.Column(db.Integer, db.ForeignKey('series.id'), nullable=True)
