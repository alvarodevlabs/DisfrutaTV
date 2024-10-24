import requests
from flask import Blueprint, jsonify, request
from . import db
from .models import Configuration, Favorite, Pending, Viewed, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from .utils import admin_required  # Importa 'utils' desde el paquete 'app'

# Definir el Blueprint
api_bp = Blueprint('api', __name__)

# Rutas para obtener películas y series populares desde TheMovieDB
@api_bp.route('/movies', methods=['GET'])
def get_movies():
    config = Configuration.query.first()
    if not config or not config.themoviedb_api_key:
        return jsonify({"error": "API Key de TheMovieDB no configurada"}), 400

    api_key = config.themoviedb_api_key
    page = request.args.get('page', default=1, type=int)  # Obtiene el número de página del parámetro de consulta
    url = f'https://api.themoviedb.org/3/movie/popular?api_key={api_key}&language=es-ES&page={page}'
    
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Error al obtener las películas de TheMovieDB"}), 500

    data = response.json()
    return jsonify(data['results']), 200


@api_bp.route('/series', methods=['GET'])
def get_series():
    config = Configuration.query.first()
    if not config or not config.themoviedb_api_key:
        return jsonify({"error": "API Key de TheMovieDB no configurada"}), 400

    api_key = config.themoviedb_api_key
    page = request.args.get('page', default=1, type=int)  # Maneja la paginación
    url = f'https://api.themoviedb.org/3/tv/popular?api_key={api_key}&language=es-ES&page={page}'
    
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({"error": "Error al obtener las series de TheMovieDB"}), 500

    data = response.json()
    return jsonify(data['results']), 200


# Rutas para agregar películas a favoritos, pendientes y vistas
@api_bp.route('/movies/<int:movie_id>/add-favorite', methods=['POST'])
@jwt_required()
def add_favorite_movie(movie_id):
    user_identity = get_jwt_identity()
    user_id = user_identity['id']
    print(f"Agregando película {movie_id} a favoritos del usuario {user_id}")

    # Verifica si la película ya está en favoritos
    existing_favorite = Favorite.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if existing_favorite:
        print("La película ya está en favoritos")
        return jsonify({"message": "La película ya está en favoritos"}), 200

    # Agrega la película a favoritos
    new_favorite = Favorite(user_id=user_id, movie_id=movie_id, series_id=None)
    db.session.add(new_favorite)
    db.session.commit()
    print("Película agregada a favoritos exitosamente")

    return jsonify({"message": "Película agregada a favoritos"}), 200



@api_bp.route('/movies/<int:movie_id>/add-pending', methods=['POST'])
@jwt_required()
def add_pending_movie(movie_id):
    user_identity = get_jwt_identity()
    user_id = user_identity['id']

    # Verifica si la película ya está en pendientes
    existing_pending = Pending.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if existing_pending:
        return jsonify({"message": "La película ya está en pendientes"}), 200
    
    # Agrega la película a pendientes
    new_pending = Pending(user_id=user_id, movie_id=movie_id)
    db.session.add(new_pending)
    db.session.commit()
    
    return jsonify({"message": "Película agregada a pendientes"}), 200

@api_bp.route('/movies/<int:movie_id>/add-viewed', methods=['POST'])
@jwt_required()
def add_viewed_movie(movie_id):
    user_identity = get_jwt_identity()
    user_id = user_identity['id']

    # Verifica si la película ya está marcada como vista
    existing_viewed = Viewed.query.filter_by(user_id=user_id, movie_id=movie_id).first()
    if existing_viewed:
        return jsonify({"message": "La película ya está marcada como vista"}), 200
    
    # Marca la película como vista
    new_viewed = Viewed(user_id=user_id, movie_id=movie_id)
    db.session.add(new_viewed)
    db.session.commit()
    
    return jsonify({"message": "Película marcada como vista"}), 200

