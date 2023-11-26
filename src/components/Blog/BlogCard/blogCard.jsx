import Link from "next/link";
import { useTranslation } from "next-i18next";
import React from "react";

export default function BlogCard({ blog }) {
    const { t } = useTranslation("common");

    return (
        <div className='dark:text-white flex flex-col justify-center lg:py-5 md:py-5 overflow-hidden w-80  transition-shadow duration-300 rounded group'>
            <Link
                href={`/blogs/${
                    blog.data.type == "article" ? "blog" : "story"
                }/${blog.id}`}
            >
                <div className='relative '>
                    <img
                        src={blog.data.featured_image}
                        className='rounded-xl object-cover w-full h-56'
                        alt={blog.data.title}
                    />
                    <div className='group-hover:bg-transparent transition rounded-xl duration-300 absolute bottom-0 top-0 right-0 left-0 bg-gray-700 opacity-25'></div>
                </div>
                <div className='py-2'>
                    <p className='w-80 bg-white rounded-xl p-2 text-stone-900 text-xl font-medium capitalize line-clamp-2 group-hover:text-blue-700'>
                        {blog.data.title}
                    </p>
                </div>

                <div className='flex justify-between items-center my-1'>
                    <p className='bg-blue-400 group-hover:bg-blue-500 px-4 py-2 rounded-md text-white font-medium font-Outfit'>
                        {t("blogPage.storyCard.readMore")}
                    </p>

                    <div className='flex'>
                        <span className='text-gray-400 dark:text-white inline-flex items-center lg:ml-auto md:ml-0 ml-auto leading-none text-md'>
                            {blog.data.publish_date}
                        </span>
                    </div>
                </div>
            </Link>
        </div>
    );
}
