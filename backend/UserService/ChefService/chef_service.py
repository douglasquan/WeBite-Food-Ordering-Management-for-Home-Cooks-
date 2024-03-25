from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from flask_migrate import Migrate
import json
import sqlite3
import uuid
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db', 'chef.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class Chef(db.Model):
    chef_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, unique=True, nullable=False)
    rating = db.Column(db.Float, nullable=True)
    description = db.Column(db.Text, nullable=True)
    delivery_address_id = db.Column(db.Integer, nullable=True)  # Assuming delivery_address_id is not a foreign key


with app.app_context():
    db.create_all()


@app.route("/chef", methods=["POST"])
def create_chef():
    if request.method == "POST":
        try:
            data = request.json
            chef = Chef(
                user_id=data['user_id'],
                rating=data['rating'],
                description=data['description'],
                delivery_address_id=data['delivery_address_id']
            )
            db.session.add(chef)
            db.session.commit()
            return jsonify({'message': 'New chef created', 'chef_id': chef.chef_id}), 200
        except IntegrityError:
            db.session.rollback()
            return jsonify({"error": "Duplicate entry, the chef already exists"}), 409  # 409 Conflict
        except KeyError:
            return jsonify({"error": "Missing fields in the JSON data"}), 400


@app.route('/chef/<int:chef_id>', methods=['GET'])
def get_chef(chef_id):
    chef = Chef.query.get_or_404(chef_id)
    return jsonify({
        'chef_id': chef.chef_id,
        'user_id': chef.user_id,
        'rating': chef.rating,
        'description': chef.description,
        'delivery_address_id': chef.delivery_address_id
    }), 200


@app.route('/chef/<int:chef_id>', methods=['PUT'])
def update_chef(chef_id):
    chef = Chef.query.get_or_404(chef_id)
    data = request.json

    # Update fields only if they are present in the request JSON
    if 'rating' in data:
        chef.rating = data['rating']
    if 'description' in data:
        chef.description = data['description']
    if 'delivery_address_id' in data:
        chef.delivery_address_id = data['delivery_address_id']

    db.session.commit()
    return jsonify({'message': 'Chef updated successfully'}), 200


@app.route('/chef/<int:chef_id>', methods=['DELETE'])
def delete_chef(chef_id):
    chef = Chef.query.get_or_404(chef_id)
    db.session.delete(chef)
    db.session.commit()
    return jsonify({'message': 'Chef deleted successfully'}), 200


if __name__ == "__main__":
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(current_dir, "config.json"))
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
