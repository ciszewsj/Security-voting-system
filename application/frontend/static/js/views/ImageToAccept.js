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
        <h2 id="image-title-accept"></h2>
        <div class="image-box-info">
        <div class="image-full-screen">   
            <img id="image-accept" />
        </div>
        
            <div class="info-grid">
                <div>
                    <p>Autor: </p>
                    <p id="image-author-accept"></p>
                </div>
                <div>
                    <button id="accept-button-accept" class="like-button">Akceptuj obrazek</button>
                    <button id="delete-button-accept" class="like-button">Usuń obrazek</button>

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

        let image = document.getElementById("image-accept");
        let title = document.getElementById("image-title-accept");
        let authorImage = document.getElementById("image-author-accept");
        let description = document.getElementById("image-description");
        let acceptButton = document.getElementById("accept-button-accept");
        let removeButton = document.getElementById("delete-button-accept");

        let response = await (await fetch(`/api/getImageToAccept/${href}`,
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `${token}`
                    }
                }
            )
                .then(response => {
                    return response.json();
                }).catch(e => {
                        addError(e);
                        return undefined;
                    }
                )
        );
        if (response.status === "SUCCESS") {
            if (response.body.Active !== 0) {
                navigateTo("/imagesToAccept")
            }
            title.textContent = response.body.Title
            authorImage.textContent = response.body.Name;
            description.textContent = response.body.Description;

            fetch(`/api/getImage/${response.body.Id}`)
                .then(img => {
                    if (img.status === 200) {
                        img.blob().then(blob => {
                            image.src = URL.createObjectURL(blob);
                        });
                    } else {
                        addError(img.body.msg);
                    }
                }).catch(e => {
                addError(e);
            });
            acceptButton.addEventListener("click", () => {
                fetch(`/api/acceptImage/${href}`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': `${token}`
                        }
                    }
                )
                    .then(response => {
                        return response.json();
                    }).then(
                    response => {
                        console.log(response)
                        if (response.status === "SUCCESS") {
                            navigateTo("/imagesToAccept");
                        } else {
                            addError(response.body.msg);
                        }
                    }
                ).catch(e => {
                    addError(e);
                });
            });
            removeButton.addEventListener("click", () => {
                fetch(`/api/removeImage/${href}`,
                    {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'authorization': `${token}`
                        }
                    }
                )
                    .then(response => {

                        return response.json();
                    }).then(
                    response => {
                        console.log(response)
                        if (response.status === "SUCCESS") {
                            navigateTo("/imagesToAccept");
                        } else {
                            addError(response.body.msg);
                        }
                    }
                ).catch(e => {
                    addError(e);
                })
            });
        } else if (response !== undefined) {
            addError(response.body.msg);
        }
    }
}
