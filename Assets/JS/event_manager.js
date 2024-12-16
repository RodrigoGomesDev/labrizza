//#region SETUP

// Method initialization for firing data layer events
let dpush = [];
window.dataLayer = window.dataLayer || [];
dpush = function () { dataLayer.push(arguments); }

// User information (id and email if logged in)
let dataLayerUserData;

// Event dispatched in user_login.js
window.addEventListener("userChecked", configureDataLayerHandlers, false);

// Event dispatched in data_layer_config.html
window.addEventListener("dataLayerConfigured", triggerPageViewEvent, false);

// Event dispatched in buy_list.js
window.addEventListener("buyListPageViewed", buyListEvent, false);

// Events dispatched in mini_cart.js
window.addEventListener("cartViewed", viewCartEvent, false);
window.addEventListener("productRemovedFromCart", removeFromCartEvent, false);

// Events dispatched in product.js 
window.addEventListener("productAddedToCart", addToCartEvent, false);

// Event dispatched in wishlist.js
window.addEventListener("productAddedToWishlist", addToWishlistEvent, false);
window.addEventListener("productRemovedFromWishlist", removeFromWishlistEvent, false);

/**
 * Configures data layer handlers to set user ID after a delay 
 * or on specific events, for pagespeed purposes.
 * @param {Event} eventInput - The event containing user data.
 */
function configureDataLayerHandlers(eventInput) {
    dataLayerUserData = eventInput?.detail;
    setTimeout(() => setUserIdDataLayer(eventInput), 5000);

    const scrollListener = () => setUserIdDataLayer();
    const mousemoveListener = () => setUserIdDataLayer();
    const touchstartListener = () => setUserIdDataLayer();

    window.addEventListener('scroll', scrollListener);
    window.addEventListener('mousemove', mousemoveListener);
    window.addEventListener('touchstart', touchstartListener);

    function setUserIdDataLayer() {
        dataLayerSetup(dataLayerUserData?.email);

        window.removeEventListener('scroll', scrollListener);
        window.removeEventListener('mousemove', mousemoveListener);
        window.removeEventListener('touchstart', touchstartListener);
    }
}

//#endregion

//#region DATA LAYER TRIGGERING EVENTS

/**
 * This function is responsible for triggering view events on the site.
 * It analyzes the page type (hotsite, product page, etc.) and registers 
 * the corresponding event to be captured in the event_manager file.
 */
async function triggerPageViewEvent() {
    const productIdDiv = document.getElementById("product-id");
    const buylistIdDiv = document.getElementById("buy-list-id");
    const pageType = getDataLayerPageType()
    
    if (pageType != 'not-found') {
        // Trigger the appropriate event based on the page type
        if (productIdDiv) {
            const eventInput = {detail: { type: "product", productId: productIdDiv.value }};
            productPageEvent(eventInput);
        }
        else if (buylistIdDiv) {
            return;
        }
        else if (queryStringParams.has("busca")) {
            const eventInput = { detail: { term: queryStringParams.get("busca") }};
            searchPageEvent(eventInput);
        }
        else {
            const alias = window.location.pathname != "/" ? window.location.pathname.slice(1) : "home"
            const eventInput = { detail: { hotsite: alias }};
            hotsitePageEvent(eventInput);
        }
    }
}

async function viewCartEvent() {
    const data_layer_cart_details_element = document.getElementById('data_layer_cart_details');
    if(data_layer_cart_details_element) {
        const data_layer_cart_details = JSON.parse(data_layer_cart_details_element.value);
        const pageType = getDataLayerPageType()
        mapDataLayerUserAndUrlToModel(data_layer_cart_details, pageType);
        dpush("event", "view_cart", data_layer_cart_details);
    }
}

function addToCartEvent(eventInput) {
    const dataLayerCartObj = convertProductDataToDataLayerItems(eventInput.detail.products);
    mapDataLayerUserAndUrlToModel(dataLayerCartObj);
    dpush("event", "add_to_cart", dataLayerCartObj);
}

function removeFromCartEvent(eventInput) {
    const dataLayerCartObj = convertProductDataToDataLayerItems(eventInput.detail.products);
    mapDataLayerUserAndUrlToModel(dataLayerCartObj);
    dpush("event", "remove_from_cart", dataLayerCartObj);
}

function searchPageEvent(eventInput) {
    const pageType = getDataLayerPageType()
    mapDataLayerUserAndUrlToModel(data_layer_search_details, pageType);

    dpush("event", "search", { search_term: eventInput.detail.term });
    dpush("event", "view_item_list", data_layer_search_details);
}

