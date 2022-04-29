import {checkIfLogin} from "./logic/SessionController.mjs";
import {getView, navigateTo, router} from "./logic/reloadController.mjs";

checkIfLogin();
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