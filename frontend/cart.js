document.addEventListener("submit",(event)=>{
    const form = event.target;

    if(!form.matches('form[action^="/cart/add/"]')){
        return;
    }

    event.preventDefault();

    const button = form.querySelector('button[type="submit"]');
    const message = form.querySelector(".cart-add-message");

    button.disabled = true;
    message.textContent = "Adding to cart...";

    fetch(form.action,{
        method: "POST",
        headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams(new FormData(form))
    })
        .then((response)=>{
            if(response.redirected){
                window.location.href = response.url;
                return null;
            }

            return response.json().then((data)=>{
                if(!response.ok){
                    throw new Error(data.message || "Could not add this product.");
                }

                return data;
            });
        })
        .then((data)=>{
            if(!data){
                return;
            }

            message.textContent = data.message;
            message.className = "cart-add-message cart-add-success";
        })
        .catch((error)=>{
            message.textContent = error.message;
            message.className = "cart-add-message cart-add-error";
        })
        .then(()=>{
            button.disabled = false;
        });
});
