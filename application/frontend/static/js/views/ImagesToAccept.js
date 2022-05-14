import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/StorageControler.mjs";
import {navigateTo} from "../logic/ReloadController.mjs";
import {addError} from "../logic/ErrorController.mjs";

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
        let imagesInfo = await (await fetch('/api/getImagesToAcceptList', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `${token}`
            }
        }).catch(e => {
            addError(e);
            return undefined;
        })).json();
        if (imagesInfo.status === "SUCCESS") {
            document.getElementById("image-grid").innerHTML = "";
            for (let i in imagesInfo.body) {
                let newImage = document.createElement("a");
                newImage.className = "post-box";
                newImage.id = `post-box-${imagesInfo.body[i].ImageId}`;
                newImage.innerHTML = `
                        <div class="image-box" id="image-box-${imagesInfo.body[i].ImageId}">
                        
                                    <img id="image-${imagesInfo.body[i].ImageId}" alt="${imagesInfo.body[i].Title}"> 
                                </div>
                                <div class="info-box">
                                    <div class="description-box">
                                        <p>${imagesInfo.body[i].Title}</p>
                                        <p>${imagesInfo.body[i].Author}</p>
                                    </div>
                                </div>
                        `;
                document.getElementById("image-grid").appendChild(newImage);
                document.getElementById(`post-box-${imagesInfo.body[i].ImageId}`)
                    .addEventListener("click", (e) => {
                        navigateTo(`/imageToAccept/${imagesInfo.body[i].ImageId}`);
                    });
                this.getImage(imagesInfo.body[i].ImageId);

            }
        } else if (imagesInfo === undefined) {
            addError(imagesInfo.body.msg);
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
                addError(response.body.msg);
            }
        } catch (e) {
            addError(e);
        }
    }
}