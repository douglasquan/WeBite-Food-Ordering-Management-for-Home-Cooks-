from flask import *
import requests
import os
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
import sqlite3
from datetime import datetime
import uuid
from urllib.parse import parse_qs
from requests.exceptions import RequestException

app = Flask(__name__)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db', 'user.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


# -------------------------Account creation-------------------------
class User(db.Model):
    user_id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    phone_number = db.Column(db.String(20), unique=True)

with app.app_context():
    db.create_all()


@app.route("/user", methods=["POST"])
def create_account():
    if request.method == "POST":
        try:
            data = request.json
            user = User(
                username=data['username'],
                email=data['email'],
                password=data['password'],
                phone_number=data['phone_number']
            )
            db.session.add(user)
            db.session.commit()
            return jsonify({'message': 'New user created', 'user_id': user.user_id}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "Duplicate entry, the user already exists"}), 409  # 409 Conflict
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400


@app.route('/user/<int:user_id>', methods=['GET'])
def get_account(user_id):
    user = User.query.get_or_404(user_id)
    return jsonify({
        'user_id': user.user_id,
        'username': user.username,
        'email': user.email,
        'password': user.password,
        'created_at': user.created_at,
        'phone_number': user.phone_number
    }), 200


@app.route('/user/<int:user_id>', methods=['PUT'])
def update_account(user_id):
    user = User.query.get_or_404(user_id)
    data = request.json
    user.username = data['username'],
    user.email = data['email'],
    user.password = data['password'],
    user.created_at = data['created_at'],
    user.phone_number = data['phone_number']
    db.session.commit()
    return jsonify({'message': 'User updated successfully'}), 200


@app.route('/user/<int:user_id>', methods=['DELETE'])
def delete_account(user_id):
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()
    return jsonify({'message': 'User deleted successfully'}), 200


# ------------------------- Forward the request to the ChefService -------------------------
@app.route('/user/chef', methods=['POST'])
@app.route('/user/chef/<int:chef_id>', methods=['GET', 'DELETE', 'PUT'])
def chef(chef_id=None):
    try:
        # Forward the request to the ChefService
        if request.method == 'POST':
            response = requests.post(routes['chef'], json=request.json)
        else:
            # For GET, DELETE, PUT, use the chef_id from the URL
            if chef_id is None:
                # This case should not happen due to the route definition
                abort(400, description="chef_id is required for GET, PUT, DELETE requests")

            if request.method == 'GET':
                print(chef_id)
                if not chef_id:
                    abort(400, description="chef_id query parameter is required for GET request")
                response = requests.get(f"{routes['chef']}/{chef_id}")

            elif request.method == 'PUT':
                if not chef_id:
                    abort(400, description="chef_id query parameter is required for PUT request")
                response = requests.put(f"{routes['chef']}/{chef_id}", json=request.json)

            elif request.method == 'DELETE':
                if not chef_id:
                    abort(400, description="chef_id query parameter is required for DELETE request")
                response = requests.delete(f"{routes['chef']}/{chef_id}")

        # Forward the JSON and status code from the ChefService response
        return jsonify(response.json()), response.status_code

    except RequestException as e:
        # Handle connection to ChefService errors
        abort(502, description="Bad Gateway. Error connecting to ChefService.")  # 502 Bad Gateway

    except Exception as e:
        # Handle any other exceptions
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error


