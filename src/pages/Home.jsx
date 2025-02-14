import React, { useEffect, useState } from "react";
import HeroImage from "../../public/images/ShopHiveHeroImage.jpeg";
import { Link } from "react-router-dom";

export default function Home() {
  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_CATEGORY_API}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch category");

        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData);

        setCategoryData(jsonData.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategoryData();
  }, []);

  return (
    <div className="flex flex-wrap flex-col justify-center items-center">
      <section
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "80vh",
        }}
      ></section>

      <h1 className="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl pt-2">
        <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
          Categories
        </span>
      </h1>

      <section className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-10">
        {categoryData.map((category) => (
          <article
            key={category.id}
            className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl px-10 pb-8 pt-40 w-full max-w-md mx-auto mt-12 cursor-pointer hover:shadow-2xl hover:shadow-amber-500/50"
          >
            <Link to="/products" state={{ categoryId: category.id }}>
              <img
                src={`${import.meta.env.VITE_IMAGE}/${category.image_url}`}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
              <h3 className="z-10 mt-3 text-3xl font-bold text-white">
                {category.name}
              </h3>
              <div className="z-10 text-sm leading-6 text-gray-300">
                ShopHive
              </div>
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
