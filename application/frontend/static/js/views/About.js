import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("O stronie")
    }

    async getHtml() {
        return `
        <h1>O stronie</h1>
        `;
    }

}