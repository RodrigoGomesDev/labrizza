/**
 * Global variable to simplify the manipulation of query string parameters
*/
const queryStringParams = new URLSearchParams(window.location.search);

/**
 * Replaces the content of a given element with the passed html parameter.
 * @param {string} html - The content that will replace the element's inner html
 * @param {Element} div - The div element to replace content
*/
function setInnerHtml(html, div) {
	if (div == null || html === undefined) return;
	div.innerHTML = html;
}

/**
 * Replaces the content of a given element with the passed html parameter.
 * @param {string} html - The content that will replace the element's inner html
 * @param {string} id - The id used to search for the element in the document
*/
function setInnerHtmlById(html, id) {
	if (id == null) return;
	const div = document.getElementById(id);
	setInnerHtml(html, div);
}

/**
 * Overlay alert
*/
const showOverlay = (title, message, error) => {
	const overlay = document.querySelector("#overlay-box");
	const titleOverlay = document.querySelector("#message-title-overlay");
	const messageOverlay = document.querySelector("#message-content-overlay");

	//Entering  
	overlay.classList.remove('hidden')
	overlay.classList.add('flex')
	overlay.classList.add('ease-out')
	overlay.classList.add('duration-300')
	overlay.classList.add('translate-y-0')
	overlay.classList.add('opacity-100')
	overlay.classList.add('sm:translate-x-0')
	overlay.classList.remove('translate-y-2')
	overlay.classList.remove('opacity-0')
	overlay.classList.remove('sm:translate-x-2"')

	if (error) document.querySelector("#overlay-error").classList.remove('hidden');
	else document.querySelector("#overlay-success").classList.remove('hidden');

	setInnerHtml(title, titleOverlay);
	setInnerHtml(message, messageOverlay);

	setTimeout(() => {
		hideOverlay()
	}, 5000)
}

const hideOverlay = () => {
	const overlay = document.querySelector("#overlay-box");
	//Leaving
	overlay.classList.add('ease-in')
	overlay.classList.add('duration-100')
	overlay.classList.add('opacity-0')
	overlay.classList.remove('ease-out')
	overlay.classList.remove('duration-300')
	overlay.classList.remove('opacity-100')
	overlay.classList.remove('flex')
	overlay.classList.add('hidden')
	document.querySelector("#overlay-error").classList.add('hidden')
	document.querySelector("#overlay-success").classList.add('hidden')
}

