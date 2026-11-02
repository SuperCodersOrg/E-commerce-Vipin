const Cart = require("../models/Cart");
const Product = require("../models/Product");

const sendAddToCartResponse = (req,res,status,success,message,returnPath)=>{
    if(req.get("X-Requested-With") === "XMLHttpRequest"){
        res.status(status).json({
            success: success,
            message: message
        });
        return null;
    }

    res.redirect(returnPath);
    return null;
};

const showCart = (req,res)=>{
    Cart.findOne({ user: req.user._id })
        .populate("items.product")
        .then((cart)=>{
            let cartItems = [];

            if(cart){
                cartItems = cart.items.filter((item)=> item.product);
            }

            res.render("cart",{
                cartItems,
                canCheckout: cartItems.every((item)=> item.product.stock >= item.quantity),
                isLoggedIn: req.isLoggedIn
            });
        })
        .catch((error)=>{
            console.log("Cart loading error:",error.message);
            res.status(500).send("Could not load your cart.");
        });
};

const addToCart=(req,res)=>{
    const returnPath = req.body.returnTo && req.body.returnTo.startsWith("/") && !req.body.returnTo.startsWith("//")
        ? req.body.returnTo
        : "/products";

    Product.findById(req.params.productId)
        .then((product)=>{
            if(!product){
                return sendAddToCartResponse(req,res,404,false,"Product not found.",returnPath);
            }

            if(product.stock < 1){
                return sendAddToCartResponse(req,res,400,false,"This product is out of stock.",returnPath);
            }

            return Cart.findOne({ user: req.user._id })
                .then((cart)=>{
                    if(!cart){
                        cart = new Cart({
                            user: req.user._id,
                            items: []
                        });
                    }

                    const cartItem = cart.items.find((item)=>{
                        return item.product.toString() === product._id.toString();
                    });

                    if(cartItem){
                        if(cartItem.quantity >= product.stock){
                            return sendAddToCartResponse(req,res,400,false,"No more units are available.",returnPath);
                        }

                        cartItem.quantity = cartItem.quantity + 1;
                    }else{
                        cart.items.push({
                            product: product._id,
                            quantity: 1
                        });
                    }

                    return cart.save();
                });
        })
        .then((cart)=>{
            if(cart){
                sendAddToCartResponse(req,res,200,true,"Added to cart.",returnPath);
            }
        })
        .catch((error)=>{
            console.log("Adding to cart error:",error.message);

            if(req.get("X-Requested-With") === "XMLHttpRequest"){
                return res.status(500).json({
                    success: false,
                    message: "Could not add this product to your cart."
                });
            }

            res.status(500).send("Could not add this product to your cart.");
        });
};

const changeQuantity = (req,res)=>{
    Cart.findOne({ user: req.user._id })
        .then((cart)=>{
            if(!cart){
                return null;
            }

            const cartItem = cart.items.find((item)=>{
                return item.product.toString() === req.params.productId;
            });

            if(!cartItem){
                return null;
            }

            if(req.body.change === "increase"){
                return Product.findById(req.params.productId)
                    .then((product)=>{
                        if(!product || cartItem.quantity >= product.stock){
                            return null;
                        }

                        cartItem.quantity = cartItem.quantity + 1;
                        return cart.save();
                    });
            }else if(req.body.change === "decrease" && cartItem.quantity > 1){
                cartItem.quantity = cartItem.quantity - 1;
            }

            return cart.save();
        })
        .then(()=>{
            res.redirect("/cart");
        })
        .catch((error)=>{
            console.log("Cart quantity update error:",error.message);
            res.status(500).send("Could not update the quantity.");
        });
};

const removeFromCart = (req,res)=>{
    Cart.findOne({ user: req.user._id })
        .then((cart)=>{
            if(!cart){
                return null;
            }

            cart.items = cart.items.filter((item)=>{
                return item.product.toString() !== req.params.productId;
            });

            return cart.save();
        })
        .then(()=>{
            res.redirect("/cart");
        })
        .catch((error)=>{
            console.log("Cart item removal error:",error.message);
            res.status(500).send("Could not remove this product from your cart.");
        });
};

module.exports = {
    showCart,
    addToCart,
    changeQuantity,
    removeFromCart
};
