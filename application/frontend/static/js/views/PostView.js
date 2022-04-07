import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Viewing Post");
    }

    async getHtml() {
        // console.log(this.params.id)
        return `
        <h1>Posts</h1>
        <p>143</p>
        <p>JD3333</p>
        <p>JD3333</p>
        `;
    }



}