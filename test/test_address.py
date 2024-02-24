import requests

GATEWAY_URI = "http://127.0.0.1:14000/"  # Change the port to match the address service

address_list = [
    {
        "unit_number": 1003,
        "street_number": 5162,
        "address_line1": "Yonge Street",
        "address_line2": " ",
        "city": "Toronto",
        "province": "Ontario",
        "postal_code": "M2N 0E9",
        "country": "Canada"
    },
]

def test_populate_address_db(address_list):
    for address_data in address_list:
        response = requests.post(GATEWAY_URI + "address", json=address_data)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            print("Request failed with response:", response.json())

def test_get_address_by_id(address_id_to_get):
    response = requests.get(GATEWAY_URI + f"address?address_id={address_id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Address id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

def test_update_address(address_id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"address?address_id={address_id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

def test_delete_address(address_id_to_delete, address_data):
    response = requests.delete(GATEWAY_URI + f"address?address_id={address_id_to_delete}", json=address_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


# Test cases:
test_address_id = 7682263484
update_data = {"city": "New Metropolis", "unit_number": "1004"}

# POST 
# test_populate_address_db(address_list)
        
# GET
# test_get_address_by_id(test_address_id)

# PUT
# test_update_address(test_address_id, update_data)

# DELETE
address_to_delete = address_list[0] # get a copy of address
# for key, value in update_data.items(): #update the address manually if you previously ran test_update_address
#     address_to_delete[key] = value
# print(address_to_delete)

test_delete_address(test_address_id, address_to_delete)
