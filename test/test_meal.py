import requests

GATEWAY_URI = "http://127.0.0.1:14000/"

meal_list = [
    {
        "chef_id": 1,
        "name": "Spaghetti Carbonara",
        "cost": 12.5
    },
    {
        "chef_id": 2,
        "name": "Margherita Pizza",
        "cost": 10.0
    },
    {
        "chef_id": 3,
        "name": "Vegan Burger",
        "cost": 9.5
    }
]

def test_populate_meal_db(meal_list):
    for meal_data in meal_list:
        response = requests.post(GATEWAY_URI + "meal", json=meal_data)
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
                try:
                    print("Request failed with response:", response.json())
                except ValueError:
                    print("Response is not in JSON format")

def test_get_meal_by_meal_id(meal_id_to_get):
    response = requests.get(GATEWAY_URI + f"meal/{meal_id_to_get}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("Meal with given meal_id not found.")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")

def test_update_meal(meal_id_to_update, update_data):
    response = requests.put(GATEWAY_URI + f"meal/{meal_id_to_update}", json=update_data)
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")

def test_delete_meal(meal_id_to_delete):
    response = requests.delete(GATEWAY_URI + f"meal/{meal_id_to_delete}")
    if response.status_code == 200:
        try:
            data = response.json()
            print("Response JSON:", data)
        except ValueError:
            print("Response is not in JSON format")
    else:
        print("Request failed with status code:", response.status_code)
        if response.text:
            try:
                print("Request failed with response:", response.json())
            except ValueError:
                print("Response is not in JSON format")


def test_get_meals_by_chef(chef_id):
    response = requests.get(GATEWAY_URI + f"meal/chef/{chef_id}")

    if response.status_code == 200:
        try:
            meals_data = response.json()
            print("Meals found for the chef:", meals_data)
        except ValueError:
            print("Response is not in JSON format")
    elif response.status_code == 404:
        print("No meals found for the given chef_id.")
    else:
        print("Request failed.")
        try:
            error_response = response.json()
            print("Error:", error_response)
        except ValueError:
            print("Error response is not in JSON format")





# Example usage:

# Populate the database with meals
# test_populate_meal_db(meal_list)


# Get a meal by meal ID
# test_get_meal_by_meal_id(1)
# Get a meal by chef_id
# test_get_meals_by_chef(2)

# Update a meal's information
update_data = {
    "name": "Quinoa Salad",
    "cost": 11.0
}
# test_update_meal(1, update_data)

# Delete a meal by meal ID
test_delete_meal(2)
