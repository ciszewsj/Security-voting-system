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
            setLoggedBar();
        } else if (json.body.status === false) {
            removeSession();
            setNormalBar();
        } else {
            console.error("navbarError???");
            removeSession();
            setNormalBar();
        }
    })
        .catch(e => {
            console.log(e);
        })

}


let setLoggedBar = () => {
        let nav = document.getElementById("nav");
        nav.innerHTML = `<a href="/" class="nav__link" data-link>Dashboard</a>
                        <a href="/myimage" class="nav__link" data-link>MyImage</a>
                        <a href="/posts/34" class="nav__link" data-link>Posts</a>
                        <a href="/settings" class="nav__link" data-link>About</a>
                        <a href="/login" class="nav__link" data-link>LOGOUT</a>`
    }
;
let setNormalBar = () => {
        let nav = document.getElementById("nav");
        nav.innerHTML = ""
        nav.innerHTML = `<a href="/" class="nav__link" data-link>Dashboard</a>
                    <a href="/settings" class="nav__link" data-link>About</a>
                    <a href="/login" class="nav__link" data-link>Login</a>
                    <a href="/register" class="nav__link" data-link>Register</a>`
    }
;