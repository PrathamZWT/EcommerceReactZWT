import { useState, useEffect } from "react";

export default function Cart() {
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    async function fetchCartData() {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${import.meta.env.VITE_CART_API}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await res.json();

        if (res.ok) {
          setCartData(responseData.Cart);
        } else {
          console.error("Failed to fetch cart data:", responseData.message);
          alert(responseData.message || "Failed to fetch cart data");
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        alert("An error occurred while fetching cart data. Please try again.");
      }
    }

    fetchCartData();
  }, []);
  console.log(cartData);

  const updateQuantity = async (id, quantity, stock) => {
    if (quantity > stock) {
      alert("Cannot increase quantity, product out of stock.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${import.meta.env.VITE_CART_API}/update`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, quantity }),
      });

      const responseData = await res.json();

      if (res.ok) {
        if (quantity < 1) {
          window.location.reload();
        }
        setCartData((prevCart) =>
          prevCart.map((product) =>
            product.id === id ? { ...product, quantity } : product
          )
        );
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to place an order.");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_ORDERS_API}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cartItems: cartData,
          total: cartData.reduce(
            (acc, product) => acc + product.Product.price * product.quantity,
            0
          ),
        }),
      });

      const responseData = await res.json();
      if (!res.ok) throw new Error(responseData.message);

      alert(responseData.message);
      setCartData([]);
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg-6 mx-auto">
        <h2 className="title font-manrope font-bold text-4xl leading-10 mb-8 text-center text-black">
          Shopping Cart
        </h2>

        <div className="hidden lg:grid grid-cols-2 py-6">
          <div className="font-normal text-xl leading-8 text-gray-500">
            Product
          </div>
          <p className="font-normal text-xl leading-8 text-gray-500 flex items-center justify-between">
            <span className="w-full max-w-[200px] text-center">Price</span>
            <span className="w-full max-w-[260px] text-center">Quantity</span>
            <span className="w-full max-w-[200px] text-center">Total</span>
          </p>
        </div>

        {cartData.map((product) => (
          <div
            key={product.id}
            className="grid grid-cols-1 lg:grid-cols-2 min-[550px]:gap-6 border-t border-gray-200 py-6"
          >
            <div className="flex items-center flex-col min-[550px]:flex-row gap-3 min-[550px]:gap-6 w-full">
              <div className="img-box min-w-1/2">
                <img
                  src={`${import.meta.env.VITE_IMAGE}/${
                    product.Product.image_url
                  }`}
                  alt={product.Product.name}
                  className="xl:w-[140px] rounded-xl object-cover"
                />
              </div>
              <div className="pro-data w-full">
                <h5 className="font-semibold text-xl text-black text-center">
                  {product.Product.name}
                </h5>
              </div>
            </div>
            <div className="flex items-center flex-col min-[550px]:flex-row w-full gap-2">
              <h6 className="font-bold text-2xl text-black w-full max-w-[176px] text-center">
                ₹{product.Product.price}
              </h6>
              <div className="flex items-center w-full justify-center">
                <button
                  onClick={() =>
                    updateQuantity(
                      product.id,
                      product.quantity - 1,
                      product.Product.stock
                    )
                  }
                  className="group rounded-l-full px-6 py-4 border border-gray-200"
                >
                  -
                </button>
                <input
                  type="text"
                  className="border-y border-gray-200 text-gray-900 font-semibold text-lg w-full max-w-[118px] min-w-[80px] py-3 text-center bg-transparent"
                  value={product.quantity}
                  readOnly
                />
                <button
                  onClick={() =>
                    updateQuantity(
                      product.id,
                      product.quantity + 1,
                      product.Product.stock
                    )
                  }
                  className="group rounded-r-full px-6 py-4 border border-gray-200"
                >
                  +
                </button>
                <button
                  className="cursor-pointer"
                  onClick={() =>
                    updateQuantity(product.id, 0, product.Product.stock)
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="red"
                  >
                    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                  </svg>
                </button>
              </div>
              <h6 className="text-indigo-600 font-bold text-2xl w-full max-w-[176px] text-center">
                ₹{product.Product.price * product.quantity}
              </h6>
            </div>
          </div>
        ))}

        <div className="bg-gray-50 rounded-xl p-6 w-full mb-8 max-lg:max-w-xl max-lg:mx-auto">
          <div className="flex items-center justify-between w-full py-6">
            <p className="text-2xl text-gray-900">Total</p>
            <h6 className="text-2xl text-indigo-500">
              ₹
              {cartData.reduce(
                (acc, product) =>
                  acc + product.Product.price * product.quantity,
                0
              )}
            </h6>
          </div>
        </div>
        <button
          onClick={() => placeOrder()}
          className="bg-indigo-600 text-white py-4 px-8 rounded-full hover:bg-indigo-700"
        >
          Place Order
        </button>
      </div>
    </section>
  );
}
