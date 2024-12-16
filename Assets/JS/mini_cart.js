window.addEventListener("load", loadMiniCart, false);
let checkout;

/**
 * Loads the minicart component via snippet call, replacing the placeholder's div content with the snippet response.
 */
async function loadMiniCart() {
    try {
        checkout = await client.checkout.get();

        let variables = {
            checkoutId: "",
            hasCheckout: false,
        };

        if (checkout && checkout.data.checkoutId != "") {
            variables.checkoutId = checkout.data.checkoutId;
            variables.hasCheckout = true;
        }

        const response = await client.snippet.render(
            "mini_cart_snippet.html",
            "SnippetQueries/mini_cart.graphql",
            variables
        );

        const elementId = 'min-cart-items';
        setInnerHtmlById(response, elementId);
        updateCartQtyLabel();

        if (variables.hasCheckout) {
            await addUtmMetadata(variables.checkoutId);
        }
    } catch (error) {
        console.log(error);
    }
}

/**
 * Shows or hides the cart when the mouse moves over or out
 */
function setCartDivVisibility() {
    if (!document.querySelector('.cart-sidebar').classList.contains('open')) {
        $('.cart-sidebar').fadeIn('fast', function(){
            $('.cart-sidebar').addClass('open');
            $('.cart-sidebar').addClass('open-content');
        });
        
        window.dispatchEvent(new Event("cartViewed"));
    } else {
        $('.cart-sidebar').removeClass('open-content');
                
        setTimeout(function(){
            $('.cart-sidebar').fadeOut('fast', function(){
                $('.cart-sidebar').removeClass('open');
            });
        }, 500);
    }
}

/**
 * Associates the current checkout with a partner access
 * @param {string} checkoutUrl - The checkout url the will be broken down to get the checkoutId
 */
async function miniCartPartnerAssociate(checkoutUrl) {
    if (!checkoutUrl) return;
    var checkoutId = checkoutUrl.split("/").at(-1);
    if (checkoutId) await checkoutPartnerAssociate(checkoutId);
}

async function removeProductFromCart(id, qty, customizationId) {
    try {
        const input = getMiniCartAddOrSubtractInput(id, Number(qty), customizationId);        
        const checkoutDataBefore = checkout;
        const checkoutData = await client.checkout.remove(input, checkout.data.checkoutId);
        await loadMiniCart();
        
        let inputProducts = [];

        (checkoutDataBefore.data.products).forEach(function(checkoutProduct){
            if (checkoutProduct.productVariantId == id) {
                var checkoutProductInfo = checkoutProduct;
                
                checkoutProductInfo.quantity = qty;
                
                inputProducts.push(checkoutProductInfo);
            }
        });

        window.dispatchEvent(new CustomEvent("productRemovedFromCart", {
            detail: { 
                cart: checkoutData.data,
                products: inputProducts
            }
        }));
    } catch (error) {
        console.log(error);
        showOverlay('Ocorreu um erro!', 'Erro ao remover o produto do carrinho', true);
    }
}

async function updateCartQtyLabel(){
    const qtyInput = document.getElementById("cart-products-qty");
    const qtyLabel = document.getElementById("cart-qty-label");
    
    if (qtyInput && qtyLabel) {
        qtyLabel.innerHTML = qtyInput.value;
        const qty = parseInt(qtyInput.value);
    }
}

function getMiniCartAddOrSubtractInput(productVariantId, quantity, customizationId){
    const input = [
        {
            productVariantId: Number(productVariantId),
            quantity
        }
    ];

    if (customizationId){
        input[0].customizationId = customizationId;
    }

    return input;
}

async function miniCartAddQuantity(productVariantId, customizationId){
    const input = getMiniCartAddOrSubtractInput(productVariantId, 1, customizationId);
    await client.checkout.add(input);
    await loadMiniCart();
}

async function miniCartSubtractQuantity(productVariantId, customizationId){
    const input = getMiniCartAddOrSubtractInput(productVariantId, 1, customizationId);
    await client.checkout.remove(input);
    await loadMiniCart();
}

async function addUtmMetadata(checkoutId) {
    var metadataValues = []
    let utmSource = queryStringParams.get("utm_source");
    let utmMedium = queryStringParams.get("utm_medium");
    let utmCampaign = queryStringParams.get("utm_campaign");
    let utmTerm = queryStringParams.get("utm_term");
    let utmContent = queryStringParams.get("utm_content");

    if (utmSource) {
        metadataValues.push({key: "utmSource", value: utmSource})
    }
    if (utmMedium) {
        metadataValues.push({key: "utmMedium", value: utmMedium})
    }
    if (utmCampaign) {
        metadataValues.push({key: "utmCampaign", value: utmCampaign})
    }
    if (utmTerm) {
        metadataValues.push({key: "utmTerm", value: utmTerm})
    }
    if (utmContent) {
        metadataValues.push({key: "utmContent", value: utmContent})
    }

    if (metadataValues.length > 0) {
        await client.checkout.addCheckoutMetadata(metadataValues, checkoutId);
    }
}