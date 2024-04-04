# Paths to Python scripts
$scripts = @(
    ".\backend\UserService\CustomerService\customer_service.py",
    ".\backend\UserService\ChefService\chef_service.py",
    ".\backend\UserService\UserService.py",
    ".\backend\ReviewService\review_service.py",
    ".\backend\OrderService\order_service.py",
    ".\backend\MealService\meal_service.py",
    ".\backend\ImageService\image_service.py",
    ".\backend\AddressService\address_service.py",
    ".\backend\gateway.py"
)

# Loop through each script path and start it in a new PowerShell window
foreach ($script in $scripts) {
    Start-Process PowerShell -ArgumentList "-NoExit", "-Command", "python $script"
}
