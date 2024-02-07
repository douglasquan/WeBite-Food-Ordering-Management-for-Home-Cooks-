import requests

BASE = "http://127.0.0.1:5000/"

chef_list = [
  {
    "name": "douglas",
    "phone_num":  1234567890,  
    "email": "douglas@gmail.com",
    "password": "douglas123"
  },
  {
    "name": "sam",
    "phone_num":  1231231231,  
    "email": "sam@gmail.com",
    "password": "sam123"
  },
  {
    "name": "tom",
    "phone_num":  3453453455,  
    "email": "tom@gmail.com",
    "password": "tom123"
  }
]

def test_populate_chef_db(chef_list):
    for chef_data in chef_list:
        response = requests.post(BASE + "chef", json=chef_data)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)

def test_get_chef_by_id(id_to_get):
    response = requests.get(BASE + f"chef?id={id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Chef id not found.")
    else:
        print("Request failed with status code:", response.status_code)

def test_update_chef(id_to_update, update_data):
    response = requests.put(BASE + f"chef?id={id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)

def test_delete_chef(id_to_delete, chef_data):
    response = requests.delete(BASE + f"chef?id={id_to_delete}", json=chef_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)



# Populate the database with chefs
# test_populate_chef_db(chef_list)

# Get a chef by ID
test_get_chef_by_id('2575607672')

# # Update a chef's information
# update_data = {
#     "name": "douglas_updated2",  
#     "email": "douglas_updated_email@example.com",  
# }
# test_update_chef(2575607672, update_data)

# # Delete a chef
# chef_to_delete = {
#     "id": 735570578,
#     "name": "tom",
#     "phone_num":  3453453455,  
#     "email": "tom@gmail.com",
#     "password": "tom123"
# }
# test_delete_chef(chef_to_delete["id"], chef_to_delete)
