import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

meal_list = [
    {
        "name": "pasta",
        "cost": 3,
        "chef_id": 1
    }
    ,
    {
        "name": "burger",
        "cost": 5,
        "chef_id": 1
    }
    ,
    {
        "name": "pizza",
        "cost": 2,
        "chef_id": 1
    }
    ,
    {
        "name": "ramen",
        "cost": 6,
        "chef_id": 1
    }
    ,
    {
        "name": "steak",
        "cost": 10,
         "chef_id": 1
    }

]


def test_create_customer_db(meal_list):
    for meal_data in meal_list:
        response = requests.post(GATEWAY_URI + "meal/None", json=meal_data)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            print("Request failed with response:", response)


def test_get_customer_by_id(id_to_get):
    response = requests.get(GATEWAY_URI + f"meal?id={id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("customer id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


def test_update_customer(id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"meal?id={id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


def test_delete_customer(id_to_delete, order_data):
    response = requests.delete(GATEWAY_URI + f"meal?id={id_to_delete}", json=order_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


def test_menu(chef_id):
    response = requests.get(GATEWAY_URI + "meal/chef"+ f"?id={chef_id}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("customer id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

update_data = {
    "customer_id": "1007",
    "price": "15.99",
}

meal_to_delete = {
    "customer_id": 1005,
    "chef_id": 2005,
    "quantity": 2,
    "price": 20.0,
}
# meal_to_delete = {
#     "name": "pasta",
#     "cost": 3
# }


if __name__ == '__main__':
    # Populate the customers.db with customers
    test_create_customer_db(meal_list)
    test_menu(1)

    # Get a customer by ID
    #test_get_customer_by_id(1)

    # Update a customer's information
    # test_customer_order(1964905803, update_data)

    # Delete a customer
   # test_delete_customer(1, meal_to_delete)
   # test_get_customer_by_id(1)

