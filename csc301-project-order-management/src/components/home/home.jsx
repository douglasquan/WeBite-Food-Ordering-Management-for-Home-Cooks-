import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../navbar/Navbar.jsx";
import logo from "./static/logo.png";
import delivery from "./static/food_delivery.jpg";
import home_page_hero from "./static/background1.jpg";
import aboutUsImage from "./static/about_us_image.jpg"; // Adjust the path as needed
import { getReq, postReq } from "../view_control";

function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logoutUser = async () => {
    await postReq("user/logout");
    setUser(null);
    window.location.href = "/";
  };

  useEffect(() => {
    (async () => {
      try {
        const resp = await getReq("user/@me");
        setUser(resp.data);
      } catch (error) {
        console.log("Not authenticated");
      } finally {
        setLoading(false); // Set loading to false after the request is complete
      }
    })();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator while checking auth status
  }

  return (
    <div className='bg-custom-grey min-h-screen flex flex-col'>
      {user && <Navbar />}
      {user ? (
        <div
          className='relative h-[500px] bg-no-repeat bg-center bg-cover '
          style={{ backgroundImage: `url(${home_page_hero})` }}
        >
          <div className='text-center py-32'>
            <img src={logo} alt='Logo' className='mx-auto w-48 h-auto' />
            <div>
              <h1 className='text-4xl font-extrabold leading-tight text-black'>
                Welcome, {user.username}!
              </h1>
            </div>
          </div>
          {/* About Us Section */}
          <section className='text-center lg:text-left bg-white py-2'>
            <div className='container mx-auto px-6'>
              <div className='lg:flex justify-between items-center'>
                <div className='lg:w-6/12 lg:p-0 p-7'>
                  <h2 className='text-5xl font-bold mb-5 text-gray-700'>Do You Cook?</h2>
                  <p className='text-xl mb-5 text-gray-700 italic'>
                    If you do, share your food with your friends!
                  </p>
                  <p className='text-xl mb-5 text-gray-700 italic'>
                    If you don't, get your food from your friends!
                  </p>
                </div>
                <div className='lg:w-5/12 order-2 mt-6 lg:order-1'>
                  <img src={aboutUsImage} alt='About Us' className='rounded-md shadow-md' />
                </div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div className='relative px-4 pt-6 pb-16 sm:pb-24 '>
          <div class='bg-custom-grey px-6 py-12 text-center dark:bg-neutral-900 md:px-12 lg:text-left '>
            <div class='w-100 mx-auto sm:max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-7xl'>
              <div class='grid items-center gap-12 lg:grid-cols-2'>
                <div class='mt-12 lg:mt-0'>
                  <img src={logo} alt='Logo' className='mx-auto w-48 h-auto' />
                  <h1 class='mt-2 mb-16 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl'>
                    Taste like <br />
                    <span class='text-[#3b82f6]'>Home</span>
                  </h1>
                  <Link
                    to='/login'
                    className='bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 px-4 rounded-full text-2xl no-underline'
                  >
                    Get started
                  </Link>
                </div>
                <div class='mb-12 lg:mb-0'>
                  <img
                    src={delivery}
                    class='w-full rounded-lg shadow-lg dark:shadow-black/20'
                    alt=''
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='flex-grow'></div>

      {/* Footer */}
      <footer className='bg-gray-800 w-full py-4'>
        <p className='text-center text-sm text-gray-300'>
          Copyright © 2024 by WeBite.Inc. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;
