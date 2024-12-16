window.addEventListener("load", buyListSetup, false);
window.addEventListener("dataLayerConfigured", handleBuyListPageView, false);

/**
 * Iterates over the buy list hidden input's productId array, loading the product information in a snippet
 * and assigning the resulting row to the respective product div
 */
async function buyListSetup() {
    const rows = document.querySelectorAll('[id^="buy-list-product-div-"]');
    if (rows == null || rows.size < 1) return;

    for (const row of rows) {
        const id = Number(row.getAttribute('product-id'));
        const response = await client.snippet.render(
            "buy_list_product_snippet.html",
            "SnippetQueries/buy_list_product.graphql",
            { id }
        );
        setInnerHtml(response, row);
        setBuyListDefaultQuantity(row.dataset.quantity, row.getAttribute("product-id"))
    }
    await buyListCalculatePrices();
}

function setBuyListDefaultQuantity(quantity, productId) {
    const quantityDiv = document.getElementById(`buy-list-product-selected-quantity-${productId}`);
    quantityDiv.value = quantity;
}

function handleBuyListPageView() {
    const buyListProductsDataLayerInfo = [];
    let productInfoInputs = document.querySelectorAll('input[id^=buy-list-data-layer-]');
    for (const productInfo of productInfoInputs) {
        buyListProductsDataLayerInfo.push(JSON.parse(productInfo.value));
    };
    window.dispatchEvent(
        new CustomEvent('buyListPageViewed', {
            detail: {
                products: buyListProductsDataLayerInfo
            }
        })
    );
}

/**
 * Iterates the page's buy list product divs, evaluating if each product should be added to the list (based
 * on the product availability, quantity selected, and if it is selected on the checkbox).
 */
function buyListGetProductsAndQuantities() {
    const rows = document.querySelectorAll('[id^="buy-list-product-div-"]');
    if (rows == null || rows.size < 1) return;

    let input = [];
    for (const row of rows)
        buyListPushProductInput(row.getAttribute('product-id'), input);

    return input;
}

/**
 * Recalculates the total value of the buy list by processing each product row
 * to validate if it should the considered in the total price, if positive
 * the product gets added to the price input, then we calculate it and replace.
 * Additional parameter passing means that the method was called by a buy list
 * product change, then we reload the price in that product's div as well.
 * @param {string | null} productId - The id of the product that thriggered this call (optional)
 */
async function buyListCalculatePrices(productId = null) {
    let input = buyListGetProductsAndQuantities();
    if (input == null) return;
    await buyListRenderAndReplacePrice(input, "product-prices-div");

    if (productId) {
        input = [];
        buyListPushProductInput(productId, input);
        await buyListRenderAndReplacePrice(
            input,
            "buy-list-product-price-" + productId
        );
    }
}

/**
 * Avaliates if the product is selected in the checkbox, then proceeds to validate
 * on it's more generic case, adding it to the given input list.
 * @param {string} productId - The product Id
 * @param {object[]} input - The input list we are populating
 * @param {number} input[].productVariantId - The variant id of the product
 * @param {number} input[].quantity - How many units of this item is the selection
 */
function buyListPushProductInput(productId, input) {
    const isProductSelected = document.getElementById(
        "buy-list-product-checked-" + productId
    )?.checked;

    if (isProductSelected) {
        const productDiv = document.getElementById(
            "buy-list-product-div-" + productId
        );
        pushProductInput(productDiv, input);
    }
}

/**
 * Renders the price snippet using an array of product ids and quantities for the query,
 * and replaces the content of the div with the result
 * @param {object[]} input - The query input object, a list of objects containing productVariantId and quantity
 * @param {number} input[].productVariantId - The variant id of the product
 * @param {number} input[].quantity - How many units of this item is the selection
 * @param {string} priceDivId - The div's id that should be replaced
 */
async function buyListRenderAndReplacePrice(input, priceDivId) {
    const response = await client.snippet.render(
        "price_snippet.html",
        "SnippetQueries/calculate_prices.graphql",
        { calculatePricesProductsInput: input }
    );
    setInnerHtmlById(response, priceDivId);
}

/**
 * Reloads the buy list product div the newly selected attribute, and recalculates the price.
 * This page uses contextual searching for information, going up to the closest() div
 * above to get the current buy list product scope.
 * @param {HTMLInputElement} element - The html element originating this call, 
 */
async function buyListSelectAttribute(element) {
    const attrId = element.getAttribute("attribute-id");
    const attrValue = element.value;
    const productId = element.getAttribute("product-id");
    const attributeDiv = element.closest("[attribute-selections]");
    const selections = getSelectedAttributes(attributeDiv, attrId, attrValue);

    await buyListRenderAttributes(productId, selections);
    await buyListCalculatePrices(productId);
}

/**
 * Reloads the buy list product div with the updated information loaded from the product snippet,
 * accounting the change in the product's attribute selection.
 * @param {string | number} productId - The product id
 * @param {object[]} selections - The list of selected attributes and it's values
 * @param {number} selections[].attributeId
 * @param {string} selections[].value
 */
async function buyListRenderAttributes(productId, selections) {
    const variables = {
        id: Number(productId),
        selections,
    };

    const elementId = `buy-list-product-div-${productId}`;
    const response = await client.snippet.render(
        "buy_list_product_snippet.html",
        "SnippetQueries/buy_list_product.graphql",
        variables
    );

    setInnerHtmlById(response, elementId);
}

/**
 * The buy button's click event function
 */
async function buyListBuyClick() {
    const input = buyListGetProductsAndQuantities();

    if (input.length == 0) {
        showOverlay('Não foi possivel adicionar ao carrinho!', 'Selecione pelo menos um item da lista', true);
        return;
    }

    const success = await addOrCreateCheckout(input);
    if (!success) {
        showOverlay('Ocorreu um erro!', 'Ocorreu um erro, por favor, tente novamente', true);
    }

    if (success && checkoutUrl != "") {
        window.location = checkoutUrl;
    }
}

/**
 * The add to cart's click event function
 */
async function buyListAddToCartClick() {
    const input = buyListGetProductsAndQuantities();

    if (input.length == 0) {
        showOverlay('Não foi possivel adicionar ao carrinho!', 'Selecione pelo menos um item da lista', true);
        return;
    }

    const success = await addOrCreateCheckout(input);
    if (success) {
        await loadMiniCart();
        
        if (!document.querySelector('.cart-sidebar').classList.contains('open')) {
            setCartDivVisibility();
        }
    } else {
        showOverlay('Ocorreu um erro!', 'Erro ao adicionar produto(s) ao carrinho.', true)
    }
}
