import base64
from os.path import exists

from flask import Flask, request, jsonify, Response, send_from_directory, make_response
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.exc import IntegrityError
from werkzeug.utils import secure_filename
import json
import os

app = Flask(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(BASE_DIR, 'db', 'image.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + db_path
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = os.path.join(BASE_DIR, 'uploaded_images')
db = SQLAlchemy(app)
allowed_extensions = {'png', 'jpg', 'jpeg', 'gif', 'webp'}


class MealImage(db.Model):
    image_id = db.Column(db.Integer, primary_key=True)
    image_filename = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    mimetype = db.Column(db.String(255), nullable=False)
    meal_id = db.Column(db.Integer, nullable=True)


with app.app_context():
    db.create_all()


# Utility function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in allowed_extensions


@app.route('/image/', methods=['POST'])
def upload_image():
    # Check if meal_id is provided
    meal_id = request.form.get('meal_id', None)
    if not meal_id:
        return jsonify({"error": "No meal_id provided"}), 400

    # Validate the meal_id, for example, checking if it's an integer
    try:
        meal_id = int(meal_id)
    except ValueError:
        return jsonify({"error": "Invalid meal_id"}), 400

    if 'image' not in request.files:
        print(request.files)
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    # Check if the file exists in the folder
    file_exists = exists(filepath)

    try:
        if not file_exists:
            # Save the file if it does not exist
            file.save(filepath)

        # Check if an entry for this filename already exists in the database
        # existing_image = MealImage.query.filter_by(image_filename=filename).first()


        # Create a new database entry
        new_image = MealImage(image_filename=filename, name=filename, mimetype=file.mimetype, meal_id=meal_id)
        db.session.add(new_image)
        db.session.commit()
        return jsonify({'message': 'Image uploaded/record created', 'image_id': new_image.image_id}), 200

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "A database error occurred, potentially due to a duplicate filename."}), 400


@app.route('/image/<int:meal_id>', methods=['GET'])
def get_image(meal_id):
    image = MealImage.query.filter_by(meal_id=meal_id).first_or_404()
    response = make_response(send_from_directory(app.config['UPLOAD_FOLDER'], image.image_filename))
    # response.headers['Cache-Control'] = 'public, max-age=31536000'  # Example: 1 year
    return response


@app.route('/image/<int:meal_id>', methods=['DELETE'])
def delete_image(meal_id):
    try:
        image = MealImage.query.filter_by(meal_id=meal_id).all()[0]
    except IndexError:
        return jsonify({"error": "No such image"}), 404

    filepath = os.path.join(app.config['UPLOAD_FOLDER'], image.image_filename)

    try:
        # Delete the file from the filesystem
        if os.path.exists(filepath):
            os.remove(filepath)

        # Delete the entry from the database
        db.session.delete(image)
        db.session.commit()

        return jsonify({'message': 'Image and record successfully deleted'}), 200
    except Exception as e:
        # Log the error or handle it as appropriate
        db.session.rollback()
        return jsonify({"error": "An error occurred while deleting the image"}), 500


if __name__ == "__main__":
    current_dir = os.getcwd()
    config_path = os.path.abspath(os.path.join(current_dir, 'config.json'))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    try:
        image_ip = config_data['ImageService']['ip']
        image_port = config_data['ImageService']['port']
    except KeyError:
        print("ImageService config missing")
        exit(1)
    app.run(host=image_ip, port=image_port, debug=True)
