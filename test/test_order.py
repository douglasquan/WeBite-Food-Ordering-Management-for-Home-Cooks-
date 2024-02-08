import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

order_list = [
{
  "customer_id": 1001,
  "chef_id": 2001,
  "quantity": 2,
  "price": 25.99,
}
,
{
  "customer_id": 1002,
  "chef_id": 2002,
  "quantity": 1,
  "price": 12.5,
}
,
{
  "customer_id": 1003,
  "chef_id": 2003,
  "quantity": 3,
  "price": 30.75,
},
{
  "customer_id": 1004,
  "chef_id": 2004,
  "quantity": 4,
  "price": 45.0,
},
{
  "customer_id": 1005,
  "chef_id": 2005,
  "quantity": 2,
  "price": 20.0,
}
]

def test_populate_order_db(order_list):
    for order_data in order_list:
        response = requests.post(GATEWAY_URI + "order", json=order_data)
        if response.status_code == 200:
            try:
                data = response.json()
                print("Response JSON:", data)
            except ValueError:
                print("Response is not in JSON format")
        else:
            print("Request failed with status code:", response.status_code)
            print("Request failed with response:", response.json())


def test_get_order_by_id(id_to_get):
    response = requests.get(GATEWAY_URI + f"order?id={id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Order id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


def test_update_order(id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"order?id={id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())

def test_delete_order(id_to_delete, order_data):
    response = requests.delete(GATEWAY_URI + f"order?id={id_to_delete}", json=order_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        print("Request failed with response:", response.json())


update_data = {
    "customer_id": "1007",  
    "price": "15.99",  
}

order_to_delete = {
  "customer_id": 1005,
  "chef_id": 2005,
  "quantity": 2,
  "price": 20.0,
}

# Populate the order.db with order
# test_populate_order_db(order_list)

# Get a order by ID
# test_get_order_by_id(1964905803)

# Update a order's information
test_update_order(1964905803, update_data)

# Delete an order
# test_delete_order(9823460271, order_to_delete)
