from flask import Flask, request, jsonify
import json
import sqlite3
import uuid
import os

app = Flask(__name__)


def db_connection():
    conn = None
    try:
        conn = sqlite3.connect("review.db")
    except sqlite3.error as e:
        print(e)
    return conn

@app.route("/review", methods=["POST"])
def post_handler():
    conn = db_connection()
    cursor = conn.cursor()

    if request.method == "POST":
        try:
            data = request.get_json()
            new_review_id = abs(uuid.uuid4().int) % (10 ** 10)
            new_meal_id = data["meal_id"]
            new_customer_id = data["customer_id"]
            new_review_description = data["review_description"]
            new_rating = data["rating"]
            
            sql = """INSERT INTO review (review_id, meal_id, customer_id, review_description, rating)
                    VALUES (?, ?, ?, ?, ?)"""
            cursor = cursor.execute(sql, (new_review_id, new_meal_id, new_customer_id, new_review_description, new_rating))
            conn.commit()
            conn.close()
            response = {
                "id": new_review_id,
                "name": new_meal_id,
                "phone_num": new_customer_id,
                "email": new_review_description,
                "password": new_rating,
                }
            print(f"review with the id: {new_review_id} created successfully")
            return response, 200
        
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON data"}), 400
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400
        except sqlite3.Error:
            return jsonify({"error": "Database error"}), 500


@app.route("/review", methods=["GET"])
def handler_get():
    review_id = request.args.get('review_id', default=None, type=int)  
    conn = db_connection()
    cursor = conn.cursor()
    if request.method == "GET":
        cursor = conn.execute("SELECT * FROM review WHERE review_id = ?", (review_id,))
        review = cursor.fetchone() 
        if review is not None:
            response = {
                "review_id": review[0],
                "meal_id": review[1],
                "customer_id": review[2],
                "review_description": review[3],
                "new_rating": review[4]
            }
            return response, 200
        else:
            return jsonify({"error": "review id not found"}), 404


@app.route("/review", methods=["PUT"])
def handler_put():
    review_id = request.args.get('review_id', default=None, type=int)  
    conn = db_connection()
    cursor = conn.cursor()
    
    if request.method == "PUT":
        data = request.get_json()

        # Generate the SET clause dynamically based on provided fields
        set_clause = ", ".join([f"{key} = ?" for key in data.keys()])
        values = tuple(data.values())

        # Update the review's information in the database
        if set_clause:
            sql = f"UPDATE review SET {set_clause} WHERE review_id = ?"
            values += (review_id,)  # Append 'review_id' to the values tuple
            cursor.execute(sql, values)
            conn.commit()
            conn.close()
            return jsonify({"message": "review information updated successfully"}), 200

        # If no fields other than 'review_id' were provided, consider it a success
        return jsonify({"message": "review information unchanged"}), 200

    return jsonify({"error": "Invalid request method"}), 405


@app.route("/review", methods=["DELETE"])
def handler_delete():
    review_id = request.args.get('review_id', default=None, type=int)  
    conn = db_connection()
    cursor = conn.cursor()
    
    if request.method == "DELETE":
        data = request.get_json()
        # Check if all required fields are present in the JSON data
        required_fields = ["meal_id", "customer_id", "review_description", "rating"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing '{field}' field in JSON data"}), 400

        # check if provided id is in database
        cursor.execute("SELECT * FROM review WHERE review_id = ?", (review_id,))
        review = cursor.fetchone()
        if review is None:
            return jsonify({"error": "review not found with the provided review id"}), 404
        
        
        # Perform authentication here, check if all fields match with the database
        if data["meal_id"] != review[1]:
            return jsonify({"error": "Authentication failed. Invalid meal id"}), 401
        elif data["customer_id"] != review[2]:
            return jsonify({"error": "Authentication failed. Invalid phone customer id"}), 401
        elif data["review_description"] != review[3]:
            return jsonify({"error": "Authentication failed. Invalid review_description"}), 401
        elif data["rating"] != review[4]:
            return jsonify({"error": "Authentication failed. Invalid rating"}), 401

        # Delete the review's information from the database
        else:
            cursor.execute("DELETE FROM review WHERE review_id = ?", (review_id,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "review information deleted successfully"}), 200

    return jsonify({"error": "Invalid request method"}), 405


if __name__ == "__main__":
    # initialize db
    conn = sqlite3.connect("review.db")

    cursor = conn.cursor()
    cursor.execute('''DROP TABLE IF EXISTS review;''')

    sql_query = """ CREATE TABLE review(
        'review_id' BIGINT NOT NULL PRIMARY KEY,
        'meal_id' BIGINT NOT NULL UNIQUE,
        'customer_id' BIGINT NOT NULL UNIQUE,
        'review_description' TEXT ,
        'rating' INT 
    );"""
    cursor.execute(sql_query)
    
    # set path for config file
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(os.path.join(os.path.join(current_dir, os.pardir), os.pardir), "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything        
    try:
        review_ip = config_data['ReviewService']['ip']
        review_port = config_data['ReviewService']['port']
        # print(f"review port:{review_port} review ip: {review_ip}")
    except KeyError:
        print("Review config missing")
        exit(1)
    app.run(host=review_ip, port=review_port, debug=True)