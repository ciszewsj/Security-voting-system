import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/CookieControler.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Dashboard")
    }


    async getHtml() {
        return `
        <h1>Obrazki</h1>
        <div class="obrazki" id="image-grid">
        
        </div>
        `;
    }

    async addLogic() {
        let token = getSession().token;
        try {
            let imagesInfo = await (await fetch('/api/getImagesInfo', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                }
            })).json();
            console.log(imagesInfo)
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
                                                <div class="like-box">
                                                    <button id="like-button-${imagesInfo.body[i].ImageId}" class="like-button">+</button>
                                        
                                                    <div class="like-number">
                                                        <p>${imagesInfo.body[i].Likes}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                        `;
                    let like = document.getElementById(`like-button-${imagesInfo.body[i].ImageId}`);
                    like.addEventListener("click", () => {
                        console.log("like");
                    })
                    this.getImage(imagesInfo.body[i].ImageId);
                }

            }
        } catch (e) {
            console.log(e);
        }

    }

    async getImage(imageId) {
        try {
            let img = document.getElementById(`image-${imageId}`);
            let response = await fetch(`/api/getImage/${imageId}`);
            console.log(img)
            if (response.status === 200) {
                img.src = URL.createObjectURL(await response.blob());
            } else {
                console.log("error loading image");
            }
        } catch (e) {
            console.log(e);
        }
    }
}