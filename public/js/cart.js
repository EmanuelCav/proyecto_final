socket.on("newProduct", (cart) => {

    const containerCart = document.getElementById("container-cart")

    containerCart.innerHTML = '';

    cart.forEach((c) => {
        containerCart.innerHTML += `
            <div class="contain-product">
                <div class="product">
                <div class="contain-title">
                <p class="product-title">${c.title}</p>
                <p class="product-description">${c.description}</p>
            </div>
            <div class="contain-price">
                <p class="product-price">$${c.price}</p>
                <p class="product-stock ">unidades: ${c.stock}</p>
            </div>
        </div>
        `
    })

})