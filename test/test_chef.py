import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

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
        response = requests.post(GATEWAY_URI + "chef", json=chef_data)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            print("Request failed with response:", response.json())


def test_get_chef_by_id(id_to_get):
    response = requests.get(GATEWAY_URI + f"chef?id={id_to_get}")
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
        print("Request failed with response:", response.json())


def test_update_chef(id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"chef?id={id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

def test_delete_chef(id_to_delete, chef_data):
    response = requests.delete(GATEWAY_URI + f"chef?id={id_to_delete}", json=chef_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())



# Populate the dataGATEWAY_URI with chefs
# test_populate_chef_db(chef_list)

# Get a chef by ID
# test_get_chef_by_id('9052274285')

# # Update a chef's information
# update_data = {
#     "name": "douglas_updated",  
#     "email": "douglas_updated_email@example.com",  
# }
# test_update_chef(9052274285, update_data)

# # Delete a chef
chef_to_delete = {
    "name": "tom",
    "phone_num":  3453453455,  
    "email": "tom@gmail.com",
    "password": "tom123"
}
test_delete_chef(9823460271, chef_to_delete)
