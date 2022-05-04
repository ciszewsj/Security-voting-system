import AbstractView from "./AbstractView.js";
import {getSession} from "../logic/CookieControler.mjs";
import {navigateTo} from "../logic/reloadController.mjs";

export default class extends AbstractView {
    constructor(params) {
        super(params);
        this.setTitle("Mój obrazek")
    };

    async getHtml() {
        return `
        <h1>Moje zdjęcie</h1>
        <div id="myImageBar"></div>
        `;
    };

    async addLogic() {
        if (getSession().token.length < 1) {
            navigateTo('/login');
            return;
        }
        let token = getSession().token;

        fetch("/api/getMyImageInfo",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                }
            }
        ).then(response => {
            return response.json();
        }).then(response => {
            if (response.body === undefined || response.body.Id === undefined) {
                noImageCase(token);
                return;
            }
            imageCase(response, token);
        });
    };
}
let imageCase = (response, token) => {
    console.log(response)
    let elem = document.getElementById("myImageBar");
    elem.innerHTML = `
            <div>
                <p>Tytuł :</p>
                <p id="title-my-image"></p>
                <p>Opis :</p>
                <p id="description-my-image"></p>
                <p>Obraz :</p>
                <div>
                  <img id="image-my-image"/>
                </div>
                <div id="remove-image-place">
                </div>
                
            </div>
            `
    if (response.status === "SUCCESS") {
        let title = document.getElementById("title-my-image");
        let description = document.getElementById("description-my-image");
        let image = document.getElementById("image-my-image");

        title.textContent = response.body.Title;
        description.textContent = response.body.Description;

        fetch(`/api/getImage/${response.body.Id}`)
            .then(img => {
                if (img.status === 200) {
                    img.blob().then(blob => {
                        image.src = URL.createObjectURL(blob);
                    });
                } else {
                    console.log("error loading image");
                }
            });
        if (response.body.Active !== 1) {
            document.getElementById("remove-image-place").innerHTML =
                `<button id="remove-image">Usuń zdjęcie</button>`;
            let removeButton = document.getElementById("remove-image");
            removeButton.addEventListener('click', async () => {
                fetch(`/api/removeImage/${response.body.Id}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'authorization': `${token}`
                    }
                }).then(response => {
                    return response.json();
                }).then(response => {
                    if (response.status === "SUCCESS") {
                        navigateTo(window.location);
                    }
                });
            });
        }
    }
};
let noImageCase = (token) => {
    let elem = document.getElementById("myImageBar");
    elem.innerHTML = `
        <form>
            <label for="Title">Tytuł :</label><br>
            <input type="text" id="title-image" name="title" autocomplete="on"><br>
            <div id="title_error"></div></br>
            <label for="description">Opis :</label><br>
            <input type="text" id="description-image" name="description" autocomplete="on"><br>
            <div id="description_error"></div></br>
            <label for="image">Obraz :</label><br>
            <input type="file" id="image-image" name="image" accept=".png, .jpg, .jpeg"><br>
            <div id="image_error"></div></br>
        </form>
        <button id="submit-image">Wyślij</button>`;
    document.getElementById("submit-image").addEventListener("click", async () => {
        let file = document.getElementById("image-image").files[0];
        console.log(file);
        const toBase64 = file => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
        let image = (await toBase64(file)).split(",")[1];

        let title_error = document.getElementById("title_error")
        let description_error = document.getElementById("description_error")
        let image_error = document.getElementById("image_error")

        fetch("/api/addImage",
            {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'authorization': `${token}`
                },
                method: "POST",
                body: JSON.stringify({
                    Title: document.getElementById("title-image").value,
                    Description: document.getElementById("description-image").value,
                    Image: image
                })
            }).then(response => {
            return response.json()
        }).then(response => {
            console.log(response)
            if (response.status === "SUCCESS") {
                navigateTo(window.location);
            } else if (response.status === "FAILURE" || response.status === "UNAUTHORIZED") {
                title_error.innerHTML = "";
                description_error.innerHTML = "";
                image_error.innerHTML = "";
                for (let i in response.body.errors) {
                    let err = response.body.errors[i];
                    console.log(err)
                    switch (err.param) {
                        case 'Image':
                            image_error.innerHTML = `<label>${err.msg}</label>`
                            break;
                        case 'Description':
                            description_error.innerHTML = `<label>${err.msg}</label>`
                            break;
                        case  'Title':
                            title_error.innerHTML = `<label>${err.msg}</label>`
                            break;
                    }
                }
            }
        });
    });
}