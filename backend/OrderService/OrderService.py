from flask import *
import sqlite3
import requests
import os
import uuid

app = Flask(__name__)


@app.route('/order', methods=['POST'])
def handle_post():
    data = request.get_json()
    try:
        command = data["command"]
    except ValueError:
        return "Invalid Command", 400
    # rudimentary does not contain duplicate checking
    if command == 'create':
        unique_id = uuid.uuid4().int
        print(unique_id)
        databasep = sqlite3.connect("order.db")
        cursorp = databasep.cursor()
        try:
            print(data)
            cursorp.execute(f'''
                INSERT INTO orders
                VALUES ({unique_id}, {data["customer_id"]}, {data["chef_id"]}, {data["quantity"]}, {data["price"]}, 'In progress');
            ''')
            databasep.commit()
            databasep.close()
            response = {
                "order_id": unique_id,
                "quantity": data["quantity"],
                "status": "In progress"
            }
            return response, 200
        except KeyError:
            return "Missing values", 400
        except sqlite3.OperationalError:
            return "Bad token", 400
    elif command == 'update':
        # not yet implemented for Sprint 1
        return "Not yet implemented", 404


@app.route('/order', methods=['GET'])
def handle_get():
    print(request.args.get('id'))
    db = sqlite3.connect("order.db")
    cursorg = db.cursor()
    cursorg.execute(f'''
        SELECT * FROM orders WHERE order_id = {request.args.get('id')}
    ''')
    result = cursorg.fetchall()
    print(result)
    if len(result) == 0:
        return "Requested Resource does not exsist", 404
    else:
        result = result[0]
        response = {
            "order_id": result[0],
            "customer_id": result[1],
            "chef_id": result[2],
            "quantity": result[3],
            "price": result[4],
            "status": result[5]
        }

        return response, 200



@app.route('/order', methods=['DELETE'])
def handle_delete():
    return "Not yet implemented", 404


if __name__ == "__main__":
    database = sqlite3.connect("order.db")
    cursor = database.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            order_id BIGINT PRIMARY KEY,
            customer_id BIGINT,
            chef_id BIGINT,
            quantity INTEGER,
            price REAL,
            status TEXT
        );
    ''')
    database.commit()
    database.close()
    # getting config
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(os.path.join(current_dir, os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        orders_ip = config_data['OrderService']['ip']
        orders_port = config_data['OrderService']['port']
    except KeyError:
        print("Order config missing")
        exit(1)
    app.run(host=orders_ip, port=orders_port, debug=True)
