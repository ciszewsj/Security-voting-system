import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("O stronie")
    }

    async getHtml() {
        return `
        <h1>O stronie</h1>
        <p>Strona stworzona została w ramach projektu indywidualnego realizowanego w czasie trwania semestru letniego 2021/2022 na Politechnice Warszawskiej, wydziale Elektrycznym, kierunku Informatyka Stosowana.</p>
        <p>311192 Ciszewski Jakub</p>
        `;
    }

}