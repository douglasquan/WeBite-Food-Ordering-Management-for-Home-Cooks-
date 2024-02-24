from flask import *
import requests
import os
import sqlite3
import datetime
import uuid
from ChefService.chef_service import app as chefser
from CustomerService.CustomerService import app as custser

app = Flask(__name__)


@app.route('/chef', methods=['POST', 'GET', 'DELETE', 'PUT'])
def chef():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['chef'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        # handles chef creation
        r = request.get_json()
        try:
            uid = create_new_user(r["email"], r["username"], r["password"])
        except KeyError:
            return jsonify({"message": "Missing fields"}), 400
        creation = {
            "uid": uid
        }
        response = requests.post(routes['chef'], json=creation)
        response.json().update(creation)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['chef'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['chef'] + f'?{r}'
        response = requests.put(new_url, json=params)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400
    return jsonify({"response": "chef"}), 200


@app.route('/customer', methods=['POST', 'GET', 'DELETE', 'PUT'])
def customer():
    if request.method == 'GET':
        r = request.query_string.decode()
        new_url = routes['customer'] + f'?{r}'
        response = requests.get(new_url)
        return response.json(), response.status_code
    elif request.method == 'POST':
        # handle customer creation
        r = request.get_json()
        try:
            uid = create_new_user(r["email"], r["username"], r["password"])
        except KeyError:
            return jsonify({"message": "Missing fields"}), 400
        creation = {
            "uid": uid
        }
        response = requests.post(routes['customer'], json=creation)
        response.json().update(creation)
        return response.json(), response.status_code
    elif request.method == 'DELETE':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['customer'] + f'?{r}'
        response = requests.delete(new_url, json=params)
        return response.json(), response.status_code
    elif request.method == 'PUT':
        r = request.query_string.decode()
        params = request.get_json()
        new_url = routes['customer'] + f'?{r}'
        response = requests.put(new_url, json=params)
        return response.json(), response.status_code
    else:
        return "Bad Request", 400
    return jsonify({"response": "customer"}), 200


@app.route('/', methods=['POST', 'GET', 'DELETE', 'PUT'])
def other():
    return jsonify({"response": "other"}), 404


#  connects to db
def db_connection():
    conn = sqlite3.connect("users.db")
    return conn


# creates a new user in the database given email username and password, return the uid of the new user
def create_new_user(email, username, password, phone_number="None"):
    con = db_connection()
    cursor = con.cursor()

    cursor.execute(f"SELECT uid FROM User WHERE email = '{email}'")
    result = cursor.fetchone()
    if result is not None:
        return result[0]
    time_created = datetime.datetime.now()
    uid = abs(uuid.uuid4().int) % (10 ** 10)
    cursor.execute(
        "INSERT INTO User (uid, username, email, password, created_at, phone_number) VALUES (?, ?, ?, ?, ?, ?)"
        , (uid, username, email, password, time_created, phone_number))
    con.commit()
    con.close()
    return uid


# creates the user database for chef service, customer service and user service
def create_database():
    conn = sqlite3.connect("users.db")

    cursor = conn.cursor()

    sql_query1 = """ 
    CREATE TABLE IF NOT EXISTS User(
        uid BIGINT NOT NULL PRIMARY KEY,
        username VARCHAR NOT NULL,
        email VARCHAR NOT NULL UNIQUE,
        password VARCHAR NOT NULL,
        created_at DATE,
        phone_number VARCHAR
    );
    """

    sql_query2 = """
    CREATE TABLE IF NOT EXISTS Chef(
        chefid BIGINT,
        uid BIGINT PRIMARY KEY,
        rating FLOAT,
        chef_description VARCHAR,
        deliver_address VARCHAR,
        FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE
    );
    """

    sql_query3 = """
    CREATE TABLE IF NOT EXISTS Customer(
        custid BIGINT,
        uid BIGINT PRIMARY KEY,
        pickup_address VARCHAR,
        FOREIGN KEY (uid) REFERENCES User(uid) ON DELETE CASCADE
    );
    """
    cursor.execute(sql_query1)
    cursor.execute(sql_query2)
    cursor.execute(sql_query3)

    conn.commit()
    conn.close()


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
    config_path = os.path.abspath(os.path.join(current_dir, "../../config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # create the database
    create_database()
    app.run(port=config_data['UserService']['port'], host=config_data['UserService']['ip'], debug=True)