# ------------------------- Forward the request to the CustomerService -------------------------
@app.route('/user/customer', methods=['POST'])
@app.route('/user/customer/<int:customer_id>', methods=['GET', 'DELETE', 'PUT'])
def customer(customer_id=None):
    try:
        # Forward the request to the CustomerService
        if request.method == 'POST':
            response = requests.post(routes['customer'], json=request.json)
        else:
            # For GET, DELETE, PUT, use the customer_id from the URL
            if customer_id is None:
                # This case should not happen due to the route definition
                abort(400, description="customer_id is required for GET, PUT, DELETE requests")

            if request.method == 'GET':
                if not customer_id:
                    abort(400, description="customer_id query parameter is required for GET request")
                response = requests.get(f"{routes['customer']}/{customer_id}")

            elif request.method == 'PUT':
                if not customer_id:
                    abort(400, description="customer_id query parameter is required for PUT request")
                response = requests.put(f"{routes['customer']}/{customer_id}", json=request.json)

            elif request.method == 'DELETE':
                if not customer_id:
                    abort(400, description="customer_id query parameter is required for DELETE request")
                response = requests.delete(f"{routes['customer']}/{customer_id}")

        # Forward the JSON and status code from the CustomerService response
        return jsonify(response.json()), response.status_code

    except RequestException as e:
        # Handle connection to CustomerService errors
        abort(502, description="Bad Gateway. Error connecting to CustomerService.")  # 502 Bad Gateway

    except Exception as e:
        # Handle any other exceptions
        abort(500, description="An unexpected error occurred.")  # 500 Internal Server Error


# @app.route('/chef', methods=['POST', 'GET', 'DELETE', 'PUT'])
# def chef():
#     if request.method == 'GET':
#         r = request.query_string.decode()
#         new_url = routes['chef'] + f'?{r}'
#         response = requests.get(new_url)
#         return response.json(), response.status_code
#     elif request.method == 'POST':
#         # handles chef creation
#         r = request.get_json()
#         try:
#             uid = create_new_user(r["email"], r["username"], r["password"])
#         except KeyError:
#             return jsonify({"message": "Missing fields"}), 400
#         creation = {
#             "uid": uid
#         }
#         response = requests.post(routes['chef'], json=creation)
#         response.json().update(creation)
#         return response.json(), response.status_code
#     elif request.method == 'DELETE':
#         r = request.query_string.decode()
#         params = request.get_json()
#         new_url = routes['chef'] + f'?{r}'
#         response = requests.delete(new_url, json=params)
#         return response.json(), response.status_code
#     elif request.method == 'PUT':
#         r = request.query_string.decode()
#         params = request.get_json()
#         new_url = routes['chef'] + f'?{r}'
#         response = requests.put(new_url, json=params)
#         return response.json(), response.status_code
#     else:
#         return "Bad Request", 400
#     return jsonify({"response": "chef"}), 200


# @app.route('/customer', methods=['POST', 'GET', 'DELETE', 'PUT'])
# def customer():
#     if request.method == 'GET':
#         r = request.query_string.decode()
#         new_url = routes['customer'] + f'?{r}'
#         response = requests.get(new_url)
#         return response.json(), response.status_code
#     elif request.method == 'POST':
#         # handle customer creation
#         r = request.get_json()
#         try:
#             uid = create_new_user(r["email"], r["username"], r["password"])
#         except KeyError:
#             return jsonify({"message": "Missing fields"}), 400
#         creation = {
#             "uid": uid
#         }
#         response = requests.post(routes['customer'], json=creation)
#         response.json().update(creation)
#         return response.json(), response.status_code
#     elif request.method == 'DELETE':
#         r = request.query_string.decode()
#         params = request.get_json()
#         new_url = routes['customer'] + f'?{r}'
#         response = requests.delete(new_url, json=params)
#         return response.json(), response.status_code
#     elif request.method == 'PUT':
#         r = request.query_string.decode()
#         params = request.get_json()
#         new_url = routes['customer'] + f'?{r}'
#         response = requests.put(new_url, json=params)
#         return response.json(), response.status_code
#     else:
#         return "Bad Request", 400
#     return jsonify({"response": "customer"}), 200
#
#
# @app.route('/account', methods=['POST', 'GET', 'DELETE', 'PUT'])
# def other():
#     if request.method == 'GET':
#         r = request.query_string.decode()
#         print(r)
#         query = json.loads(json.dumps(parse_qs(r)))
#         print(query)
#         result = find_user([query["email"][0], query["password"][0]])
#         if result is not None:
#             return jsonify({"uid": result[0], "custid": result[1], "chefid": result[2]}), 200
#         else:
#             return jsonify({"status": "failed"}), 404
#         # new_url = routes['customer'] + f'?{r}'
#         # response = requests.get(new_url)
#         # return response.json(), response.status_code
#     elif request.method == 'POST':
#         # handle customer creation
#         r = request.get_json()
#         try:
#             uid = create_new_user(r["email"], r["username"], r["password"])
#         except KeyError:
#             return jsonify({"message": "Missing fields"}), 400
#         creation = {
#             "uid": uid
#         }
#         response1 = requests.post(routes['customer'], json=creation)
#         response2 = requests.post(routes['chef'], json=creation)
#         creation.update(response1.json())
#         creation.update(response2.json())
#         print(creation)
#         return creation, response1.status_code
#     return jsonify({"response": "other"}), 404


