from flask import Flask, request, jsonify
import sqlite3

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from werkzeug.security import generate_password_hash, check_password_hash
import json
import sys
import os
import uuid

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db', 'customer.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Customer(db.Model):
    customer_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)  # Assuming user_id is unique for customer
    pickup_address_id = db.Column(db.Integer, nullable=True)  # Assuming delivery_address_id is not a foreign key


with app.app_context():
    db.create_all()


@app.route("/customer", methods=["POST"])
def create_customer():
    if request.method == "POST":
        try:
            data = request.json
            customer = Customer(
                user_id=data['user_id'],
                pickup_address_id=data.get("pickup_address_id", None)
            )
            db.session.add(customer)
            db.session.commit()
            return jsonify({'message': 'New customer created', 'customer_id': customer.customer_id}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "Duplicate entry, the customer already exists"}), 409  # 409 Conflict
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400


@app.route('/customer/<int:customer_id>', methods=['GET'])
def get_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    return jsonify({
        'customer_id': customer.customer_id,
        'user_id': customer.user_id,
        'pickup_address_id': customer.pickup_address_id
    }), 200


@app.route('/customer/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    data = request.json

    # Update fields only if they are present in the request JSON
    if 'pickup_address_id' in data:
        customer.delivery_address_id = data['pickup_address_id']

    db.session.commit()
    return jsonify({'message': 'customer updated successfully'}), 200


@app.route('/customer/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    customer = Customer.query.get_or_404(customer_id)
    db.session.delete(customer)
    db.session.commit()
    return jsonify({'message': 'customer deleted successfully'}), 200


if __name__ == '__main__':
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(current_dir, "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    # getting ip for everything
    try:
        customer_ip = config_data['CustomerService']['ip']
        customer_port = config_data['CustomerService']['port']
    except KeyError:
        print("CustomerService config missing")
        exit(1)
    app.run(host=customer_ip, port=customer_port, debug=True)
