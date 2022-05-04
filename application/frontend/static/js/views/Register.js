import AbstractView from "./AbstractView.js";
import {addSession, getSession} from "../logic/CookieControler.mjs";
import {navigateTo} from "../logic/reloadController.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Utwórz konto")
    }

    async getHtml() {
        return `
        <h1>Register</h1>
        <div id="general_r_errors">
        </div></br>
        <form id="register-form">
            <label for="name">Name:</label><br>
            <input type="text" id="name-register" name="name" autocomplete="on"><br>
            <div id="name_r_error"></div></br>
            <label for="email">Email:</label><br>
            <input type="text" id="email-register" name="email" autocomplete="on"><br>
            <div id="email_r_error"></div></br>
            <label for="password">Password:</label><br>
            <input type="password" id="password-register" name="password" autocomplete="on"><br>
            <div id="password_r_error"></div></br>
        </form>
        <button id="login-button"> Utwórz konto </button>
        `;
    }

    async addLogic() {
        let token = getSession().token;
        if (token.length !== 0) {
            navigateTo('/');
            return;
        }
        document.addEventListener("keydown", registerByEnter);

        let button = document.getElementById(`login-button`);
        button.addEventListener("click", registerUser);
    };

    async removeLogic() {
        document.removeEventListener("keydown", registerByEnter);
        let button = document.getElementById(`login-button`);
        button.removeEventListener("click", registerUser);
    }
}

let registerByEnter = async (e) => {
    e = e || window.event;
    switch (e.which || e.keyCode) {
        case 13 :
            await registerUser();
            break;
    }
};

let registerUser = async () => {
        try {
            let err_email = document.getElementById("email_r_error")
            let err_passwd = document.getElementById("password_r_error")
            let err_name = document.getElementById("name_r_error")
            let err_general = document.getElementById("general_r_errors")

            let name = document.getElementById(`name-register`).value;
            let email = document.getElementById(`email-register`).value;
            let pass = document.getElementById(`password-register`).value;
            fetch("/api/register",
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "POST",
                    body: JSON.stringify({Name: name, Email: email, Password: pass})
                }).then(
                response => {
                    return response.json();
                }).then(response => {
                    console.log(response)
                    if (response.status === "SUCCESS") {
                        navigateTo("/login")
                        return;
                    } else if (response.status === "FAILURE") {
                        console.log(123)
                        err_name.innerHTML = "";
                        err_email.innerHTML = "";
                        err_passwd.innerHTML = "";
                        err_general.innerHTML = "";
                        for (let i in response.body.errors) {
                            let err = response.body.errors[i];
                            console.log(err)
                            console.log(err.param)
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
                                case  'Name':
                                    err_name.innerHTML = `<label>${err.msg}</label>`
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

