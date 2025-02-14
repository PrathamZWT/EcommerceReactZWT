import { useState, useEffect } from "react";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function WishList() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    async function fetchWishListData() {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${import.meta.env.VITE_WISHLIST_API}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch Wishlist");

        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData);

        setWishlistItems(jsonData.WishList || []);
      } catch (error) {
        console.error("Error fetching WishList:", error);
        setWishlistItems([]);
      }
    }

    fetchWishListData();
  }, []);
  console.log(wishlistItems);

  const removeFromWishlist = async (id) => {
    let result = confirm(
      "Are you sure you want to remove this product from your WishList "
    );
    if (result) {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${import.meta.env.VITE_WISHLIST_API}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await res.json();

        console.log(responseData.message);
        if (res.ok) {
          console.log("Product removed from wishlist:", responseData.message);
          alert("Product removed from wishlist:");
          window.location.reload();
        } else {
          console.error(
            "Failed to remove from wishlist:",
            responseData.message
          );
          alert(responseData.message);
        }
      } catch (error) {
        console.error("Error in removing from wishlist:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  const addToCart = async (product_id) => {
    let formData = { product_id: product_id };
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

      console.log(responseData.message);
      if (res.ok) {
        console.log("Product added to cart:", responseData.message);
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
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <FaHeart className="text-red-500 text-2xl" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          <span className="bg-gray-200 px-3 py-1 rounded-full text-sm">
            {wishlistItems.length} items
          </span>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <FaHeart className="mx-auto text-6xl text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start adding items to your wishlist to keep track of products you
              love!
            </p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.product_id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative pb-[75%] overflow-hidden">
                  <Link to={`/productDetails/${item.product_id}`}>
                    <img
                      src={`${import.meta.env.VITE_IMAGE}/${
                        item.Product.image_url
                      }`}
                      alt={item.Product.name}
                      className="absolute h-full w-full object-cover transition-transform hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1560343090-f0409e92791a";
                      }}
                    />
                  </Link>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.Product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {item.Product.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-gray-900">
                      ₹ {Number(item?.Product?.price ?? 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item.product_id)}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FaShoppingCart /> Add to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="p-2 cursor-pointer text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
