/**
 * Setups setting the selected page based on the query string
 */
function paginationSetup() {
    let paginationQueryStringValue = queryStringParams.get("pagina");
    if (!paginationQueryStringValue)
        paginationQueryStringValue = 1;

    const element = document.getElementById(`pagination_${paginationQueryStringValue}`);
    const button = document.getElementById("show-more-button");

    if (element)
        element.className += " bg-gray-700 text-white";

    if (button)
        button.addEventListener("click", showMore);
    else if (document.getElementById("infinity-scroll-content-div")) {
        // If the button does not exist, it means offset pagination is being used and this div element is useless
        const infinityScrollDiv = document.getElementById("infinity-scroll-content-div");
        infinityScrollDiv.remove();
    }
}

/**
 * Selects a page from the currently available
 * @param {string} page - Selected page from the list
 */
function selectPage(page) {
    const pageSize = document.getElementById("def_page_size").value;

    queryStringParams.set("pagina", page);
    queryStringParams.set("tamanho", pageSize);

    window.location.search = queryStringParams.toString();
}

/**
 * Searches for sort key, sort direction, page size, and filters information, and renders new products on the page.
*/
async function showMore() {
    let divButton = document.getElementById("div-button-show-more");
    const endCursor = divButton.getAttribute("data-end-cursor");
    divButton.remove();
    
    let isSearch = false;
    const sort = queryStringParams.get("ordenacao");
    let pageSize = queryStringParams.get("tamanho");

    let sortKey = null;
    let sortDirection = null;

    if (sort){
        sortKey = sort.split(':')[0];
        sortDirection = sort.split(':')[1];
    }

    if (pageSize){
        pageSize = parseInt(pageSize, 10);
    }
    else{
        const defPageSize = document.getElementById("def_page_size")?.value;
        if (defPageSize && pageSize != "") pageSize = Number(defPageSize);
    }

    const { minPrice, maxPrice } = getPriceFilter();
    const url = window.location.pathname.slice(1);
    if (queryStringParams.has("busca")) isSearch = true;

    let obj = {
        partnerAccessToken: getCookie("sf_partner_access_token"),
        filters: getFilters(),
        minimumPrice: parseFloat(minPrice),
        maximumPrice: parseFloat(maxPrice),
    };

    if (pageSize && pageSize > 0) { obj['resultSize'] = pageSize; }
    if (sortKey) { obj['sortKey'] = sortKey; }
    if (sortDirection) { obj['sortDirection'] = sortDirection; }
    if (endCursor) { obj['after'] = endCursor; }

    let result;
    if (isSearch) {
        const term = queryStringParams.get("busca");
        obj['searchQuery'] = term;
        result = await client.snippet.render("cursor_pagination.html", "search_with_cursor.graphql", obj);
    } else {
        obj['url'] = url;
        result = await client.snippet.render("cursor_pagination.html", "hotsite_with_cursor.graphql", obj);
    }

    document.getElementById("infinity-scroll-content-div").innerHTML += result;
        
    const newButton = document.getElementById("show-more-button");
    if (newButton){
        newButton.addEventListener("click", showMore);
    }
        
    if (document.getElementById("show-more-button") && document.getElementById("show-more-button").classList.contains('button-infinite-scroll')) {
        observeButton("div-button-show-more");
    }
}
    
let observer; // Variável para armazenar a instância do IntersectionObserver

function handleIntersection(entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Quando o elemento se tornar visível, chame a função showMore
      showMore();
      // Pare de observar o elemento após chamar a função, se desejar
      observer.unobserve(entry.target);
    }
  });
}

function observeButton(buttonId) {
  const buttonToObserve = document.getElementById(buttonId);
  if (buttonToObserve) {
    // Se já houver uma instância de IntersectionObserver, desconecte-a
    if (observer) {
      observer.disconnect();
    }

    // Crie uma nova instância do IntersectionObserver
    observer = new IntersectionObserver(handleIntersection);

    // Comece a observar o elemento
    observer.observe(buttonToObserve);
  }
}
    
setTimeout(function(){
    window.addEventListener("load", paginationSetup, false);
    
    if (document.getElementById("show-more-button") && document.getElementById("show-more-button").classList.contains('button-infinite-scroll')) {
        // Chame observeButton com o ID do botão sempre que desejar observá-lo novamente
        observeButton("div-button-show-more");
    }
}, 500);