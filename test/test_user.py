import requests
from datetime import datetime

GATEWAY_URI = "http://127.0.0.1:14000/"

user_list = [
    {
        "username": "chefjohn",
        "email": "john@example.com",
        "password": "supersecret",
        "phone_number": "1234567890"
    },
    {
        "username": "chefjane",
        "email": "jane@example.com",
        "password": "verysecret",
        "phone_number": "0987654321"
    },
    {
        "username": "chefdoe",
        "email": "doe@example.com",
        "password": "password123",
        "phone_number": "1122334455"
    }
]


def test_populate_user_db(user_list):
    for user_data in user_list:
        response = requests.post(GATEWAY_URI + "user", json=user_data)
        print(response)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            if response.text:
                print("Request failed with response:", response.json())


def test_get_user_by_id(id_to_get):
    response = requests.get(GATEWAY_URI + f"user/{id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("User id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            print("Request failed with response:", response.json())


def test_update_user(id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"user/{id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            print("Request failed with response:", response.json())


def test_delete_user(id_to_delete):
    response = requests.delete(GATEWAY_URI + f"user/{id_to_delete}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            print("Request failed with response:", response.json())


# Populate the database with users
test_populate_user_db(user_list)

# Get a user by ID
# test_get_user_by_id(2)

# Update a user's information
update_data = {
    "email": "newemail@example.com",
    "phone_number": "2223334444"
}
# test_update_user(2, update_data)

# Delete a user
# test_delete_user(3)
