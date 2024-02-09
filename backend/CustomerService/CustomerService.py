from flask import Flask, request, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import json
import sys
import os

from flask import Flask, request, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash
import json
import sys
import os

app = Flask(__name__)

DATABASE = 'customers.db'
#meal_DATABASE = 'meals.db'


def create_tables():
    tables = [
        """CREATE TABLE IF NOT EXISTS customers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL
        )""",
        """CREATE TABLE IF NOT EXISTS meals (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            cost DECIMAL NOT NULL
        )"""
    ]
    conn_cus = get_db_connection('customers.db')
    cursor_cus = conn_cus.cursor()
    cursor_cus.execute('''DROP TABLE IF EXISTS customers;''')
    #conn_meal = get_db_connection('meals.db')
    #cursor_meal = conn_meal.cursor()
    cursor_cus.execute(tables[0])
    #cursor_meal.execute(tables[1])

    conn_cus.commit()
    conn_cus.close()
    #conn_meal.commit()
    #conn_meal.close()


#@app.cli.command('init_db')
def initialize_database():
    create_tables()


def get_db_connection(db_name):
    conn = sqlite3.connect(db_name)
    conn.row_factory = sqlite3.Row
    return conn


@app.route('/customer', methods=['POST'])
def post_handler():
    data = request.json
    command = data.get('command')
    if command == 'create':
        response = create_customer()
        return response
    elif command == 'login':
        response = login_customer()
        return response
    else:
        return jsonify({"message": "Command's wrong"}), 409

def create_customer():
    customer_data = request.json
    #print(request.json)
    #id = customer_data.get('id')
    name = customer_data.get('name')
    email = customer_data.get('email')
    password = customer_data.get('password_hash')
    #print(name, email, password)

    if not (name and email and password):
        #print("no")
        return jsonify({"message": "Missing fields"}), 400
    password_hash = generate_password_hash(password)
    #print("password_hash")
    try:
        #print("3")
        conn = get_db_connection('customers.db')
        cur = conn.cursor()
        #print("4")
        # sql = """INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?)"""
        # cur = cur.execute(sql, (name, email, password_hash))
        cur.execute('INSERT INTO customers (name, email, password_hash) VALUES (?, ?, ?)',
                     (name, email, password_hash))
        #print("5")
        conn.commit()
        id = cur.lastrowid
        #print("id", id)
    except sqlite3.IntegrityError:
        return jsonify({"message": "Email already exists"}), 409
    finally:
        conn.close()
    response = {"id": id,
                "name": name,
                "email": email,
                "password_hash": password_hash}
    #print(response)
    return response, 200


@app.route('/customer', methods=['GET'])
def get_customer():
    customer_id = request.args.get('id')
    conn = get_db_connection('customers.db')
    customer = conn.execute('SELECT * FROM customers WHERE id = ?',
                            (customer_id,)).fetchone()
    conn.close()
    if customer is None:
        return jsonify({"message": "Customer not found"}), 404
    return jsonify(dict(customer)), 200


@app.route('/customer', methods=['DELETE'])
def delete_customer():
    customer_id = request.args.get('id')
    conn = get_db_connection('customers.db')
    customer = conn.execute('SELECT * FROM customers WHERE id = ?', (customer_id,)).fetchone()
    if customer is None:
        conn.close()
        return jsonify({"message": "Customer not found"}), 404

    conn.execute('DELETE FROM customers WHERE id = ?', (customer_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Customer deleted successfully"}), 200


# @app.route('/meal/create', methods=['POST'])
# def create_meal():
#     meal_data = request.json
#     name = meal_data.get('name')
#     cost = meal_data.get('cost')
#
#     if not name or cost is None:
#         return jsonify({"message": "Name and cost are required"}), 400
#
#     conn = get_db_connection('meals.db')
#     conn.execute('INSERT INTO meals (name, cost) VALUES (?, ?)', (name, cost))
#     conn.commit()
#     conn.close()
#
#     return jsonify({"message": "Meal added successfully"}), 201


# @app.route('/meal/<meal_name>', methods=['GET'])
# def get_meal_cost(meal_name):
#     conn = get_db_connection('customers.db')
#     meal = conn.execute('SELECT * FROM meals WHERE name = ?',
#                         (meal_name,)).fetchone()
#     conn.close()
#     if meal is None:
#         return jsonify({"message": "Meal not found"}), 404
#     return jsonify({"name": meal["name"], "cost": meal["cost"]}), 200


# @app.route('/meal/<int:meal_id>', methods=['DELETE'])
# def delete_meal(meal_id):
#     conn = get_db_connection('meals.db')
#     meal = conn.execute('SELECT * FROM meals WHERE id = ?', (meal_id,)).fetchone()
#     if meal is None:
#         conn.close()
#         return jsonify({"message": "Meal not found"}), 404
#
#     conn.execute('DELETE FROM meals WHERE id = ?', (meal_id,))
#     conn.commit()
#     conn.close()
#     return jsonify({"message": "Meal deleted successfully"}), 200


#@app.route('/customer/login', methods=['POST'])
def login_customer():
    #credentials = request.json
    try:
        #print(request.json)
        email = request.args.get('email')
        print(email)
        password = request.args.get('password_hash')
        #print(password)
    except KeyError:
        return "bad request", 400
    # email = credentials.get('email')
    # password = credentials.get('password')

    if not email or not password:
        return jsonify({"message": "Email and password are required"}), 400

    conn = get_db_connection("customers.db")
    customer = conn.execute('SELECT * FROM customers WHERE email = ?', (email,)).fetchone()
    conn.commit()
    conn.close()

    if customer and check_password_hash(customer['password_hash'], password):
        # Successfully authenticated
        #session['customer_id'] = customer['id']  # Store customer ID in session for future requests, maybe useful if we
        # want a logout feature
        return jsonify({"message": "Login successful"}), 200
    else:
        # Authentication failed
        return jsonify({"message": "Invalid email or password"}), 401



if __name__ == '__main__':
    # if len(sys.argv) > 1:
    #     file_path = sys.argv[1]
    # else:
    #     sys.exit(1)
    # with open(file_path, 'r') as configjson:
    #     config = json.load(configjson)
    # port = config['CustomerSerive']['port']
    # port = 8001
    # app.run(debug=True, port=port)
    initialize_database()
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(os.path.join(os.path.join(current_dir, os.pardir), os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        customer_ip = config_data['CustomerService']['ip']
        customer_port = config_data['CustomerService']['port']
    except KeyError:
        print("Customer config missing")
        exit(1)
    app.run(host=customer_ip, port=customer_port, debug=True)
