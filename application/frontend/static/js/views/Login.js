import AbstractView from "./AbstractView.js";
import {addSession, getSession} from "../logic/CookieControler.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Posts")
    }

    async getHtml() {
        return `
        <h1>Login</h1>
        <div id="general_errors">
        </div></br>
        <form id="login-form">
            <label for="email">Email:</label><br>
            <input type="text" id="email-login" name="email" autocomplete="on"><br>
            <div id="email_error"></div></br>
            <label for="password">Password:</label><br>
            <input type="password" id="password-login" name="password" autocomplete="on"><br>
            <div id="password_error"></div></br>
        </form>
        <button id="login-button"> Zaloguj </button>
        `;
    }

    async addLogic() {
        let token = getSession().token;
        if (token.length !== 0) {
            window.location.href = '/';
            return;
        }
        document.addEventListener("keydown", loginByEnter);

        let button = document.getElementById(`login-button`);
        button.addEventListener("click", login);
    };

    async removeLogic() {
        document.removeEventListener("keydown", loginByEnter);
        let button = document.getElementById(`login-button`);
        button.removeEventListener("click", login);
    }
}

let loginByEnter = async (e) => {
    e = e || window.event;
    switch (e.which || e.keyCode) {
        case 13 :
            await login();
            break;
    }
};

let login = async () => {
        try {
            let err_email = document.getElementById("email_error")
            let err_passwd = document.getElementById("password_error")
            let err_general = document.getElementById("general_errors")


            let email = document.getElementById(`email-login`).value;
            let pass = document.getElementById(`password-login`).value;
            fetch("/api/login",
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({Email: email, Password: pass})
                }).then(
                response => {
                    return response.json();
                }).then(response => {
                    if (response.status === "SUCCESS") {
                        addSession(response.body.token, response.body.name, response.body.role);
                        window.location.href = '/';
                        return;
                    } else if (response.status === "FAILURE" || response.status === "UNAUTHORIZED") {
                        err_email.innerHTML = "";
                        err_passwd.innerHTML = "";
                        err_general.innerHTML = "";
                        for (let i in response.body.errors) {
                            let err = response.body.errors[i];
                            console.log(err)
                            switch (err.param) {
                                case  'General':
                                    err_general.innerHTML = `<label>${err.msg}</label>`
                                    break;
                                case 'Email':
                                    err_email.innerHTML = `<label>${err.msg}</label>`
                                    break;
                                case  'Password':
                                    err_passwd.innerHTML = `<label>${err.msg}</label>`
                                    break;

                            }
                        }
                        return;
                    }
                }
            )
        } catch
            (e) {
            console.error(e);
        }
    }
;
