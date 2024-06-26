import requests
from flask import Flask, request, jsonify
from geopy.geocoders import Nominatim
from geopy.point import Point
import json
import sqlite3
import uuid
import os
import math

app = Flask(__name__)
GOOGLE_API_KEY = 'AIzaSyD_KOWpLeeAV5f5vKCAio4M65DlxHDlT74'


def db_connection():
    conn = None
    try:
        conn = sqlite3.connect("address.db")
    except sqlite3.error as e:
        print(e)
    return conn


@app.route("/address", methods=["POST"])
def handler_post():
    conn = db_connection()
    cursor = conn.cursor()

    if request.method == "POST":
        try:
            data = request.get_json()
            #new_address_id = abs(uuid.uuid4().int) % (10 ** 10)
            new_unit_number = data["unit_number"]
            new_street_number = data["street_number"]
            new_address_line1 = data["address_line1"]
            new_address_line2 = data["address_line2"]
            new_city = data["city"]
            new_province = data["province"]
            new_postal_code = data["postal_code"]
            new_country = data["country"]
            new_latitude = data["latitude"]
            new_longitude = data["longitude"]

            sql = """INSERT INTO address (unit_number, street_number, address_line1, address_line2, city, province, postal_code, country, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"""
            cursor = cursor.execute(sql, (new_unit_number, new_street_number, new_address_line1, new_address_line2, new_city, new_province, new_postal_code, new_country, new_latitude, new_longitude))
            conn.commit()
            conn.close()
            #"address_id": new_address_id,
            response = {

                "unit_number": new_unit_number,
                "street_number": new_street_number,
                "address_line1": new_address_line1,
                "address_line2": new_address_line2,
                "city": new_city,
                "province": new_province,
                "postal_code": new_postal_code,
                "country": new_country,
                "latitude": new_latitude,
                "longitude": new_longitude
                }
           # print(f"address with the id: {new_address_id} created successfully")
            return response, 200
        
        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON data"}), 400
        except ValueError as ve:
            return jsonify({"error": str(ve)}), 400
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400
        except sqlite3.Error:
            return jsonify({"error": "Database error"}), 500


@app.route("/address", methods=["GET"])
def handler_get():
    address_id = request.args.get('address_id', default=None, type=int)  
    conn = db_connection()
    cursor = conn.cursor()
    if request.method == "GET":
        cursor = conn.execute("SELECT * FROM address WHERE address_id = ?", (address_id,))
        address = cursor.fetchone() 
        print(address)
        if address is not None:
            response = {
                "address_id": address[0],
                "unit_number": address[1],
                "street_number": address[2],
                "address_line1": address[3],
                "address_line2": address[4],
                "city": address[5],
                "province": address[6],
                "postal_code": address[7],
                "country": address[8],
                "latitude": address[9],
                "longitude": address[10]
            }
            return response, 200
        else:
            return jsonify({"error": "address id not found"}), 404


@app.route("/address", methods=["PUT"])
def handler_put():
    address_id = request.args.get('address_id', default=None, type=int)  
    conn = db_connection()
    cursor = conn.cursor()
    
    if request.method == "PUT":
        data = request.get_json()

        # Generate the SET clause dynamically based on provided fields
        set_clause = ", ".join([f"{key} = ?" for key in data.keys()])
        values = tuple(data.values())

        # Update the address's information in the database
        if set_clause:
            sql = f"UPDATE address SET {set_clause} WHERE address_id = ?"
            values += (address_id,)  # Append 'address_id' to the values tuple
            cursor.execute(sql, values)
            conn.commit()
            conn.close()
            return jsonify({"message": "address information updated successfully"}), 200

        # If no fields other than 'id' were provided, consider it a success
        return jsonify({"message": "address information unchanged"}), 200

    return jsonify({"error": "Invalid request method"}), 405


