import os
from flask import Flask
from flask_cors import CORS
from flask import Flask, send_from_directory

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True, static_folder='public')
    CORS(app)

    app.config.from_mapping(
        SECRET_KEY='dev',
        DATABASE=os.path.join(app.instance_path, 'bigbucks.sqlite'),
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)

    # ensure the instance folder exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    # Register the blueprint with the app
    # from .trade import bp as trade_bp
    # app.register_blueprint(trade_bp)

    from . import db
    db.init_app(app)

    from . import auth
    app.register_blueprint(auth.bp)
    
    from . import trade
    app.register_blueprint(trade.bp)
    
    # from . import transactions
    # app.register_blueprint(transactions.bp)

    # @app.route('/')
    # def serve():
    #     return send_from_directory(app.static_folder, 'index.html')

    return app
