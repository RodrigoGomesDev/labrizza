window.addEventListener("load", checkUserLogin, false);
let pageUser = null;

/**
 * Checks if the user is logged to change the site's login settings.
*/
async function checkUserLogin() {
    try {
        const user = await client.user.get();

        const login = document.querySelectorAll("[id='login']");
        const userName = document.querySelectorAll("[id='user-name']");
        const userHref = document.querySelectorAll("[id='user-href']");
        const loggedUser = document.querySelectorAll("[id='logged-user']");
        const userLogout = document.querySelectorAll("[id='user-logout']");
        const userAction = document.querySelectorAll("[id='user-action']");

        if (user != null) {
            pageUser = user;
            const name = parseUserName(user.name);
            const logoutUrl = client.user.logoutUrl();

            login.forEach(x => {
                x.classList.add('hidden');
            });

            loggedUser.forEach(x => {
                x.classList.remove('hidden');
                x.classList.add('flex');
            });

            userLogout.forEach(x => {
                x.href = logoutUrl + "?returnUrl=" + window.location.href;
            });

            userName.forEach(x => {
                x.innerHTML = `${name}`
            });

            userAction.forEach(x => {
                x.innerHTML = "Logout";
            });
        }
        else {
            login.forEach(x => {
                x.classList.remove('hidden');
            });

            loggedUser.forEach(x => {
                x.classList.add('hidden');
                x.classList.remove('flex');
            });

            userHref.forEach(x => {
                x.href += window.location.href;
            });
        }

        await handleDataLayerEvent(user);

    } catch (error) {
        console.log(error);
    }
}

function redirectToLogin() {
    const loginUrl = document.getElementById('login-url')?.value;
    if (!loginUrl) return;

    window.location = loginUrl + window.location.href;
}

/**
 * Returns the first name of the user.
 * @param {string} fullname - User full name.
*/
function parseUserName(fullname) {
    if (fullname) {
        const names = fullname.split(" ");
        return names[0];
    } else {
        return '';
    }
}

/**
 * Show user options on mouse enter.
*/
function userMouseEnter() {
    document.getElementById("user-options").style.display = "flex";
}

/**
 * Hides user options on mouse leave.
*/
function userMouseLeave() {
    document.getElementById("user-options").style.display = "none";
}

async function handleDataLayerEvent(user) {
    let userId = '';
    if (user) {
        const customerDetailsQuery =
            `query GetTokenDetails { 
          customerAccessTokenDetails(customerAccessToken:"${user.customerAccessToken}") 
          {
            customerId
          }
      }`;
        const customerDetailsResult = await client.query(customerDetailsQuery);
        userId = "CLIENT-" + customerDetailsResult.customerAccessTokenDetails.customerId;
    } else {
        const cookieName = 'data-layer-visitor-id';
        let visitorId = getCookie(cookieName);
        if (visitorId)
            userId = visitorId;
        else {
            userId = "VISIT-" + visitorUuid;
            setCookie(cookieName, userId, 168);
        }
    }

    window.dispatchEvent(new CustomEvent("userChecked", {
        detail: {
            email: user?.email,
            name: user?.name,
            phoneNumber: user?.phoneNumber
            userId
        }
    }));
}

/**
 * Returns a given cookie's value
 * @param {string} name - The cookie key
 */
function getCookie(name) {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(';').shift()
}