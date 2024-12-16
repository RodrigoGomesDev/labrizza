/**
 * Loads the modal window based on the productId passed to a snippet call
 * @param {string | number} id - The product id
 */
async function showModal(id){    
    const input = { 
        productId: Number(id),
        partnerAccessToken: null,
        selections: null
    };

    const response = await client.snippet.render("modal_spot.html", "SnippetQueries/cart_from_spot.graphql", input);
    setInnerHtmlById(response, "modal-content");

    document.getElementById('modal-spot').classList.remove('hidden')
    setTimeout(() => {
        document.getElementById('modal-spot').classList.add('ease-out')
        document.getElementById('modal-spot').classList.add('duration-100')
        document.getElementById('modal-spot').classList.remove('opacity-0')
        document.getElementById('modal-spot').classList.add('opacity-100')
    },300)
}

const closeSpotModal = () => {
    document.getElementById('modal-spot').classList.remove('ease-out')
    document.getElementById('modal-spot').classList.add('ease-in')
    document.getElementById('modal-spot').classList.remove('opacity-100')
    document.getElementById('modal-spot').classList.add('opacity-0')
    setTimeout(() => {
        document.getElementById('modal-spot').classList.add('hidden')    
    },300)
}

/**
 * The buy button's click event
 * @param {object[]} productVariantId - The product variant id
 */
async function spotBuyButtonClick(productVariantId){
    await buyClick(productVariantId);
}

/**
 * The add to cart button's click event
 * @param {object[]} productVariantId - The product variant id
 */
async function spotAddToCartButtonClick(productVariantId){
    await addToCartClick(productVariantId);
}