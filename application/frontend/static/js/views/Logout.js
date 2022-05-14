import AbstractView from "./AbstractView.js";
import {navigateTo} from "../logic/ReloadController.mjs";
import {checkIfLogin, logout} from "../logic/SessionController.mjs";
import {clearErrors} from "../logic/ErrorController.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Logout")
    }


    async getHtml() {
        return ``;
    };

    async addLogic() {
        logout();
        navigateTo("/");
        checkIfLogin();
        clearErrors();
    };
}