import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Category() {
  const [categoryData, setCategoryData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [categoryname, setCategoryName] = useState("");
  const [categoryimage, setcategoryImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const formData = new FormData();
  useEffect(() => {
    async function fetchCategoryData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_CATEGORY_API}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch categories");

        const jsonData = await response.json();
        setCategoryData(jsonData.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategoryData();
  }, []);

  const handleChange = (e) => {
    if (e.target.files) {
      setcategoryImage(e.target.files[0]);
    } else {
      setCategoryName(e.target.value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    formData.append("name", categoryname);
    formData.append("product-image", categoryimage);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_CATEGORY_API}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await res.json();

      if (res.ok) {
        setCategoryData([...categoryData, responseData.data]);
        alert("Category successfully added!");
        window.location.reload();
        setIsOpen(false);
        setLoading(false);
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section className="max-w-3/5 mx-auto justify-center items-end flex flex-col gap-10 p-10">
      <div className="mr-auto">
        <button
          onClick={() => setIsOpen(true)}
          className="cursor-pointer absolute bg-amber-500 hover:bg-amber-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24px"
            viewBox="0 -960 960 960"
            width="24px"
            fill="#ffffff"
          >
            <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
          </svg>
        </button>
      </div>

      <div className="relative flex flex-col rounded-lg w-full bg-white shadow-sm border border-slate-200 mx-auto mt-10">
        {categoryData.map((category) => (
          <Link to="/products" state={{ categoryId: category.id }}>
            <div
              key={category.id}
              className="text-slate-800 flex w-full justify-around items-center rounded-md p-2 pl-3 transition-all hover:bg-slate-100"
            >
              <span className="p-4">{category.id}</span>
              <span className="p-4">{category.name}</span>
              <span className="p-4">
                {new Date(category.createdAt).toLocaleDateString()}
              </span>
            </div>
          </Link>
        ))}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              Add Category
            </h2>
            <input
              type="text"
              placeholder="Category Name"
              onChange={handleChange}
              id="name"
              value={formData.name}
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="file"
              onChange={handleChange}
              id="image"
              className="w-full p-2 border rounded mb-3"
            />
            {formData.image && (
              <p className="text-sm text-gray-600">{formData.image.name}</p>
            )}
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
