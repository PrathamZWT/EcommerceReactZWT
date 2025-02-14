import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile";
import ProductDetails from "./pages/ProductDetails";
import Header from "./components/header";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import PrivateRoute from "./components/PrivateRoute";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";
import Users from "./pages/Users";
import Category from "./pages/Category";
import OrderHistory from "./pages/OrderHistory";
import OrdersAdmin from "./pages/OrdersAdmin";
import WishList from "./pages/WishList";
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/sign-in" element={<SignIn />}></Route>
        <Route path="/register" element={<SignUp />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/Products" element={<Products />}></Route>
        <Route path="/productDetails/:id" element={<ProductDetails />}></Route>
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/categorys" element={<Category />}></Route>
          <Route path="/users" element={<Users />}></Route>
          <Route path="/orders-admin" element={<OrdersAdmin />}></Route>
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/order-history" element={<OrderHistory />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/cart" element={<Cart />}></Route>
          <Route path="/wishlist" element={<WishList />}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