# Rutas para agregar series a favoritos, pendientes y vistas
@api_bp.route('/series/<int:series_id>/add-favorite', methods=['POST'])
@jwt_required()
def add_favorite_series(series_id):
    user_identity = get_jwt_identity()
    user_id = user_identity['id']

    # Verifica si la serie ya está en favoritos
    existing_favorite = Favorite.query.filter_by(user_id=user_id, series_id=series_id).first()
    if existing_favorite:
        return jsonify({"message": "La serie ya está en favoritos"}), 200
    
    # Agrega la serie a favoritos
    new_favorite = Favorite(user_id=user_id, series_id=series_id)
    db.session.add(new_favorite)
    db.session.commit()
    
    return jsonify({"message": "Serie agregada a favoritos"}), 200

@api_bp.route('/series/<int:series_id>/add-pending', methods=['POST'])
@jwt_required()
def add_pending_series(series_id):
    user_identity = get_jwt_identity()
    user_id = user_identity['id']

    # Verifica si la serie ya está en pendientes
    existing_pending = Pending.query.filter_by(user_id=user_id, series_id=series_id).first()
    if existing_pending:
        return jsonify({"message": "La serie ya está en pendientes"}), 200
    
    # Agrega la serie a pendientes
    new_pending = Pending(user_id=user_id, series_id=series_id)
    db.session.add(new_pending)
    db.session.commit()
    
    return jsonify({"message": "Serie agregada a pendientes"}), 200

@api_bp.route('/series/<int:series_id>/add-viewed', methods=['POST'])
@jwt_required()
def add_viewed_series(series_id):
    user_identity = get_jwt_identity()
    user_id = user_identity['id']

    # Verifica si la serie ya está marcada como vista
    existing_viewed = Viewed.query.filter_by(user_id=user_id, series_id=series_id).first()
    if existing_viewed:
        return jsonify({"message": "La serie ya está marcada como vista"}), 200
    
    # Marca la serie como vista
    new_viewed = Viewed(user_id=user_id, series_id=series_id)
    db.session.add(new_viewed)
    db.session.commit()
    
    return jsonify({"message": "Serie marcada como vista"}), 200

# Rutas para obtener listas de favoritos, pendientes y vistas del usuario
@api_bp.route('/user/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()['id']
    favorites = Favorite.query.filter_by(user_id=user_id).all()

    response = []
    for fav in favorites:
        if fav.movie_id:
            response.append({"id": fav.movie_id, "type": "movie"})
        elif fav.series_id:
            response.append({"id": fav.series_id, "type": "tv"})  # Cambiado a 'tv'
    return jsonify(response), 200

@api_bp.route('/user/pending', methods=['GET'])
@jwt_required()
def get_pending():
    user_id = get_jwt_identity()['id']
    pending = Pending.query.filter_by(user_id=user_id).all()

    response = []
    for pend in pending:
        if pend.movie_id:
            response.append({"id": pend.movie_id, "type": "movie"})
        elif pend.series_id:
            response.append({"id": pend.series_id, "type": "tv"})  # Cambiado a 'tv'
    return jsonify(response), 200

@api_bp.route('/user/viewed', methods=['GET'])
@jwt_required()
def get_viewed():
    user_id = get_jwt_identity()['id']
    viewed = Viewed.query.filter_by(user_id=user_id).all()

    response = []
    for view in viewed:
        if view.movie_id:
            response.append({"id": view.movie_id, "type": "movie"})
        elif view.series_id:
            response.append({"id": view.series_id, "type": "tv"})  # Cambiado a 'tv'
    return jsonify(response), 200

# Ruta para obtener estadísticas del usuario
@api_bp.route('/statistics', methods=['GET'])
@jwt_required()
def get_statistics():
    user_id = get_jwt_identity()['id']

    favorite_movies_count = Favorite.query.filter_by(user_id=user_id).filter(Favorite.movie_id.isnot(None)).count()
    favorite_series_count = Favorite.query.filter_by(user_id=user_id).filter(Favorite.series_id.isnot(None)).count()

    pending_movies_count = Pending.query.filter_by(user_id=user_id).filter(Pending.movie_id.isnot(None)).count()
    pending_series_count = Pending.query.filter_by(user_id=user_id).filter(Pending.series_id.isnot(None)).count()

    viewed_movies_count = Viewed.query.filter_by(user_id=user_id).filter(Viewed.movie_id.isnot(None)).count()
    viewed_series_count = Viewed.query.filter_by(user_id=user_id).filter(Viewed.series_id.isnot(None)).count()

    return jsonify({
        "favoriteMoviesCount": favorite_movies_count,
        "favoriteSeriesCount": favorite_series_count,
        "pendingMoviesCount": pending_movies_count,
        "pendingSeriesCount": pending_series_count,
        "viewedMoviesCount": viewed_movies_count,
        "viewedSeriesCount": viewed_series_count
    }), 200

@api_bp.route('/users', methods=['GET', 'POST'])
@jwt_required()  # Requiere autenticación JWT
def manage_users():
    if request.method == 'GET':
        users = User.query.all()  # Obtener todos los usuarios
        users_data = [{
            "id": user.id,
            "username": user.username,
            "email": user.email
        } for user in users]  # Convertir los usuarios en JSON
        return jsonify(users_data), 200

    elif request.method == 'POST':
        # Datos del nuevo usuario desde el frontend
        data = request.get_json()
        username = data.get('username')
        email = data.get('email')
        password = data.get('password')

        if not username or not email or not password:
            return jsonify({"error": "Faltan datos para crear el usuario"}), 400

        # Crea un nuevo usuario
        new_user = User(username=username, email=email)
        new_user.set_password(password)  # Asegúrate de tener una función para encriptar la contraseña
        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email
        }), 201


