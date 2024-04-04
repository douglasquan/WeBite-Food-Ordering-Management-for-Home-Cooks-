#!/bin/bash

# Path to the backend directory
BACKEND_PATH="backend" # Replace with your actual backend path

# Start each service in the background and store their PIDs
python "$BACKEND_PATH/OrderService/order_service.py" &
echo $! > service_pids.txt

python "$BACKEND_PATH/ReviewService/review_service.py" &
echo $! >> service_pids.txt

python "$BACKEND_PATH/UserService/CustomerService/customer_service.py" &
echo $! >> service_pids.txt

python "$BACKEND_PATH/UserService/ChefService/chef_service.py" &
echo $! >> service_pids.txt

python "$BACKEND_PATH/UserService/UserService.py" &
echo $! >> service_pids.txt

python "$BACKEND_PATH/ImageService/image_service.py" &
echo $! >> service_pids.txt

python "$BACKEND_PATH/MealService/meal_service.py" &
echo $! >> service_pids.txt

python "$BACKEND_PATH/gateway.py" &
echo $! >> service_pids.txt

echo "All services have been started."
