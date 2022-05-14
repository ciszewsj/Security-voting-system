import {getSession, removeSession} from "./StorageControler.mjs";
import {addError, addInfo} from "./ErrorController.mjs";

export let checkIfLogin = async () => {
    let token;
    try {
        token = getSession().token;
        if (token !== undefined) {
            await checkIfLoggedIn(token)
        }
    } catch (e) {
        removeSession();
        checkIfLogin();
    }
}

let logged = false;

export let logout = () => {
    removeSession();
    logged = false;
}

let checkIfLoggedIn = async (token) => {
    await fetch("/api/checkStatus", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': `${token}`
        }
    }).then(
        (response) => {
            return response.json();

        }
    ).then((json) => {
        if (json.body.status === true) {
            logged = true;
        } else {
            if (logged === true) {
                addInfo("Sesja wygasła");
            }
            logged = false;
            removeSession();
        }
        setNavBar();
    })
        .catch(e => {
            addError(e);
        })

}


export let setNavBar = () => {
    let nav = document.getElementById("nav");
    nav.innerHTML = `<a href="/" class="nav__link" data-link>Obrazki</a>
                    <div id="my-image-elem"></div>
                    <div id="accept-image-elem"></div>
                    <a href="/settings" class="nav__link" data-link>O stronie</a>
                    <div id="login-elem"></div>
                    <div id="register-elem"></div>
                        `
    if (getSession().token.length > 1) {
        document.getElementById("my-image-elem").innerHTML = `
           <a href="/myimage" class="nav__link" data-link>Mój obrazek</a>
        `;
        document.getElementById("login-elem").innerHTML = `
            <a href="/logout" class="nav__link" data-link>Wyloguj</a>
        `;
        if (getSession().role === "Admin") {
            document.getElementById("accept-image-elem").innerHTML = `
                <a href="/imagesToAccept" class="nav__link" data-link>Niezaakceptowane</a>
            `;
        }
    } else {
        document.getElementById("login-elem").innerHTML = `
            <a href="/login" class="nav__link" data-link>Loguj</a>
            `;
        document.getElementById("register-elem").innerHTML = `
            <a href="/register" class="nav__link" data-link>Utwórz konto</a>
            `;
    }
};