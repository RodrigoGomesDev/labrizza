/**
 * Fetches and renders shipping quotes when the form is submitted.
 * @param {Event} e - The event.
 * @param {string} productVariantId - The product variant ID to be quoted.
*/
async function shippingQuoteSubmit(e, productVariantId) {    
    e.preventDefault();

    const cep = document.getElementById('shipping-quote-cep').value;

    let input = {
        cep,
        productVariantId: Number(productVariantId)
    }

    await fetchAndRenderShippingQuote(input);
}

/**
 * Fetches and renders shipping quotes for multi variants when the form is submitted.
 * @param {Event} e - The event.
 * @param {object} multiVariantsInput - The multi variants input array to be quoted, containing productVariantId and quantity.
*/
async function multiVariantsShippingQuoteSubmit(e, multiVariantsInput) {    
    e.preventDefault();

    if (multiVariantsInput.length == 0){
        showOverlay('Selecione ao menos uma variação para cotar frete!', '', true);
        return;
    }

    const cep = document.getElementById('shipping-quote-cep').value;

    let input = {
        cep,
        products: []
    }

    multiVariantsInput.forEach(element => {
        input.products.push({
            productVariantId: element.productVariantId,
            quantity: element.quantity
        })
    });

    await fetchAndRenderShippingQuote(input);
}

/**
 * Applies a mask to the CEP field.
 * @param {string} t - CEP input value.
*/
function cepMask(t){
    const mask = "#####-###"
    let i = t.value.length;
    let out = mask.substring(1,0);
    let text = mask.substring(i)
    
    if (text.substring(0,1) != out)
       t.value += text.substring(0,1);
}

/**
 * Fetches and renders shipping quotes.
 * @param {object} input - The query input variables.
*/
async function fetchAndRenderShippingQuote(input) {    
    try {    
        let snippetResponse = await client.snippet.render("product_shipping_quotes_snippet.html", 
                              "SnippetQueries/shipping_quotes.graphql", input);

        snippetResponse ??= '<span style="font-size:15px">CEP inválido!</span>';
        setInnerHtmlById(snippetResponse, "shipping-quotes-snippet-div");
    }
    catch(error) {
        console.log(error);
    }
}