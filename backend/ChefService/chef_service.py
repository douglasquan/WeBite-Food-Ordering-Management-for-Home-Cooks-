from flask import Flask, request, jsonify
import json
import sqlite3
import uuid
import os

app = Flask(__name__)


def db_connection():
    conn = None
    try:
        conn = sqlite3.connect("chef.db")
    except sqlite3.error as e:
        print(e)
    return conn

@app.route("/chef", methods=["POST"])
def post_handler():
    conn = db_connection()
    cursor = conn.cursor()

    if request.method == "POST":
        try:
            data = request.get_json()
            new_id = abs(uuid.uuid4().int) % (10 ** 10)
            new_name = data["name"]
            new_phone_num = data["phone_num"]
            new_email = data["email"]
            new_password = data["password"]
            sql = """INSERT INTO chef (id, name, phone_num, email, password)
                    VALUES (?, ?, ?, ?, ?)"""
            cursor = cursor.execute(sql, (new_id, new_name, new_phone_num, new_email, new_password))
            conn.commit()
            conn.close()
            response = {
                "id": new_id,
                "name": new_name,
                "phone_num": new_phone_num,
                "email": new_email,
                "password": new_password,
                }
            print(f"chef with the id: {new_id} created successfully")
            return response, 200
        
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON data"}), 400
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400
        except sqlite3.Error:
            return jsonify({"error": "Database error"}), 500


@app.route("/chef/<int:id>", methods=["GET"])
def handler_get(id):
    conn = db_connection()
    cursor = conn.cursor()
    if request.method == "GET":
        cursor = conn.execute("SELECT * FROM chef WHERE id = ?", (id,))
        chef = cursor.fetchone() 
        print(chef)
        if chef is not None:
            response = {
                "id": chef[0],
                "name": chef[1],
                "phone_num": chef[2],
                "email": chef[3],
                "password": chef[4]
            }
            return response, 200
        else:
            return jsonify({"error": "chef id not found"}), 404


@app.route("/chef/<int:id>", methods=["PUT"])
def handler_put(id):
    conn = db_connection()
    cursor = conn.cursor()
    
    if request.method == "PUT":
        data = request.get_json()

        # Check if 'id' is present in the JSON data
        if 'id' not in data:
            return jsonify({"error": "Missing 'id' field in JSON data"}), 404

        # Check if the provided 'id' matches the route parameter 'id'
        if id != data['id']:
            return jsonify({"error": "Mismatched 'id' in URL and JSON data"}), 404

        # Remove 'id' from the data to prevent updating it
        del data['id']

        # Generate the SET clause dynamically based on provided fields
        set_clause = ", ".join([f"{key} = ?" for key in data.keys()])
        values = tuple(data.values())

        # Update the chef's information in the database
        if set_clause:
            sql = f"UPDATE chef SET {set_clause} WHERE id = ?"
            values += (id,)  # Append 'id' to the values tuple
            cursor.execute(sql, values)
            conn.commit()
            conn.close()
            return jsonify({"message": "Chef information updated successfully"}), 200

        # If no fields other than 'id' were provided, consider it a success
        return jsonify({"message": "Chef information unchanged"}), 200

    return jsonify({"error": "Invalid request method"}), 405


@app.route("/chef/<int:id>", methods=["DELETE"])
def handler_delete(id):
    conn = db_connection()
    cursor = conn.cursor()
    
    if request.method == "DELETE":
        data = request.get_json()
        # Check if all required fields are present in the JSON data
        required_fields = ["id", "name", "phone_num", "email", "password"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing '{field}' field in JSON data"}), 400

        # check if provided id is in database
        cursor.execute("SELECT * FROM chef WHERE id = ?", (id,))
        chef = cursor.fetchone()
        if chef is None:
            return jsonify({"error": "Chef not found with the provided ID"}), 404

        # Perform authentication here, check if all fields match with the database
        if data["name"] != chef[1]:
            return jsonify({"error": "Authentication failed. Invalid name"}), 401
        if data["phone_num"] != chef[2]:
            return jsonify({"error": "Authentication failed. Invalid phone number"}), 401
        if data["email"] != chef[3]:
            return jsonify({"error": "Authentication failed. Invalid email"}), 401
        if data["password"] != chef[4]:
            return jsonify({"error": "Authentication failed. Invalid password"}), 401

        # Delete the chef's information from the database
        cursor.execute("DELETE FROM chef WHERE id = ?", (id,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "Chef information deleted successfully"}), 200

    return jsonify({"error": "Invalid request method"}), 405

if __name__ == "__main__":
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(os.path.join(os.path.join(current_dir, os.pardir), os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        chef_ip = config_data['CustomerService']['ip']
        chef_port = config_data['CustomerService']['port']
    except KeyError:
        print("Order config missing")
        exit(1)
    app.run(host=chef_ip, port=chef_port, debug=True)