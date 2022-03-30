import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard")
    }

    async getHtml() {
        return `
        <h1>Welcome Back</h1>
        <p>14</p>
        <p>JD</p>
        `;
    }

}