import AbstractView from "./AbstractView.js";
import {removeSession} from "../logic/CookieControler.mjs";
import {navigateTo} from "../logic/reloadController.mjs";
import {checkIfLogin} from "../logic/SessionController.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Logout")
    }


    async getHtml() {
        return ``;
    };

    async addLogic() {
        removeSession();
        navigateTo("/");
        checkIfLogin();
    };
}