import React, { useState, useEffect } from "react";
import { FaSearch } from "react-icons/fa";
import ShopHiveLogo from "../../public/images/ShopHive.png";
import { Link, Navigate } from "react-router-dom";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { jwtDecode } from "jwt-decode";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState();
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
    setIsAuthenticated(!!token);
  }, []);
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <header className="bg-gray-200 shadow-md sticky top-0 left-0 z-100">
      <div className="flex justify-between items-center mx-auto p-3">
        <Link to={"/"}>
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap items-center">
            <img className="h-20 w-20" src={ShopHiveLogo} alt="ShopHive Logo" />
            <span className="text-yellow-600">Shop</span>
            <span className="text-black">Hive</span>
          </h1>
        </Link>

        <IconButton
          color="inherit"
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={handleDrawerToggle}
        >
          <MenuIcon />
        </IconButton>

        <form className="bg-gray-100 p-3 rounded-lg flex items-center w-full sm:w-64">
          <input
            type="search"
            name="search"
            id="search"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full"
            aria-label="Search"
          />
          <FaSearch className="text-yellow-400 ml-2" />
        </form>

        <ul className="flex gap-4 hidden sm:flex">
          <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
            <Link to="/"> Home</Link>
          </li>
          {role === "admin" && (
            <>
              <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                <Link to="/users">Users</Link>
              </li>
              <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                <Link to="/Categorys">Categories</Link>
              </li>
            </>
          )}
          <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
            <Link to="/products"> Product</Link>
          </li>

          {isAuthenticated ? (
            <>
              {role === "admin" ? (
                <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                  <Link to="/order-history">Orders</Link>
                </li>
              ) : (
                <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                  <Link to="/order-history">Order History</Link>
                </li>
              )}
              {role !== "admin" && (
                <>
                  <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                    <Link to="/cart">
                      <img
                        className="h-8 w-8"
                        src="../../public/images/carts.png"
                        alt=""
                      />
                    </Link>
                  </li>
                  <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                    <Link to="/wishlist">Wish List</Link>
                  </li>
                </>
              )}
              <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                <Link to="/profile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="oklch(0.681 0.162 75.834)"
                  >
                    <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
                  </svg>
                </Link>
              </li>
              <Link to={"/sign-in"}>
                <li
                  className="text-slate-700 hover:text-yellow-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </li>
              </Link>
            </>
          ) : (
            <>
              <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                <Link to="/sign-in">Sign In</Link>
              </li>
              <li className="text-slate-700 hover:text-yellow-600 cursor-pointer">
                <Link to="/register">Sign Up</Link>
              </li>
            </>
          )}
        </ul>
      </div>
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: "240px",
            boxSizing: "border-box",
          },
        }}
      >
        <div className="flex flex-col p-4">
          <Link to="/" className="py-2">
            Home
          </Link>
          <Link to="/" className="py-2">
            Cart
          </Link>
          <Link to="/" className="py-2">
            Product
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="py-2">
                Profile
              </Link>
              <Link to="/" onClick={handleLogout} className="py-2">
                Logout
              </Link>
            </>
          ) : (
            <>
              <Link to="/sign-in" className="py-2">
                Sign In
              </Link>
              <Link to="/sign-up" className="py-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </Drawer>
    </header>
  );
}
