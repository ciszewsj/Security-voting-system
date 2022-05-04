import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/CookieControler.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Obrazek");
    }

    async getHtml() {
        return `
        <h1 id="image-title"></h1>
        <p>Autor: </p>
        <p id="image-author"></p>   
        <p>Description: </p>
        <p id="image-description"></p>   
        <img id="image-image" />
        <button id="like-button" class="like-button">+</button>
        <p>Likes:</p>
        <p id="image-likes"></p>
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
                            }
                        })
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
                            }
                        })
                    }
                });


                fetch(`/api/getImage/${imageInfo.ImageId}`)
                    .then(img => {
                        if (img.status === 200) {
                            img.blob().then(blob => {
                                imageImage.src = URL.createObjectURL(blob);
                            });
                        } else {
                            console.log("error loading image");
                        }
                    });

            }
        )
    }
}