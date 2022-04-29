import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/CookieControler.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Oczekujące na akceptację")
    }


    async getHtml() {
        return `
        <h1>Oczekujące na akceptację</h1>
        <div class="obrazki" id="image-grid">
        
        </div>
        `;
    }

    async addLogic() {
        let token = getSession().token;
        let imagesInfo = await (await fetch('/api/getImageToAcceptList', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `${token}`
            }
        })).json();
        console.log(imagesInfo);
        if (imagesInfo.status === "SUCCESS") {
            document.getElementById("image-grid").innerHTML = "";
            for (let i in imagesInfo.body) {
                document.getElementById("image-grid").innerHTML += `
                        
                        <div class="post-box" id="post-box-${imagesInfo.body[i].ImageId}">
                                    <div class="image-box" id="image-box-${imagesInfo.body[i].ImageId}">
                                    
                                                <img id="image-${imagesInfo.body[i].ImageId}" alt="${imagesInfo.body[i].Title}"> 
                                            </div>
                                            <div class="info-box">
                                                <div class="description-box">
                                                    <p>${imagesInfo.body[i].Title}</p>
                                                    <p>${imagesInfo.body[i].Author}</p>
                                                </div>
                                                <div class="accept-box">
                                                    <button id=accept-button-${imagesInfo.body[i].ImageId}" class="like-button">Accept</button>
                                                </div>
                                            </div>
                                        </div>
                        `;
            }
        }
    }
}