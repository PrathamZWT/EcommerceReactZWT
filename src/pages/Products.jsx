import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useLocation } from "react-router-dom";

export default function Products() {
  const [productData, setProductData] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenupdate, setIsOpenupdate] = useState({ open: false, id: null });
  const [productimage, setproductImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState();
  const location = useLocation();
  const [productformData, setProductFormData] = useState({
    name: "",
    description: "",
    price: null,
    stock: null,
    category_id: null,
  });
  const formData = new FormData();
  const [cartData, setCartData] = useState({
    product_id: "",
  });
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

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
  const addToWishList = async (product_id) => {
    let formData = { product_id: product_id };
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_WISHLIST_API}`, {
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
        console.log("Product added to wishlist:", responseData.message);
        alert("Product successfully added to wishlist!");
      } else {
        console.error(
          "Failed to add product to wishlist:",
          responseData.message
        );
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    async function fetchProductData() {
      const cid = location.state?.categoryId;
      let url = null;

      if (cid) {
        url = `${import.meta.env.VITE_PRODUCTS_API}/?id=${cid}`;
      } else {
        url = `${import.meta.env.VITE_PRODUCTS_API}/`;
      }
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch products");

        const jsonData = await response.json();
        console.log("Fetched Data:", jsonData);

        setProductData(jsonData.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProductData([]);
      }
    }

    fetchProductData();
  }, []);

  const handleChange = (e) => {
    if (e.target.files) {
      setproductImage(e.target.files[0]);
    } else {
      setProductFormData({
        ...productformData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    Object.keys(productformData).forEach((key) => {
      formData.append(key, productformData[key]);
    });
    formData.append("product-image", productimage);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_PRODUCTS_API}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseData = await res.json();
      console.log(responseData);

      if (res.ok) {
        alert("product successfully added!");
        window.location.reload();
        setIsOpen(false);
        setLoading(false);
      } else {
        alert(responseData.message);
        // setIsOpen(false);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error adding category:", error);
      alert("An error occurred. Please try again.");
    }
  };
  const handelDelete = async (id) => {
    try {
      var result = confirm("Are you sure you want to delete this Product?");
      if (result) {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("You must be logged in to place an order.");
          return;
        }

        const res = await fetch(`${import.meta.env.VITE_PRODUCTS_API}/${id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await res.json();
        if (!res.ok) throw new Error(responseData.message);
        window.location.reload();
        alert(responseData.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(error.message || "An error occurred. Please try again.");
    }
  };
  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const formData = new FormData();
    Object.keys(productformData).forEach((key) => {
      formData.append(key, productformData[key]);
    });

    if (productimage) {
      formData.append("product-image", productimage);
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_PRODUCTS_API}/${isOpenupdate.id}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const responseData = await res.json();

      if (res.ok) {
        alert("Product successfully updated!");
        setLoading(false);
        setIsOpenupdate(false);
        window.location.reload();
      } else {
        alert(responseData.message);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert("An error occurred. Please try again.");
    }
  };

  if (!productData.length) {
    return <p className="text-center text-gray-500">Loading products...</p>;
  }

  return (
    <section className="max-w-4/5 mx-auto flex flex-col gap-10 pt-10">
      {role === "admin" && (
        <div className="ml-auto">
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
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-10 place-items-center">
        {productData.map((product) => (
          <div
            key={product.id}
            className="w-full self-stretch max-w-sm flex flex-col justify-between bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <Link to={`/productDetails/${product.id}`}>
              <img
                className="p-8 rounded-t-lg w-full h-60 object-cover"
                src={`${import.meta.env.VITE_IMAGE}/${product.image_url.replace(
                  "\\",
                  "/"
                )}`}
                alt={product.name}
              />
            </Link>
            <div className="flex flex-col justify-between px-5 pb-5 ">
              <a href="#">
                <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  {product.name} ({product.Category.name})
                </h5>
                <p className="text-white text-s">{product.description}...</p>
              </a>
            </div>
            <div className="flex  justify-between px-5 pb-5">
              <div className="flex items-center justify-center ">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{product.price}
                </span>
                {role === "admin" ? (
                  <>
                    <div className="flex gap-4">
                      <a
                        onClick={() =>
                          setIsOpenupdate({ open: true, id: product.id })
                        }
                        href="#"
                        className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm pl-8 py-1.5 text-center "
                      >
                        <img
                          className="h-10 w-10"
                          src="../../public/images/edit.png"
                          alt="add to cart"
                        />
                      </a>
                      <a
                        onClick={() => handelDelete(product.id)}
                        href="#"
                        className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-1.5 text-center"
                      >
                        <img
                          className="h-10 w-10"
                          src="../../public/images/delete.png"
                          alt="add to cart"
                        />
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-4">
                      <a
                        onClick={() => addToCart(product.id)}
                        href="#"
                        className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm pl-8 py-1.5 text-center "
                      >
                        <img
                          className="h-10 w-10"
                          src="../../public/images/cart.png"
                          alt="add to cart"
                        />
                      </a>
                      <a
                        onClick={() => addToWishList(product.id)}
                        href="#"
                        className="text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm py-1.5 text-center"
                      >
                        <img
                          className="h-10 w-10"
                          src="../../public/images/shopping-cart.png"
                          alt="add to cart"
                        />
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              Add Product
            </h2>
            <input
              type="text"
              placeholder="Product Name*"
              onChange={handleChange}
              id="name"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder="Product Description*"
              onChange={handleChange}
              id="description"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Product Price in Rupees*"
              onChange={handleChange}
              id="price"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Product Stock*"
              onChange={handleChange}
              id="stock"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Product's Category ID*"
              onChange={handleChange}
              id="category_id"
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
      {isOpenupdate.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdate}
            className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold text-amber-600 mb-4">
              Update Product
            </h2>
            <input
              type="text"
              placeholder="Product Name"
              onChange={handleChange}
              id="name"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="text"
              placeholder="Product Description"
              onChange={handleChange}
              id="description"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Product Price in Rupees"
              onChange={handleChange}
              id="price"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Product Stock"
              onChange={handleChange}
              id="stock"
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="number"
              placeholder="Product's Category ID"
              onChange={handleChange}
              id="category_id"
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
                onClick={() => setIsOpenupdate(false)}
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
