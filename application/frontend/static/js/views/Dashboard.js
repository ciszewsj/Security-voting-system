import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/CookieControler.mjs";
import {navigateTo} from "../logic/reloadController.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Obrazki")
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
            if (imagesInfo.status === "SUCCESS") {
                document.getElementById("image-grid").innerHTML = "";
                for (let i in imagesInfo.body) {
                    let div = document.createElement("a");
                    div.className = "post-box";
                    div.id = `post-box-${imagesInfo.body[i].ImageId}`;
                    let liked = "";
                    if (imagesInfo.body[i].Liked === `true`){
                        liked = "liked";
                    }
                    div.innerHTML = `
                                <div class="image-box" id="image-box-${imagesInfo.body[i].ImageId}">
                                        <img id="image-${imagesInfo.body[i].ImageId}" alt="${imagesInfo.body[i].Title}"> 
                                        </div>
                                        <div class="info-box">
                                            <div class="description-box">
                                                <p>${imagesInfo.body[i].Title}</p>
                                                <p>${imagesInfo.body[i].Author}</p>
                                            </div>
                                            <div class="like-box">
                                                <div id="like-button-${imagesInfo.body[i].ImageId}" class="like-button ${liked}">+</div>
                                    
                                                <div class="like-number">
                                                    <p>${imagesInfo.body[i].Likes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                    document.getElementById("image-grid").appendChild(div);
                    document.getElementById(`post-box-${imagesInfo.body[i].ImageId}`)
                        .addEventListener("click", (e) => {
                            navigateTo(`/posts/${imagesInfo.body[i].ImageId}`);
                        });
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
            if (response.status === 200) {
                let blob = await response.blob();
                img.src = URL.createObjectURL(blob);
            } else {
                console.log("error loading image");
            }
        } catch (e) {
            console.log(e);
        }
    }
}