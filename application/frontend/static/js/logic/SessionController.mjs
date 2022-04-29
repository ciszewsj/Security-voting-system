import {getSession, removeSession} from "./CookieControler.mjs";

export let checkIfLogin = async () => {
    let token;
    try {
        token = getSession().token;
        if (token !== undefined) {
            await checkIfLoggedIn(token)
        }
    } catch (e) {
        removeSession();
    }
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
        } else if (json.body.status === false) {
            removeSession();
        } else {
            console.error("navbarError???");
            removeSession();
        }
        setNavBar();
    })
        .catch(e => {
            console.log(e);
        })

}


let setNavBar = () => {
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
                <a href="/imageToAccept" class="nav__link" data-link>Niezaakceptowane</a>
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