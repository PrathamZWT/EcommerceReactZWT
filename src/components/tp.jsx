import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "@mui/material/styles";
import { Drawer } from "@mui/material";
import { Link } from "react-router-dom";

export default function ButtonAppBar() {
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Toggle mobile menu
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close mobile menu after clicking a link
  const handleLinkClick = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#333", padding: "5px 20px" }}
      >
        <Toolbar>
          {/* Menu Button (Visible only on small screens) */}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "block", md: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Logo and Title */}
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center" }}
            onClick={handleLinkClick}
          >
            <img
              src="/images/wmremove-transformed.png"
              alt="ShopHive Logo"
              style={{
                width: "80px",
                height: "80px",
                display: "block",
                marginRight: theme.spacing(2),
              }}
            />
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: "bold" }}
            >
              <span style={{ color: "#FFB22C" }}>Shop</span>
              <span style={{ color: "#CD9F61" }}>Hive</span>
            </Typography>
          </Link>

          {/* Shopping Cart Icon (Visible on larger screens) */}
          <ShoppingCartIcon
            sx={{
              fontSize: "28px",
              marginRight: "10px",
              display: { xs: "none", md: "block" },
            }}
          />

          {/* Navigation Buttons (Mobile friendly, responsive) */}
          <Button
            color="inherit"
            sx={{ display: { xs: "none", md: "inline-block" } }}
            onClick={handleLinkClick}
          >
            Home
          </Button>
          <Button
            color="inherit"
            sx={{ display: { xs: "none", md: "inline-block" } }}
            onClick={handleLinkClick}
          >
            Wishlist
          </Button>
          <Button
            color="inherit"
            sx={{ display: { xs: "none", md: "inline-block" } }}
            onClick={handleLinkClick}
          >
            Category
          </Button>
          <Button
            color="inherit"
            sx={{ display: { xs: "none", md: "inline-block" } }}
            onClick={handleLinkClick}
          >
            Product
          </Button>
          <Button
            color="inherit"
            sx={{ display: { xs: "none", md: "inline-block" } }}
            onClick={handleLinkClick}
          >
            SignUp
          </Button>
          <Button
            color="inherit"
            sx={{ display: { xs: "none", md: "inline-block" } }}
            onClick={handleLinkClick}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: 240,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ textAlign: "center", padding: theme.spacing(2) }}>
          <Button
            color="inherit"
            sx={{ display: "block" }}
            onClick={handleLinkClick}
          >
            Home
          </Button>
          <Button
            color="inherit"
            sx={{ display: "block" }}
            onClick={handleLinkClick}
          >
            Wishlist
          </Button>
          <Button
            color="inherit"
            sx={{ display: "block" }}
            onClick={handleLinkClick}
          >
            Category
          </Button>
          <Button
            color="inherit"
            sx={{ display: "block" }}
            onClick={handleLinkClick}
          >
            Product
          </Button>
          <Button
            color="inherit"
            sx={{ display: "block" }}
            onClick={handleLinkClick}
          >
            SignUp
          </Button>
          <Button
            color="inherit"
            sx={{ display: "block" }}
            onClick={handleLinkClick}
          >
            Login
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
}
