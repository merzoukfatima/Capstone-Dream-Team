import { onAuthStateChanged } from "firebase/auth";
import {
    collection,
    getDocs,
    onSnapshot,
    query,
    where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { BsPersonFillUp } from "react-icons/bs";
import { GiForkKnifeSpoon } from "react-icons/gi";

import { auth, db } from "@/util/firebase";

import StatCard from "./statCard";

const StatCardList = () => {
    const [authUser, setAuthUser] = useState(null);
    const [totalDonors, setTotalDonors] = useState(0);
    const [totalMeals, setTotalMeals] = useState(0);
    const [totalActiveMeals, setTotalActiveMeals] = useState(0);
    const [totalDonation, setTotalDonation] = useState(0);

    useEffect(() => {
        // Define a function to fetch user information from Firestore.
        onAuthStateChanged(auth, (user) => {
            // If a user is authenticated, set 'authUser' to the user; otherwise, set it to null.
            user ? setAuthUser(user) : setAuthUser(null);
        });
        const fetchInformation = async () => {
            if (authUser) {
                const userId = authUser.uid; // Get the user's unique identifier (UID).
                const q = query(
                    collection(db, "donors"),
                    where("restaurantId", "==", userId)
                );
                const querySnapshot = await getDocs(q);
                setTotalDonors(querySnapshot.size);
                let totalMeals = 0;
                let totalActiveMeals = 0;
                let totalDonation = 0;
                querySnapshot.forEach((doc) => {
                    const meal = doc.data();
                    totalMeals += meal.quantity;
                    totalActiveMeals += meal.active_meal;
                    totalDonation += meal.quantity * meal.price;
                });
                setTotalMeals(totalMeals);
                setTotalActiveMeals(totalActiveMeals);
                setTotalDonation(totalDonation);
            }
        };
        const unsubscribe = onSnapshot(collection(db, "donors"), () => {
            fetchInformation();
        });
        return () => {
            unsubscribe();
        };
    }, [authUser]);

    return (
        <div className='mx-6 mb-6'>
            <div className='flex flex-wrap -mx-6'>
                <div className='w-full mt-6 px-2 sm:w-1/2 xl:w-1/4 '>
                    <StatCard
                        icon={<GiForkKnifeSpoon />}
                        title='Total Meals'
                        number={totalMeals}
                    />
                </div>

                <div className='w-full mt-6 px-2 sm:w-1/2 xl:w-1/4 '>
                    <StatCard
                        icon={<BsPersonFillUp />}
                        title='Total Active Meals'
                        number={totalActiveMeals}
                    />
                </div>
                <div className='w-full mt-6 px-2 sm:w-1/2 xl:w-1/4'>
                    <StatCard
                        icon={<BsPersonFillUp />}
                        title='Total Donors'
                        number={totalDonors}
                    />
                </div>
                <div className='w-full mt-6 px-2 sm:w-1/2 xl:w-1/4'>
                    <StatCard
                        icon={<BsPersonFillUp />}
                        title='Total Donation'
                        number={totalDonation}
                    />
                </div>
            </div>
        </div>
    );
};

export default StatCardList;
