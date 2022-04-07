import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/CookieControler.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings")
    };

    async getHtml() {
        return `
        <h1>MyImage</h1>
        <div class="myImage"></div>
        `;
    };

    async addLogic() {
        if (getSession().token.length < 1) {
            window.location.href = '/login';
            return;
        }

        return super.addLogic();
    };

    async removeLogic() {
        return super.removeLogic();
    };
}