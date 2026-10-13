const productGrid = document.getElementById("productGrid");
const productMessage = document.getElementById("productMessage");
const productCount = document.getElementById("productCount");
const heroImage = document.getElementById("heroImage");
const loadMoreButton = document.getElementById("loadMoreButton");
const scrollButtons = document.querySelectorAll("[data-scroll-target]");

let cursor = null;
let featuredProductShown = false;

const createProductCard = (product) => {
    const card = document.createElement("a");
    card.className = "product-card";
    card.href = "/products/" + product._id;

    const image = document.createElement("img");
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h3");
    name.textContent = product.name;

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = "₹" + product.price;

    info.appendChild(name);
    info.appendChild(category);
    info.appendChild(price);
    card.appendChild(image);
    card.appendChild(info);

    return card;
};

const showFeaturedProduct = (product) => {
    if (!product || !product.image) {
        return;
    }

    heroImage.src = product.image;
    heroImage.alt = product.name || "Featured product";
    heroImage.hidden = false;
};

const fetchProducts = () => {

    let url = "/products/api";

    if (cursor) {
        url = url + "?cursor=" + cursor;
    }

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                console.log("Products could not be loaded.");
            }

            return response.json();
        })
        .then((data) => {

            data.products.forEach((product) => {
                productGrid.appendChild(createProductCard(product));

                if(!featuredProductShown && product.image){
                    showFeaturedProduct(product);
                    featuredProductShown = true;
                }
            });

            cursor = data.nextCursor;
            loadMoreButton.hidden = !data.hasMore;
        })
        .catch((error) => {
            console.log(error);
            productMessage.textContent = "Unable to load products. Please try again.";
        })
};

loadMoreButton.addEventListener("click", () => {
    fetchProducts();
});

fetchProducts();
