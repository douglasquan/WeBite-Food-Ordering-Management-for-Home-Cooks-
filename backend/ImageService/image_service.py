import base64
from flask import Flask, request, jsonify, Response, send_from_directory
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
allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}


class MealImage(db.Model):
    image_id = db.Column(db.Integer, primary_key=True)
    image_filename = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    mimetype = db.Column(db.String(255), nullable=False)
    meal_id = db.Column(db.Integer, unique=True, nullable=True)


with app.app_context():
    db.create_all()


# Utility function to check allowed file extensions
def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in allowed_extensions


@app.route('/image', methods=['POST'])
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
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        mimetype = file.mimetype

        # Save the file
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # Store the filename in the database
        new_image = MealImage(image_filename=filename,
                              name=filename,
                              mimetype=mimetype,
                              meal_id=meal_id)
        db.session.add(new_image)
        db.session.commit()

        return jsonify({'message': 'Image uploaded', 'image_id': new_image.image_id}), 200


@app.route('/image/<int:meal_id>', methods=['GET'])
def get_image(meal_id):
    image = MealImage.query.filter_by(meal_id=meal_id).first_or_404()
    print(image.image_filename)
    return send_from_directory(app.config['UPLOAD_FOLDER'], image.image_filename)


if __name__ == "__main__":
    current_dir = os.getcwd()
    config_path = os.path.abspath(
        os.path.join(current_dir, "config.json"))
    with open(config_path, 'r') as config_file:
        config_data = json.load(config_file)
    try:
        image_ip = config_data['ImageService']['ip']
        image_port = config_data['ImageService']['port']
    except KeyError:
        print("ImageService config missing")
        exit(1)
    app.run(host=image_ip, port=image_port, debug=True)