@api_bp.route('/user/profile', methods=['GET', 'PUT'])
@jwt_required()
def user_profile():
    try:
        # Verifica qué valor devuelve get_jwt_identity()
        user_identity = get_jwt_identity()
        print(f"User identity from JWT: {user_identity}")

        # Si user_identity es un diccionario, extrae el ID. Si es un número, úsalo directamente.
        if isinstance(user_identity, dict):
            user_id = user_identity.get('id')
        else:
            user_id = user_identity
        
        if not user_id:
            return jsonify({"error": "ID de usuario no encontrado en JWT"}), 400

        # Usa filter_by para obtener el usuario
        user = User.query.filter_by(id=user_id).first()

        if not user:
            return jsonify({"error": "Usuario no encontrado"}), 404

        if request.method == 'GET':
            return jsonify({
                "id": user.id,
                "username": user.username,
                "email": user.email
            }), 200

        elif request.method == 'PUT':
            data = request.get_json()
            user.username = data.get('username', user.username)
            user.email = data.get('email', user.email)

            if 'password' in data and data['password']:
                user.set_password(data['password'])

            db.session.commit()
            return jsonify({"message": "Perfil actualizado correctamente"}), 200

    except Exception as e:
        print(f"Error en el perfil de usuario: {e}")
        return jsonify({"error": "Error interno en el servidor"}), 500

# Rutas para eliminar de favoritos, pendientes y vistas

from flask_jwt_extended import jwt_required, get_jwt_identity
from .models import Favorite, Pending, Viewed
from . import db

