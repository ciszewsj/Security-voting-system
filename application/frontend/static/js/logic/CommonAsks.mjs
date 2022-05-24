import {addError} from "./ErrorController.mjs";

export async function getImage(elem, imageId) {
    try {
        let img = document.getElementById(`${elem}`);
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