#  connects to db
# def db_connection():
#     conn = sqlite3.connect("users.db")
#     return conn


# creates a new user in the database given email username and password, return the uid of the new user
# def create_new_user(email, username, password, phone_number="None"):
#     con = db_connection()
#     cursor = con.cursor()
#
#     cursor.execute(f"SELECT uid FROM User WHERE email = '{email}'")
#     result = cursor.fetchone()
#     if result is not None:
#         return result[0]
#     time_created = datetime.datetime.now()
#     uid = abs(uuid.uuid4().int) % (10 ** 10)
#     cursor.execute(
#         "INSERT INTO User (uid, username, email, password, created_at, phone_number) VALUES (?, ?, ?, ?, ?, ?)"
#         , (uid, username, email, password, time_created, phone_number))
#     con.commit()
#     con.close()
#     return uid
#
#
# def find_user(data):
#     conn = sqlite3.connect("users.db")
#
#     cursor = conn.cursor()
#     sql_query1 = """
#     SELECT * FROM User u WHERE email = ? AND password = ?
#     """
#     user = cursor.execute(sql_query1, (data[0], data[1],))
#     user = user.fetchone()
#     if user is None:
#         return None
#     else:
#         cust = conn.execute('SELECT * FROM Customer WHERE uid = ?',
#                                 (user[0],)).fetchone()
#         chef = cursor.execute("SELECT * FROM Chef WHERE uid = ?", (user[0],)).fetchone()
#         return user[0], cust[0], chef[0]
#
#
# # creates the user database for chef service, customer service and user service
# def create_database():
#     conn = sqlite3.connect("users.db")
#
#     cursor = conn.cursor()
#
#     sql_query1 = """
#     CREATE TABLE IF NOT EXISTS User(
#         uid BIGINT NOT NULL PRIMARY KEY,
#         username VARCHAR NOT NULL,
#         email VARCHAR NOT NULL UNIQUE,
#         password VARCHAR NOT NULL,
#         created_at DATE,
#         phone_number VARCHAR
#     );
#     """
#
#     sql_query2 = """
#     CREATE TABLE IF NOT EXISTS Chef(
#         chefid BIGINT,
#         uid BIGINT PRIMARY KEY,
#         rating FLOAT,
#         chef_description VARCHAR,
#         deliver_address VARCHAR,
#         FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE
#     );
#     """
#
#     sql_query3 = """
#     CREATE TABLE IF NOT EXISTS Customer(
#         custid BIGINT,
#         uid BIGINT PRIMARY KEY,
#         pickup_address VARCHAR,
#         FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE
#     );
#     """
#     cursor.execute(sql_query1)
#     cursor.execute(sql_query2)
#     cursor.execute(sql_query3)
#
#     conn.commit()
#     conn.close()


if __name__ == "__main__":
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(current_dir, "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        customer_ip = config_data['CustomerService']['ip']
        customer_port = config_data['CustomerService']['port']
        chef_ip = config_data['ChefService']['ip']
        chef_port = config_data['ChefService']['port']
    except KeyError:
        print("Config file missing services")
        exit(1)
    routes = {
        "customer": f"http://{customer_ip}:{customer_port}/customer",
        "chef": f"http://{chef_ip}:{chef_port}/chef",
    }

    # create the database
    # create_database()
    app.run(port=config_data['UserService']['port'], host=config_data['UserService']['ip'], debug=True)
