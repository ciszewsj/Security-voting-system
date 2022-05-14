import {checkIfLogin, setNavBar} from "./logic/SessionController.mjs";
import {getView, navigateTo, router} from "./logic/ReloadController.mjs";
import {getSession} from "./logic/StorageControler.mjs";
import {addServerInfo} from "./logic/ErrorController.mjs";


checkIfLogin();

if (getSession().token.length !== 0) {
    addServerInfo();
}

window.setInterval(checkIfLogin, 10000);

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", (e) => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            try {
                getView().removeLogic();
            } catch {

            }
            checkIfLogin();
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});