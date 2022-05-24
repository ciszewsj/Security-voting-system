import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/StorageControler.mjs";
import {addError} from "../logic/ErrorController.mjs";
import {navigateTo} from "../logic/ReloadController.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Obrazek");
    }

    async getHtml() {
        return `
        <h1 id="image-title"></h1>
        <div class="image-box-info">
        <div class="image-full-screen">   
            <img id="image-image" />
        </div>
        
            <div class="info-grid">
                <div>
                    <p>Autor: </p>
                    <p id="image-author"></p>
                </div>
                <div>
                    <button id="like-button" class="like-button">+</button>
                    <p class="p">Polubienia:</p>
                    <p id="image-likes" class="p"></p>
                </div>
            </div>  
            <p>Opis: </p>
            <p id="image-description" class="description"></p>
        </div>
        `;
    }

    async addLogic() {
        let href = window.location.href.split("/");
        href = href[href.length - 1];
        let token = getSession().token;
        let imageTitle = document.getElementById("image-title");
        let imageAuthor = document.getElementById("image-author");
        let imageDescription = document.getElementById("image-description");
        let imageImage = document.getElementById("image-image");
        let imageLikes = document.getElementById("image-likes");
        let imageButtonLike = document.getElementById("like-button");


        fetch(`/api/getImagesInfo`,
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                }
            }).then(response => {
            return response.json();
        }).then(response => {
                let imageInfo = response.body.find((post, index) => {
                    if (`${post.ImageId}` === `${href}`)
                        return true;
                });
                if (imageInfo === undefined) {
                    addError("Zdjęcie nie zostało znalezione");
                    navigateTo("/");
                    return;
                }
                this.setTitle(imageInfo.Title);
                imageTitle.innerText = imageInfo.Title;
                imageAuthor.innerText = imageInfo.Author;
                imageDescription.innerText = imageInfo.Description;
                imageLikes.innerText = imageInfo.Likes;
                let liked = imageInfo.Liked;
                if (liked === "true") {
                    imageButtonLike.className = "like-button liked";
                }
                imageButtonLike.addEventListener("click", () => {
                    if (liked === "true") {
                        fetch(`/api/unlikeImage/${imageInfo.ImageId}`,
                            {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'authorization': `${token}`
                                }
                            })
                            .then(response => {
                                return response.json();
                            }).then(response => {
                            if (response.status === "SUCCESS") {
                                imageButtonLike.className = "like-button";
                                imageLikes.innerText = String(parseInt(imageLikes.innerText) - 1);
                                liked = `false`;
                            } else {
                                addError(response.body.msg);
                            }
                        }).catch(e => {
                            addError(e);
                        });
                    } else {
                        fetch(`/api/likeImage/${imageInfo.ImageId}`,
                            {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'authorization': `${token}`
                                }
                            })
                            .then(response => {
                                return response.json();
                            }).then(response => {
                            if (response.status === "SUCCESS") {
                                imageButtonLike.className = "like-button liked";
                                imageLikes.innerText = String(parseInt(imageLikes.innerText) + 1);
                                liked = `true`;
                            } else {
                                console.log(response)
                                addError(response.body.msg);
                            }
                        }).catch(e => {
                            addError(e);
                        });
                    }
                });


                fetch(`/api/getImage/${imageInfo.ImageId}`)
                    .then(img => {
                        if (img.status === 200) {
                            img.blob().then(blob => {
                                imageImage.src = URL.createObjectURL(blob);
                            });
                        } else {
                            addError(response.body.msg);
                        }
                    }).catch(e => {
                    addError(e);
                });

            }
        ).catch(e => {
            addError(e);
        });
    }
}