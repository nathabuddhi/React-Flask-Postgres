# app.py
from flask import Flask
from flask_cors import CORS
from config import Config
from models import db
from flask_jwt_extended import JWTManager

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    # Initialize extensions
    JWTManager(app)
    db.init_app(app)
    
    # Register blueprints
    from api.auth import auth_bp
    from api.product import product_bp
    from api.cart import cart_bp
    from api.checkout import checkout_bp
    from api.order import order_bp
    app.register_blueprint(order_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(auth_bp)
    
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True)