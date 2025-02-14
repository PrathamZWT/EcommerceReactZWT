import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function ProductDetails() {
  const [productData, setProductData] = useState(null);
  const [totalQuantity, setTotalQuantity] = useState(1);
  const { id } = useParams();
  const [role, setRole] = useState();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  const addToCart = async (product_id) => {
    let formData = { product_id: product_id, quantity: totalQuantity };
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_CART_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const responseData = await res.json();

      if (res.ok) {
        console.log("Product added to cart:", responseData.message);
        window.location.reload();
        alert("Product successfully added to cart!");
      } else {
        console.error("Failed to add product to cart:", responseData.message);
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchProductData() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_PRODUCTS_API}/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch products");

        const jsonData = await response.json();
        setProductData(jsonData.products);
      } catch (error) {
        console.error("Error fetching product:", error);
        setProductData(null);
      }
    }

    fetchProductData();
  }, [id]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="relative">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-0 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto">
          <div className="img px-4 sm:px-20 max-w-full max-h-[750px] flex justify-center">
            <div className="img-box max-h-[750px] max-w-full flex justify-center">
              <img
                src={`${import.meta.env.VITE_IMAGE}/${productData.image_url}`}
                alt={productData.name}
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
          <div className="data w-full lg:px-10 pr-0 xl:justify-start justify-center flex items-center max-lg:pb-10 xl:my-2 lg:my-5 my-0">
            <div className="data w-full max-w-xl">
              <p className="text-lg font-medium leading-8 text-indigo-600 mb-4">
                Category&nbsp; /&nbsp; {productData.Category.name}
              </p>
              <h2 className="font-manrope font-bold text-3xl leading-10 text-gray-900 mb-2 capitalize">
                {productData.name}
              </h2>
              <div className="flex flex-col sm:flex-row sm:items-center mb-6">
                <h6 className="font-manrope font-semibold text-2xl leading-9 text-gray-900 pr-5 sm:border-r border-gray-200 mr-5">
                  ₹{productData.price}
                </h6>
                <h6 className="font-manrope font-semibold text-xl leading-9 text-gray-400 pr-5 sm:border-r border-gray-200 mr-5">
                  Available Stock : {productData.stock}
                </h6>
              </div>
              <p className="text-gray-500 text-base font-normal mb-5">
                {productData.description}
                <a href="#" className="text-indigo-600">
                  More....
                </a>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-8">
                <div className="flex sm:items-center sm:justify-center w-full">
                  <button
                    onClick={() =>
                      setTotalQuantity((prev) => (prev > 1 ? prev - 1 : 1))
                    }
                    className="cursor-pointer py-4 px-6 border border-gray-400 rounded-l-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
                    disabled={totalQuantity <= 1}
                  >
                    <svg
                      className="stroke-gray-900 group-hover:stroke-black"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M16.5 11H5.5"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <input
                    type="text"
                    className="font-semibold text-gray-900 cursor-pointer text-lg py-[13px] px-6 w-full sm:max-w-[118px] outline-0 border-y border-gray-400 bg-transparent placeholder:text-gray-900 text-center hover:bg-gray-50"
                    value={totalQuantity}
                    readOnly
                  />
                  <button
                    onClick={() =>
                      setTotalQuantity((prev) =>
                        prev < productData.stock ? prev + 1 : prev
                      )
                    }
                    className="cursor-pointer py-4 px-6 border border-gray-400 rounded-r-full bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-sm hover:shadow-gray-300"
                    disabled={totalQuantity >= productData.stock}
                  >
                    <svg
                      className="stroke-gray-900 group-hover:stroke-black"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M11 5.5V16.5M16.5 11H5.5"
                        stroke="#9CA3AF"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
                {role === "admin" ? (
                  <button
                    onClick={() =>
                      setIsOpenupdate({ open: true, id: product.id })
                    }
                    className="cursor-pointer py-4 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-indigo-100"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="24px"
                      viewBox="0 -960 960 960"
                      width="24px"
                      fill="#3949AB"
                    >
                      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                    </svg>
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={() => addToCart(productData.id)}
                    className="cursor-pointer py-4 px-5 rounded-full bg-indigo-50 text-indigo-600 font-semibold text-lg w-full flex items-center justify-center gap-2 transition-all duration-500 hover:bg-indigo-100"
                  >
                    <svg
                      className="stroke-indigo-600"
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.7394 17.875C10.7394 18.6344 10.1062 19.25 9.32511 19.25C8.54402 19.25 7.91083 18.6344 7.91083 17.875M16.3965 17.875C16.3965 18.6344 15.7633 19.25 14.9823 19.25C14.2012 19.25 13.568 18.6344 13.568 17.875M4.1394 5.5L5.46568 12.5908C5.73339 14.0221 5.86724 14.7377 6.37649 15.1605C6.88573 15.5833 7.61377 15.5833 9.06984 15.5833H15.2379C16.6941 15.5833 17.4222 15.5833 17.9314 15.1605C18.4407 14.7376 18.5745 14.0219 18.8421 12.5906L19.3564 9.84059C19.7324 7.82973 19.9203 6.8243 19.3705 6.16215C18.8207 5.5 17.7979 5.5 15.7522 5.5H4.1394ZM4.1394 5.5L3.66797 2.75"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    </svg>
                    Add to cart
                  </button>
                )}
              </div>
              {role === "admin" ? (
                <div
                  onClick={() => handelDelete(product.id)}
                  className="flex items-center gap-3"
                >
                  <Link
                    to="/cart"
                    className="cursor-pointer text-center w-full rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400"
                  >
                    <button className="cursor-pointer w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24px"
                        viewBox="0 -960 960 960"
                        width="24px"
                        fill="#FFFFFF"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                      Delete Product
                    </button>
                  </Link>
                </div>
              ) : (
                <div
                  onClick={() => addToCart(productData.id)}
                  className="flex items-center gap-3"
                >
                  <Link
                    to="/cart"
                    className="cursor-pointer text-center w-full rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400"
                  >
                    <button className="cursor-pointer w-full px-5 py-4 rounded-[100px] bg-indigo-600 flex items-center justify-center font-semibold text-lg text-white shadow-sm transition-all duration-500 hover:bg-indigo-700 hover:shadow-indigo-400">
                      Buy Now
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
