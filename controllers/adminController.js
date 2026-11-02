const Product = require("../models/Product");
const Order = require("../models/Order");

const showDashboard = (req,res)=>{
    let period = req.query.period || "daily";

    if(period !== "daily" && period !== "weekly" && period !== "monthly"){
        period = "daily";
    }

    const now = new Date();
    let startDate = new Date(now);

    if(period === "daily"){
        startDate.setHours(0,0,0,0);
    }else if(period === "weekly"){
        startDate.setDate(startDate.getDate() - 6);
        startDate.setHours(0,0,0,0);
    }else{
        startDate = new Date(now.getFullYear(),now.getMonth(),1);
    }

    const dateRange = {
        $gte: startDate,
        $lte: now
    };

    Order.find({
        paymentStatus: "paid",
        $or: [
            { paidAt: dateRange },
            { paidAt: null, updatedAt: dateRange }
        ]
    }).then((orders)=>{
            let salesTotal = 0;
            const productSales = [];

            orders.forEach((order)=>{
                salesTotal = salesTotal + order.totalAmount;

                order.items.forEach((item)=>{
                    const itemTotal = item.price * item.quantity;
                    const productId = item.product ? item.product.toString() : item.name;
                    let foundProduct = null;

                    productSales.forEach((product)=>{
                        if(product.productId === productId){
                            foundProduct = product;
                        }
                    });

                    if(foundProduct){
                        foundProduct.total = foundProduct.total + itemTotal;
                        foundProduct.quantity = foundProduct.quantity + item.quantity;
                    }else{
                        productSales.push({
                            productId: productId,
                            name: item.name,
                            total: itemTotal,
                            quantity: item.quantity
                        });
                    }
                });
            });

            return Product.find()
                .then((products)=>{
                    res.render("admin-dashboard",{
                        isLoggedIn: req.isLoggedIn,
                        period: period,
                        salesTotal: salesTotal,
                        paidOrderCount: orders.length,
                        productSales: productSales,
                        products: products
                    });
                });
        })
        .catch((error)=>{
            console.log("Admin dashboard error:",error.message);
            res.status(500).send("Could not load the admin dashboard.");
        });
};

const updateProductStock = (req,res)=>{
    const stock = Number(req.body.stock);

    if(req.body.stock === "" || !Number.isInteger(stock) || stock < 0){
        return res.status(400).send("Stock must be a whole number of zero or more.");
    }

    Product.findById(req.params.productId)
        .then((product)=>{
            if(!product){
                return res.status(404).send("Product not found.");
            }

            product.stock = stock;
            return product.save();
        })
        .then((product)=>{
            if(product){
                res.redirect("/admin");
            }
        })
        .catch((error)=>{
            console.log("Product stock update error:",error.message);
            res.status(500).send("Could not update product stock.");
        });
};

const showAddProduct = (req,res)=>{
    res.render("admin-add-product",{
        isLoggedIn: req.isLoggedIn,
        message: ""
    });
};

const addProduct = (req,res)=>{
    const name =req.body.name.trim();
    const image =req.body.image.trim();
    const description =req.body.description.trim();
    const category =req.body.category.trim();
    const price = Number(req.body.price);
    const stock = Number(req.body.stock);


    const product = new Product({
        name: name,
        image: image,
        description: description,
        price: price,
        category: category,
        stock: stock
    });

    product.save()
        .then(()=>{
            res.redirect("/admin");
        })
        .catch((error)=>{
            console.log("Product save error:",error.message);
            res.status(500).send("Could not add product.");
        });
};

module.exports = {
    showDashboard,
    showAddProduct,
    addProduct,
    updateProductStock
};
