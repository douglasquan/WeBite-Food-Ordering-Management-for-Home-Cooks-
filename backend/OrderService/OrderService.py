from flask import *
import sqlite3
import requests
import os
import uuid

app = Flask(__name__)


@app.route('/order', methods=['POST'])
def handle_post():
    data = request.get_json()
    # rudimentary does not contain duplicate checking
    unique_id = abs(uuid.uuid4().int) % (10 ** 10)
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


@app.route('/order', methods=['PUT'])
def handle_update():
    id = request.args.get('id')
    conn = sqlite3.connect("order.db")
    cursor = conn.cursor()
    data = request.get_json()

    # # Check if 'id' is present in the JSON data
    # if 'id' not in data:
    #     return jsonify({"error": "Missing 'id' field in JSON data"}), 404

    # # Check if the provided 'id' matches the route parameter 'id'
    # if id != data['id']:
    #     return jsonify({"error": "Mismatched 'id' in URL and JSON data"}), 404

    # # Remove 'id' from the data to prevent updating it
    # del data['id']

    # Generate the SET clause dynamically based on provided fields
    set_clause = ", ".join([f"{key} = ?" for key in data.keys()])
    values = tuple(data.values())

    # Update the chef's information in the database
    if set_clause:
        sql = f"UPDATE orders SET {set_clause} WHERE order_id = ?"
        values += (id,)  # Append 'id' to the values tuple
        cursor.execute(sql, values)
        conn.commit()
        conn.close()
        return jsonify({"message": "Chef information updated successfully"}), 200

    # If no fields other than 'id' were provided, consider it a success
    return jsonify({"message": "Chef information unchanged"}), 200


if __name__ == "__main__":
    database = sqlite3.connect("order.db")
    cursor = database.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS orders (
            order_id BIGINT PRIMARY KEY,
            customer_id BIGINT NOT NULL,
            chef_id BIGINT NOT NULL,
            quantity INTEGER NOT NULL,
            price REAL NOT NULL,
            status TEXT NOT NULL
        );
    ''')
    database.commit()
    database.close()
    # getting config
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(os.path.join(os.path.join(current_dir, os.pardir), os.pardir), "config.json"))
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
