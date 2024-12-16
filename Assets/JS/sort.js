window.addEventListener("load", sortSetCurrent, false);

/**
 * Internally identifies the current sort type based on the URL.
*/
function sortSetCurrent() {
	const sortQueryStringValue = queryStringParams.get("ordenacao")
	if (sortQueryStringValue) {
        var sort_items = document.getElementsByClassName('sort-options');
        
        for (let i = 0; i < sort_items.length; i++) {
            sort_items[i].value = sortQueryStringValue;
        }
	}
}

/**
 * Applies the page sorting when changed.
 * @param {string} sortSetting - Sort type.
*/
function sortResult(sortSetting) {
	queryStringParams.set("ordenacao", sortSetting);
	window.location.search = queryStringParams.toString();
}