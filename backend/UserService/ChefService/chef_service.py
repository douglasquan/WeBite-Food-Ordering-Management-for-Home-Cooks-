from flask import Flask, request, jsonify
import json
import sqlite3
import uuid
import os

app = Flask(__name__)


def db_connection():
    conn = None
    try:
        conn = sqlite3.connect("../users.db")
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
            # new_name = data["name"]
            # new_phone_num = data["phone_num"]
            # new_email = data["email"]
            # new_password = data["password"]
            sql = """INSERT INTO chef (chefid, uid)
                    VALUES (?, ?)"""
            cursor = cursor.execute(sql, (new_id, data["uid"]))
            conn.commit()
            conn.close()
            response = {
                "chefid": new_id,
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


@app.route("/chef", methods=["GET"])
def handler_get():
    id = request.args.get('id', default=None, type=int)
    conn = db_connection()
    cursor = conn.cursor()
    if request.method == "GET":
        result = cursor.execute("SELECT * FROM Chef WHERE chefid = ?", (id,))
        chef = result.fetchone()
        if chef is not None:
            response = {
                "chefid": chef[0],
                "uid": chef[1]
            }
            result2 = cursor.execute("SELECT * FROM User WHERE uid = ?", (chef[1],))
            user = result2.fetchone()
            response["username"] = user[1]
            response["email"] = user[2]
            response["date_created"] = user[4]
            response["phone_number"] = user[5]
            return response, 200
        else:
            return jsonify({"error": "chef id not found"}), 404


@app.route("/chef", methods=["PUT"])
def handler_put():
    id = request.args.get('id', default=None, type=int)
    conn = db_connection()
    cursor = conn.cursor()

    if request.method == "PUT":
        data = request.get_json()

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


@app.route("/chef", methods=["DELETE"])
def handler_delete():
    id = request.args.get('id', default=None, type=int)
    conn = db_connection()
    cursor = conn.cursor()

    if request.method == "DELETE":
        data = request.get_json()
        # Check if all required fields are present in the JSON data
        required_fields = ["name", "phone_num", "email", "password"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing '{field}' field in JSON data"}), 400

        # check if provided id is in database
        cursor.execute("SELECT * FROM chef WHERE id = ?", (id,))
        chef = cursor.fetchone()
        if chef is None:
            return jsonify({"error": "Chef not found with the provided ID"}), 404
        print(chef)
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
    config_path = os.path.abspath(
        os.path.join(os.path.join(current_dir, os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything        
    try:
        chef_ip = config_data['ChefService']['ip']
        chef_port = config_data['ChefService']['port']
        # print(f"chef port:{chef_port} chef ip: {chef_ip}")
    except KeyError:
        print("Chef config missing")
        exit(1)
    app.run(host=chef_ip, port=chef_port, debug=True)
