import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/StorageControler.mjs";
import {navigateTo} from "../logic/ReloadController.mjs";
import {addError} from "../logic/ErrorController.mjs";
import {getImage} from "../logic/CommonAsks.mjs";

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
                imagesInfo.body = imagesInfo.body.sort((a, b) => {
                    if (a.Likes >= b.Likes) {
                        return -1;
                    }
                    return 1;
                });
                let imageGrid = document.getElementById("image-grid")
                imageGrid.innerHTML = "";
                if (imagesInfo.body.length === 0) {
                    imageGrid.innerText = "Brak zawartości do wyświetlenia";
                    return;
                }
                for (let i in imagesInfo.body) {
                    let div = document.createElement("a");
                    div.className = "post-box";
                    div.id = `post-box-${imagesInfo.body[i].ImageId}`;
                    let liked = "";
                    if (imagesInfo.body[i].Liked === `true`) {
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
                                                <div id="like-button-${imagesInfo.body[i].ImageId}" class="like-element ${liked}">+</div>
                                    
                                                <div class="like-number">
                                                    <p>${imagesInfo.body[i].Likes}</p>
                                                </div>
                                            </div>
                                        </div>
                                    `;
                    imageGrid.appendChild(div);
                    document.getElementById(`post-box-${imagesInfo.body[i].ImageId}`)
                        .addEventListener("click", (e) => {
                            navigateTo(`/posts/${imagesInfo.body[i].ImageId}`);
                        });
                    getImage(`image-${imagesInfo.body[i].ImageId}`, imagesInfo.body[i].ImageId);
                }

            } else {
                addError(imagesInfo.body.msg);
            }
        } catch (e) {
            addError(e);
        }

    }


}