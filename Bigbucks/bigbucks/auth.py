import sqlite3
from flask import Flask, g, jsonify, request, session, flash, redirect, url_for, Blueprint
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = 'our_secret_key'  

DATABASE = '/path/to/your/database.db'

bp = Blueprint('auth', __name__, url_prefix='/auth')

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DATABASE)
        g.db.row_factory = sqlite3.Row
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()

@bp.route('/register/', methods=['POST'])
def register():
    db = get_db()
    cur = db.cursor()
    username = request.json['username']
    password = generate_password_hash(request.json['password'])
    email = request.json.get('email', '')
    firstname = request.json.get('first_name', '')
    lastname = request.json.get('last_name', '')
    phonenum = request.json.get('phone_number', '')
    role = 'user'

    try:
        cur.execute('INSERT INTO user (username, password, first_name, last_name, phone_number, email, account_balance, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    (username, password, firstname, lastname, phonenum, email, 1000000, role))
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({'error': f'User {username} is already registered.'}), 400

    return jsonify({'status': 'Success'}), 201

@bp.route('/login/<user_role>', methods=['POST'])
def login(user_role):
    db = get_db()
    cur = db.cursor()
    username = request.json['username']
    password = request.json['password']

    cur.execute('SELECT * FROM user WHERE username = ? AND role = ?', (username, user_role))
    user = cur.fetchone()

    if user is None:
        return jsonify({'error': 'Incorrect username or role.'}), 400

    if not check_password_hash(user['password'], password):
        return jsonify({'error': 'Incorrect password.'}), 400

    session.clear()
    session['user_id'] = user['id']
    session['user_role'] = user['role']

    return jsonify({'status': 'Success'}), 200

app.register_blueprint(bp)

if __name__ == '__main__':
    app.run(debug=True)