@app.route("/address", methods=["DELETE"])
def handler_delete():
    address_id = request.args.get('address_id', default=None, type=int)  
    
    conn = db_connection()
    cursor = conn.cursor()
    
    if request.method == "DELETE":
        data = request.get_json()
        # Check if all required fields (except address_id) are present in the JSON data
        required_fields = ["unit_number", "street_number", "address_line1", "address_line2", "city", "province", "postal_code", "country", "latitude", "longitude"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing '{field}' field in JSON data"}), 400

        # check if provided id is in database
        cursor.execute("SELECT * FROM address WHERE address_id = ?", (address_id,))
        address = cursor.fetchone()
        if address is None:
            return jsonify({"error": "address not found with the provided address id"}), 404
        
        # Perform authentication here, check if all fields match with the database
        if data["unit_number"] != address[1]:
            return jsonify({"error": "Authentication failed. Invalid unit number"}), 401
        elif data["street_number"] != address[2]:
            return jsonify({"error": "Authentication failed. Invalid street number"}), 401
        elif data["address_line1"] != address[3]:
            return jsonify({"error": "Authentication failed. Invalid address line 1"}), 401
        elif data["address_line2"] != address[4]:
            return jsonify({"error": "Authentication failed. Invalid address line 2"}), 401
        elif data["city"] != address[5]:
            return jsonify({"error": "Authentication failed. Invalid city"}), 401
        elif data["province"] != address[6]:
            return jsonify({"error": "Authentication failed. Invalid province"}), 401
        elif data["postal_code"] != address[7]:
            return jsonify({"error": "Authentication failed. Invalid postal code"}), 401
        elif data["country"] != address[8]:
            return jsonify({"error": "Authentication failed. Invalid country"}), 401
        elif data["latitude"] != address[9]:
            return jsonify({"error": "Authentication failed. Invalid country"}), 401
        elif data["longitude"] != address[10]:
            return jsonify({"error": "Authentication failed. Invalid country"}), 401
        else: # Delete the address's information from the database
            cursor.execute("DELETE FROM address WHERE address_id = ?", (address_id,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": "address information deleted successfully"}), 200

    return jsonify({"error": "Invalid request method"}), 405


@app.route('/address/convenience', methods=['POST'])
def get_convenience_location():
    # my google api key: AIzaSyD_KOWpLeeAV5f5vKCAio4M65DlxHDlT74
    data = request.get_json()
    print(data)
    city = data.get('city')
    # latitude = data.get('latitude')
    # latitude = float(latitude)
    # longitude = data.get('longitude')
    # longitude = float(longitude)
    address = data.get('address')
    full_address = f"{address}, {city}"

    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={full_address}&key={GOOGLE_API_KEY}"

    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['status'] == 'OK':
            latitude = data['results'][0]['geometry']['location']['lat']
            longitude = data['results'][0]['geometry']['location']['lng']
        else:
            return jsonify({"error": "Geocoding failed"}), 400
    else:
        return jsonify({"error": "Failed to contact geocoding service"}), 500

    # print('latitude:', latitude)
    # print('longitude:', longitude)
    conn = db_connection()
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    query = """
        SELECT *
        FROM address 
        WHERE city = ?;
        """
    cursor.execute(query, (city,))
    rows = cursor.fetchall()
    addresses = [dict(row) for row in rows]
    conn.commit()
    conn.close()
    response = []
    for address in addresses:
        #print(address)
        lati_pick = address['latitude']
        longi_pick = address['longitude']
        distance = haversine(latitude, longitude, lati_pick, longi_pick)
        #print(distance)
        if distance <= 10:# we consider <=10km as convenience
            if 'address_id' in address:
                del address['address_id']
            response.append(address)
    print(response)
    if response != []:
        return jsonify(response), 200
    return jsonify({"message": "No convenient pick-up location"}), 200


def haversine(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))

    # Radius of Earth in kilometers.
    r = 6371

    # Calculate the result
    return c * r


if __name__ == "__main__":
    # initialize db
    conn = sqlite3.connect("address.db")

    cursor = conn.cursor()
    cursor.execute('''DROP TABLE IF EXISTS address;''')
    #`address_id` BIGINT NOT NULL PRIMARY KEY
    sql_query = """ CREATE TABLE address(
        `address_id` INTEGER PRIMARY KEY AUTOINCREMENT, 
        `unit_number` INT NOT NULL,
        `street_number` INT NOT NULL,
        `address_line1` VARCHAR(30) NOT NULL,
        `address_line2` VARCHAR(30) NULL,
        `city` VARCHAR(30) NOT NULL,
        `province` VARCHAR(30) NULL,
        `postal_code` VARCHAR(7) NOT NULL,
        `country` VARCHAR(30) NULL,
        `latitude` FLOAT(24) NOT NULL,
        `longitude` FLOAT(24) NOT NULL
    );"""
    cursor.execute(sql_query)
    
    # set path for config file
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(current_dir, 'config.json'))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything        
    try:
        address_ip = config_data['AddressService']['ip']
        address_port = config_data['AddressService']['port']
        # print(f"address port:{address_port} address ip: {address_ip}")
    except KeyError:
        print("Address config missing")
        exit(1)
    app.run(host=address_ip, port=address_port, debug=True)