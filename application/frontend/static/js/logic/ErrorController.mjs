import {getSession} from "./StorageControler.mjs";

let errorBox = document.getElementById("info");

export let addError = (message) => {
    creteInfo(message, "error-box-error");
};

export let addInfo = (message) => {
    creteInfo(message, "info-box-error");
};

export let clearErrors = async () => {
    errorBox.innerHTML = "";
}

export let addServerInfo = async () => {
        let token = getSession().token;
        await fetch(`/api/userinfo/getInfoList`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'authorization': `${token}`
            }
        }).then(response => {
            return response.json();
        }).then(response => {
                if (response.status === "SUCCESS") {
                    for (let i in response.body) {
                        let elem = creteInfo(response.body[i].Info, "server-box-error");
                        elem.addEventListener("click", () => {
                                fetch(`/api/userinfo/removeInfoElement/${response.body[i].Id}`, {
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                        'authorization': `${token}`
                                    }
                                })
                                    .catch(e => {
                                        addError(e);
                                    })
                            }
                        )
                    }
                }
            }
        )
        ;
    }
;

let creteInfo = (message, className) => {
    let newMessage = document.createElement("div");
    newMessage.textContent = message;
    errorBox.appendChild(newMessage);
    newMessage.classList.add("info-box-error-view");
    newMessage.classList.add(className)
    newMessage.addEventListener("click", () => {
        newMessage.remove();
    });
    return newMessage;
};