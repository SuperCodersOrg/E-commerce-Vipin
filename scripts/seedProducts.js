require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const sampleProducts = [
    {
        name: "Block Party Oversized Tee",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
        description: "A relaxed heavyweight tee with an easy everyday fit.",
        price: 1299,
        category: "T-Shirts"
    },
    {
        name: "After Hours Hoodie",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85",
        description: "A warm pullover hoodie made for cooler evenings.",
        price: 2499,
        category: "Hoodies"
    },
    {
        name: "Utility Cargo Pants",
        image: "https://share.google/e3NqOOip0GnLQnwXd",
        description: "Everyday cargos with a roomy cut and practical pockets.",
        price: 2199,
        category: "Bottoms"
    },
    {
        name: "Concrete Zip Jacket",
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
        description: "A light zip jacket that layers easily over your daily fit.",
        price: 3299,
        category: "Outerwear"
    },
    {
        name: "Daily Uniform Sweatshirt",
        image: "https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?auto=format&fit=crop&w=900&q=85",
        description: "A soft crewneck with a clean shape and relaxed shoulders.",
        price: 1999,
        category: "Sweatshirts"
    },
    {
        name: "Night Shift Cap",
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=85",
        description: "A simple adjustable cap for finishing an everyday look.",
        price: 899,
        category: "Accessories"
    },
    {
        name: "Streetline Denim",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
        description: "Relaxed straight-leg denim made for daily wear.",
        price: 2399,
        category: "Bottoms"
    },
    {
        name: "Signal Graphic Tee",
        image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=900&q=85",
        description: "A graphic cotton tee with a bold, easy-to-style look.",
        price: 1499,
        category: "T-Shirts"
    }
];

const addProduct = (product) => {
    return Product.exists({ name: product.name })
        .then((existingProduct) => {
            if (existingProduct) {
                return false;
            }

            return Product.create(product).then(() => {
                return true;
            });
        });
};

const seedProducts = () => {
    if (!process.env.MONGO_URI) {
        return Promise.reject(new Error("MONGO_URI is missing from the backend environment file."));
    }
c
    return mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            let addProducts = Promise.resolve(0);

            sampleProducts.forEach((product) => {
                addProducts = addProducts.then((addedCount) => {
                    return addProduct(product).then((wasAdded) => {
                        if (wasAdded) {
                            addedCount = addedCount + 1;
                        }

                        return addedCount;
                    });
                });
            });

            return addProducts;
        });
};

seedProducts()
    .then((addedCount) => {
        console.log(addedCount + " sample products added.");
    })
    .catch((error) => {
        console.error("Could not add sample products:", error.message);
        process.exitCode = 1;
    })
    .finally(() => {
        mongoose.disconnect();
    });