function hotsitePageEvent(eventInput) {
    const pageType = getDataLayerPageType()
    
    if (typeof data_layer_hotsite_details != 'undefined') {
        mapDataLayerUserAndUrlToModel(data_layer_hotsite_details, pageType);

        dpush("event", "page_view", data_layer_hotsite_details);
        dpush("event", "view_item_list", data_layer_hotsite_details);
    }
}

function productPageEvent(eventInput) {
    const pageType = getDataLayerPageType()

    if (!eventInput.detail.adjusted)
        mapDataLayerUserAndUrlToModel(data_layer_product_details, pageType)

    if (eventInput.detail.type == "product")
        dpush("event", "view_item", data_layer_product_details);
}

function addToWishlistEvent(eventInput) {
    dpush("event", "add_to_wishlist", convertProductDataToDataLayerItems(eventInput.detail.products));
}

function removeFromWishlistEvent(eventInput) {
    dpush("event", "remove_from_wishlist", convertProductDataToDataLayerItems(eventInput.detail.products));
}

function buyListEvent(eventInput) {
    dpush("event", "view_item_list", convertBuyListDatatoDataLayerItems(eventInput.detail.products));
}

//#endregion

//#region AUX OBJECT CONVERSION FUNCTIONS

function convertBuyListDatatoDataLayerItems(buyListData) {
    const buyListProducts = [];
    for (productToAdd of buyListData){
        const productObj = {
            item_name: productToAdd.product_name || '',
            item_id: productToAdd.product_id.toString() || '',
            price: productToAdd.prices.price.toString() || '',
            item_brand: productToAdd.product_brand?.name || '',
            quantity: 1,
        }
        productToAdd.product_categories.forEach((category, index) => {
            const key = index > 0 ? `item_category${index + 1}` : 'item_category';
            productObj[key] = category.name;
        });
        buyListProducts.push(productObj);
    }
    return { items: buyListProducts };
}

function convertProductDataToDataLayerItems(productData) {
    const cartProducts = [];
    for (productToAdd of productData)
        cartProducts.push({
            item_id: productToAdd.productId ?? productToAdd.product_id ?? productToAdd.productVariantId ?? productToAdd.product_variant_id,
            item_name: productToAdd.product_name ?? productToAdd.name,
            discount: productToAdd.price == 0 ? 0 : productToAdd.listPrice - productToAdd.price,
            index: 0,
            price: productToAdd.price == 0 ? productToAdd.price : productToAdd.price,
            quantity: productToAdd.quantity
        });
    return { items: cartProducts };
}

function getCartData(checkoutData) {
    const cartProducts = [];
    for (productToAdd of checkoutData.products)
        cartProducts.push({
            item_id: productToAdd.productId,
            item_name: productToAdd.name,
            discount: productToAdd.price == 0 ? 0 : productToAdd.listPrice - productToAdd.price,
            index: 0,
            price: productToAdd.price == 0 ? productToAdd.price : productToAdd.price,
            quantity: 1
        });
    const formated = {
        item_list_name: "Cart List",
        currency: "BRL",
        price: checkoutData.total,
        items: cartProducts
    };
    return formated;
}

function structureEcommerceItems(products, cart) {
    if (!products || !Array.isArray(products)) return []

    return (
        products?.map(product => {
            const {
                productId,
                productName,
                productBrand,
                productCategories,
                prices,
                sku
            } = product ?? {}
            const cartItem = cart?.find(item => item?.productId === productId)
            const categories =
                productCategories?.reduce((acc, category, index) => {
                    acc[`item_category${index > 0 ? index + 1 : ''}`] = category?.name
                    return acc
                }, {}) ?? {}

            return {
                item_name: productName,
                item_id: productId,
                price: prices?.price ?? 0,
                item_brand: productBrand?.name,
                ...categories,
                quantity: cartItem?.quantity ?? 1,
                discount: (prices?.listPrice ?? 0) - (prices?.price ?? 0),
                item_variant: sku
            }
        }) ?? []
    )
}

function mapDataLayerUserAndUrlToModel(model, pageType) {
    model.user = { id: dataLayerUserData.userId };
    if (dataLayerUserData.email) model.user.email = dataLayerUserData.email;
    if (dataLayerUserData.name) model.user.name = dataLayerUserData.name;
    if (dataLayerUserData.phoneNumber) model.user.phoneNumber = dataLayerUserData.phoneNumber;

    model.session = {
        isLogged: !!dataLayerUserData.email,
        site: {
            siteDomain: document.location.origin,
        }
    };

    if (model.page && pageType)
        model.page.pageType = pageType;
    else
        model.page = model.page ?? {
            pageType: pageType,
            name: window.document.title
        }

    return model;
}

function getDataLayerPageType() {
    const inputElement = document.getElementById("data-layer-page-type");
    return inputElement?.value ?? "HOTSITE";
}

//#endregion