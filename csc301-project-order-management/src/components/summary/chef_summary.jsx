import React, { useState, useEffect, useMemo } from "react";
import { getReq } from "../view_control.js";
import Navbar from "../navbar/Navbar.jsx";

const ChefSummaryPage = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState({});
  const [chefId, setChefId] = useState(null);
  const [mealNames, setMealNames] = useState({});

  useEffect(() => {
    const getChefId = async () => {
      try {
        const response = await getReq("user/chef/is-chef");
        if (response.data.is_chef) {
          setChefId(response.data.chef_id);
        } else {
          console.log("User is not a chef.");
        }
      } catch (error) {
        console.error("Failed to check chef status:", error);
      }
    };
    getChefId();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (chefId) {
        try {
          const ordersResponse = await getReq(`/order/chef/${chefId}`);
          const ordersData = ordersResponse.data;
          setOrders(ordersData);

          // Create a map of customer IDs to usernames
          const customerUsernames = {};

          for (const order of ordersData) {
            if (!customerUsernames[order.customer_id]) {
              try {
                // Get user_id from the customer
                const customerResponse = await getReq(`/user/customer/${order.customer_id}`);
                const user_id = customerResponse.data.user_id;

                // Get username using the user_id
                const userResponse = await getReq(`/user/${user_id}`);
                customerUsernames[order.customer_id] = userResponse.data.username;
              } catch (error) {
                console.error(
                  `Failed to fetch username for customer ID ${order.customer_id}:`,
                  error
                );
                customerUsernames[order.customer_id] = "Unknown"; // Fallback username
              }
            }
          }

          setCustomers(customerUsernames);
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        }
      }
    };

    fetchOrders();
  }, [chefId]); // Depend on chefId

  useEffect(() => {
    const fetchMealNames = async (uniqueMealIds) => {
      uniqueMealIds.forEach(async (mealId) => {
        if (!mealNames[mealId]) {
          try {
            const mealResponse = await getReq(`/meal/${mealId}`);
            setMealNames((prev) => ({ ...prev, [mealId]: mealResponse.data.name }));
          } catch (error) {
            console.error(`Failed to fetch name for meal ID ${mealId}:`, error);
          }
        }
      });
    };

    if (orders.length > 0 && Object.keys(mealNames).length === 0) {
      const uniqueMealIds = [...new Set(orders.map((order) => order.meal_id))];
      fetchMealNames(uniqueMealIds);
    }
  }, [orders, mealNames]); // Only re-run if orders change and mealNames is empty

  // Using useMemo to avoid recalculating orderTable on every render
  const orderTable = useMemo(() => {
    return orders.reduce((acc, order) => {
      const customerUsername = customers[order.customer_id] || "Fetching...";
      const mealName = mealNames[order.meal_id] || "Fetching...";
      if (!acc[mealName]) {
        acc[mealName] = {};
      }
      acc[mealName][customerUsername] = `${order.status} - $${order.price}`;
      console.log(acc);
      return acc;
    }, {});
  }, [orders, customers, mealNames]);

  return (
    <div>
      <Navbar />
      <h2 className='text-2xl font-bold my-5 text-center'>Orders Summary</h2>
      <div className='overflow-auto'>
        <table className='min-w-full divide-y divide-gray-200'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Meal / Customer
              </th>
              {Object.values(customers).map((username) => (
                <th
                  key={username}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {username}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {Object.entries(orderTable).map(([mealName, customerOrders]) => (
              <tr key={mealName}>
                <td className='px-6 py-4 whitespace-nowrap'>{mealName}</td>
                {Object.values(customers).map((username, index) => (
                  <td
                    key={index}
                    className={`px-6 py-4 whitespace-nowrap ${
                      customerOrders[username]?.includes("UNPAID")
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {customerOrders[username] || "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChefSummaryPage;
