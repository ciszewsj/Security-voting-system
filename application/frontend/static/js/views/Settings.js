import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Settings")
    }

    async getHtml() {
        return `
        <div class="post-box">
                            <div class="image-box">
                            </div>
                            <div class="info-box">
                                <div class="description-box">
                                    <p>Lorem ipsum dolor im amentaaaaaaaaaaaaaaa</p>
                                    <p>Author</p>
                                </div>
                                <div class="like-box">
                                    <button class="like-button liked">+</button>
                        
                                    <div class="like-number">
                                        <p>10000</p>
                                    </div>
                                </div>
                            </div>
                        </div>
        `;
    }

}