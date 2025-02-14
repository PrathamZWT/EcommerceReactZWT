import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError([]);

    try {
      const res = await fetch(`${import.meta.env.VITE_AUTH_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const jsonData = await res.json();
      console.log(jsonData.error);

      if (!jsonData.success) {
        setError(
          Array.isArray(jsonData.error) ? jsonData.error : [jsonData.error]
        );
        return;
      }
    } catch (err) {
      console.error("Error during signup:", err);
      setError(["An error occurred, please try again later."]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="First Name"
          className="border p-3 rounded-lg"
          id="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border p-3 rounded-lg"
          id="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 cursor-pointer"
          disabled={
            loading ||
            !formData.first_name ||
            !formData.last_name ||
            !formData.email ||
            !formData.password
          }
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to={"/sign-in"}>
          <span className="text-blue-700">Sign in</span>
        </Link>
      </div>
      {error.length > 0 &&
        error.map((err, index) => (
          <p key={index} className="text-red-500">
            {err}
          </p>
        ))}
    </div>
  );
}
