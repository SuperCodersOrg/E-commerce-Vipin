require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const isLoggedIn = require("./middleware/isLoggedIn");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "frontend")));
app.use(isLoggedIn);

app.get("/", (req, res) => {
    res.redirect("/products");
});

app.get("/signup", (req, res) => {
    res.render("signup", {
        message: "",
        isLoggedIn: req.isLoggedIn
    });
});

app.get("/login", (req, res) => {
    res.render("login", {
        message: "",
        isLoggedIn: req.isLoggedIn
    });
});

app.get("/forgot-password", (req, res) => {
    res.render("forgot-password", {
        message: "",
        isLoggedIn: req.isLoggedIn
    });
});

app.get("/profile", authMiddleware, (req, res) => {
    res.render("profile", {
        username: req.user.username,
        email: req.user.email,
        isLoggedIn: req.isLoggedIn
    });
});

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.use((req, res) => {
    res.status(404).send("Page not found.");
});

const port = process.env.PORT;

connectDB();

app.listen(port, () => {
    console.log("Server running at http://localhost:" + port);
});
