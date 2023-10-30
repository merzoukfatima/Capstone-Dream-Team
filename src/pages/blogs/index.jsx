import { collection, getDocs, query, where } from "firebase/firestore";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";

import BlogCardList from "@/components/Blog/BlogCard/blogCardList";
import StoryCardList from "@/components/Blog/StoryCard/storyCardList";

import Layout from "@/layout/Layout";
import { db } from "@/util/firebase";

export default function Blog({ blogs, stories }) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [storiesNum, setStoriesNum] = useState(4);
    const [blogsNum, setBlogsNum] = useState(6);

    const showMoreStories = () => {
        setStoriesNum(storiesNum + 2); // Show all stories when the button is clicked
    };
    const showLessStories = () => {
        setStoriesNum(4); // Show all stories when the button is clicked
    };
    const showMoreBlogs = () => {
        setStoriesNum(storiesNum + 3); // Show all stories when the button is clicked
    };
    const showLessBlogs = () => {
        setStoriesNum(6); // Show all stories when the button is clicked
    };
    return (
        <Layout>
            <div className='flex flex-col dark:text-white'>
                <div className='container mx-auto flex px-5 py-24 items-center justify-center flex-col'>
                    <div className='text-center lg:w-2/3 w-full'>
                        <p className='sm:text-4xl text-4xl mb-4 font-medium p-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-teal-400 to-teal-600'>
                            {t("blogPage.titleStories")}
                        </p>
                        <p className='mb-8 text-xl md:text-2xl lg:text-2xl'>
                            {t("blogPage.sub-textStories")}
                        </p>
                    </div>
                </div>
                <StoryCardList
                    language={router.locale}
                    stories={stories}
                    numToShow={storiesNum}
                />
                {storiesNum < stories.length && (
                    <div className='flex flex-row-reverse justify-center'>
                        <p className='text-base flex text-teal-500 font-bold no-underline hover:underline py-5 px-24'>
                            <span onClick={showMoreStories}>
                                {t("blogPage.loadMore")}
                            </span>
                            <svg
                                class='w-4 h-4 ml-1 mt-1'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                stroke-width='2'
                                fill='none'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                            >
                                <path d='M12 5v14'></path>
                                <path d='M19 12l-7 7-7-7'></path>
                            </svg>
                        </p>
                    </div>
                )}
                <hr className='mx-20' />
                <div className='container mx-auto flex px-5 py-10 items-center justify-center flex-col'>
                    <div className='text-center lg:w-2/3 w-full'>
                        <p className='sm:text-4xl text-4xl mb-4 font-medium p-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-200 via-teal-400 to-teal-600'>
                            {t("blogPage.titleBlogs")}
                        </p>
                        <p className='mb-8 sm:text-2xl text-2xl '>
                            {t("blogPage.sub-textBlogs")}
                        </p>
                    </div>
                </div>
                <BlogCardList
                    language={router.locale}
                    blogs={blogs}
                    numToShow={blogsNum}
                />
                {blogsNum < blogs.length && (
                    <div className='flex flex-row-reverse justify-center '>
                        <p className='text-base flex text-teal-500 font-bold no-underline hover:underline py-5 px-24'>
                            <span onClick={showMoreBlogs}>
                                {t("blogPage.loadMore")}
                            </span>
                            <svg
                                class='w-4 h-4 ml-1 mt-1'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                                stroke-width='2'
                                fill='none'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                            >
                                <path d='M12 5v14'></path>
                                <path d='M19 12l-7 7-7-7'></path>
                            </svg>
                        </p>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export async function getStaticProps({ locale }) {
    const dataBlogs = [];
    const dataStories = [];
    const q = query(collection(db, "blogs"), where("type", "==", "article"));
    const p = query(collection(db, "blogs"), where("type", "==", "story"));

    const queryBlog = await getDocs(q);
    const queryStory = await getDocs(p);
    queryBlog.forEach((doc) => {
        dataBlogs.push(doc.data());
    });
    queryStory.forEach((doc) => {
        dataStories.push(doc.data());
    });
    return {
        props: {
            ...(await serverSideTranslations(locale, ["common"])),
            blogs: dataBlogs,
            stories: dataStories,
        },
    };
}
