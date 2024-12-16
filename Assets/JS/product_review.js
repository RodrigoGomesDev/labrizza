window.addEventListener("userChecked", enableReviewButton, true);

/**
 * Sends a product review form.
*/
async function reviewSubmit(event){
    event.preventDefault();
    const ratingElement = document.getElementById('review-form-rating');
    const textElement = document.getElementById('review-form-text');
    const productVariantIdElement = document.getElementById('product-variant-id');

    const input = {
        review: textElement.value,
        rating: Number(ratingElement.value),
        email: pageUser.email,
        name: pageUser.name,
        productVariantId: Number(productVariantIdElement.value)
    };

    await client.product.createReview(input);    
    showOverlay('Review enviado com sucesso!', '');
}

/**
 * Checks if there is a user logged in the page.
*/
function verifyPageUser(){
    if (pageUser != null){
        document.getElementById("review-form-div").style.display = "";
        document.getElementById("review-login-div").style.display = "none";
    }
    else{
        const loginElement = document.getElementById("review-login-action-div");
        loginElement.href += window.location.href;
    }
}

/**
 * Enable review button.
*/
function enableReviewButton(){
    if(pageUser){
        document.getElementById("login-review").classList.add('hidden');
        document.getElementById("review-form").classList.remove('hidden');    
    }
}