# Eliminar película de favoritos
@api_bp.route('/movies/<int:movie_id>/remove-favorite', methods=['DELETE'])
@jwt_required()
def remove_favorite_movie(movie_id):
    user_id = get_jwt_identity()['id']
    favorite = Favorite.query.filter_by(user_id=user_id, movie_id=movie_id).first()

    if not favorite:
        return jsonify({"message": "La película no está en favoritos"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Película eliminada de favoritos"}), 200

# Eliminar película de pendientes
@api_bp.route('/movies/<int:movie_id>/remove-pending', methods=['DELETE'])
@jwt_required()
def remove_pending_movie(movie_id):
    user_id = get_jwt_identity()['id']
    pending = Pending.query.filter_by(user_id=user_id, movie_id=movie_id).first()

    if not pending:
        return jsonify({"message": "La película no está en pendientes"}), 404

    db.session.delete(pending)
    db.session.commit()

    return jsonify({"message": "Película eliminada de pendientes"}), 200

# Eliminar película de vistas
@api_bp.route('/movies/<int:movie_id>/remove-viewed', methods=['DELETE'])
@jwt_required()
def remove_viewed_movie(movie_id):
    user_id = get_jwt_identity()['id']
    viewed = Viewed.query.filter_by(user_id=user_id, movie_id=movie_id).first()

    if not viewed:
        return jsonify({"message": "La película no está en vistas"}), 404

    db.session.delete(viewed)
    db.session.commit()

    return jsonify({"message": "Película eliminada de vistas"}), 200


@api_bp.route('/series/<int:series_id>/remove-favorite', methods=['DELETE'])
@jwt_required()
def remove_favorite_series(series_id):
    user_id = get_jwt_identity()['id']
    favorite = Favorite.query.filter_by(user_id=user_id, series_id=series_id).first()

    if not favorite:
        return jsonify({"message": "La serie no está en favoritos"}), 404

    db.session.delete(favorite)
    db.session.commit()

    return jsonify({"message": "Serie eliminada de favoritos"}), 200

# Eliminar serie de pendientes
@api_bp.route('/series/<int:series_id>/remove-pending', methods=['DELETE'])
@jwt_required()
def remove_pending_series(series_id):
    user_id = get_jwt_identity()['id']
    pending = Pending.query.filter_by(user_id=user_id, series_id=series_id).first()

    if not pending:
        return jsonify({"message": "La serie no está en pendientes"}), 404

    db.session.delete(pending)
    db.session.commit()

    return jsonify({"message": "Serie eliminada de pendientes"}), 200

# Eliminar serie de vistas
@api_bp.route('/series/<int:series_id>/remove-viewed', methods=['DELETE'])
@jwt_required()
def remove_viewed_series(series_id):
    user_id = get_jwt_identity()['id']
    viewed = Viewed.query.filter_by(user_id=user_id, series_id=series_id).first()

    if not viewed:
        return jsonify({"message": "La serie no está en vistas"}), 404

    db.session.delete(viewed)
    db.session.commit()

    return jsonify({"message": "Serie eliminada de vistas"}), 200

# routes.py

# Ruta para obtener y actualizar la configuración
@api_bp.route('/config', methods=['GET', 'PUT'])
@jwt_required()       # Requiere autenticación JWT
@admin_required      # Requiere rol de administrador
def config():
    if request.method == 'GET':
        config = Configuration.query.first()
        if not config:
            print("Configuración no encontrada")  # Log
            return jsonify({"error": "Configuración no encontrada"}), 404
        
        print("Configuración obtenida exitosamente")  # Log
        return jsonify({
            "themdb_api_key": config.themoviedb_api_key,  # Mantener el nombre correcto
            # Añade más campos de configuración si es necesario
        }), 200

    elif request.method == 'PUT':
        data = request.get_json()
        themoviedb_api_key = data.get('themdb_api_key')  # Asegúrate de usar 'themdb_api_key'

        if not themoviedb_api_key:
            print("Faltan datos para actualizar la configuración")  # Log
            return jsonify({"error": "Faltan datos para actualizar la configuración"}), 400

        config = Configuration.query.first()
        if not config:
            print("No existe configuración previa. Creando una nueva.")  # Log
            # Si no existe una configuración, crea una nueva
            config = Configuration(themoviedb_api_key=themdb_api_key)
            db.session.add(config)
        else:
            print(f"Actualizando clave API de {config.themoviedb_api_key} a {themdb_api_key}")  # Log
            # Actualiza la clave API existente
            config.themoviedb_api_key = themoviedb_api_key

        db.session.commit()
        print("Configuración actualizada correctamente")  # Log

        return jsonify({"message": "Configuración actualizada correctamente"}), 200