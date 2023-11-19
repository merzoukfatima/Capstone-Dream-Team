import Mealcard from "./mealcard";
import Mealbar from "./mealbar";
import React, { useState, useEffect } from "react";
import { collection, query, getDocs, where } from "firebase/firestore"; // Import Firestore functions
import { db } from "../../util/firebase"; // Replace with your Firebase config import
import Bar from "./Bar";
export default function Meals() {
    const [rest, setRest] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchMeals() {
            const restaurantCollection = collection(db, "restaurant");
            const mealCollection = collection(db, "meals");
            try {
                const querySnapshot = await getDocs(restaurantCollection);
                const data = await Promise.all(
                    querySnapshot.docs.map(async (doc) => {
                        const restaurant = doc.data();
                        const restaurantId = doc.id;

                        // Fetch details for each meal using restaurant_id
                        const mealQuery = query(
                            mealCollection,
                            where("restaurantId", "==", restaurantId)
                        );
                        const mealSnapshot = await getDocs(mealQuery);

                        const mealDetails = mealSnapshot.docs.map((mealDoc) => {
                            const mealData = mealDoc.data();
                            return {
                                price: mealData.price,
                                maxMeals: mealData.maxMeals,
                                name: mealData.name,
                                description: mealData.name,
                                imageUrl: mealData.imageUrl,
                                restaurantName: mealData.restaurantName,
                                restaurantId: mealData.restaurantId,
                                quantity: 1,
                            };
                        });

                        return {
                            Name: restaurant.restaurantName,
                            email: restaurant.email,
                            current_restaurant_Id: restaurant.restaurantId,
                            image: restaurant.image,
                            mealDetails: mealDetails,
                        };
                    })
                );
                setRest(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchMeals();
    }, []);

    return (
        <div>
            {/* <Bar /> */}
            {/**search bar 
            <form>
                <label
                    htmlFor='default-search'
                    className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
                >
                    Search
                </label>
                <div className='relative'>
                    <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
                        <svg
                            className='w-4 h-4 text-gray-500 dark:text-gray-400'
                            aria-hidden='true'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 20 20'
                        >
                            <path
                                stroke='currentColor'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z'
                            />
                        </svg>
                    </div>
                    <input
                        type='search'
                        id='default-search'
                        className='block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
                        placeholder='Search for your favourite restaurant'
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        required
                    />
                    <button
                        type='submit'
                        className='text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'
                    >
                        Search
                    </button>
                </div>
            </form>*/}
            <div className='py-4 mx-4 md:mx-6'>
                <div className='mt-4 pb-4 flex space-x-3 border-b border-gray-200 dark:border-gray-700'>
                    <div>
                        <svg
                            className='fill-stroke text-gray-600 dark:text-white'
                            width={20}
                            height={20}
                            viewBox='0 0 20 20'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                        >
                            <path
                                d='M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z'
                                stroke='currentColor'
                                strokeWidth='1.25'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                            <path
                                d='M19.0004 19.0004L14.6504 14.6504'
                                stroke='currentColor'
                                strokeWidth='1.25'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                            />
                        </svg>
                    </div>
                    <input
                        type='text'
                        placeholder='Search for your favourite restaurant'
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                        className='focus:outline-none w-full bg-transparent text-sm text-gray-600'
                    />
                </div>
            </div>

            {rest
                .filter((restaurant) => {
                    return search.toLowerCase() === ""
                        ? restaurant
                        : restaurant.Name.toLowerCase().includes(search);
                })
                .map((restaurant, index) => (
                    <div className=' mb-5 mt-10 mx-auto ' key={index}>
                        <div className=' pl-3 pr-3 '>
                            <Mealbar
                                name={restaurant.Name}
                                current_restaurant_Id={
                                    restaurant.current_restaurant_Id
                                }
                                image={restaurant.image}
                            />
                        </div>
                        <div className='pb-10 pt-5 xl:mx-1 flex justify-center items-center '>
                            <div className='grid center grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg2:grid-cols-4 gap-20 md:gap-8 lg:gap-8 lg2:gap-2'>
                                {restaurant.mealDetails
                                    .slice(0, 4)
                                    .map((mealDetail, mealIndex) => (
                                        <div
                                            className='flex md:mb-10'
                                            key={mealIndex}
                                        >
                                            <Mealcard
                                                price={mealDetail.price}
                                                maxMeals={mealDetail.maxMeals}
                                                name={mealDetail.name}
                                                imageUrl={mealDetail.imageUrl}
                                                mealDetail={mealDetail}
                                            />
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                ))}
        </div>
    );
}
