export default class {
    constructor(params) {
        this.params = params
    }


    setTitle(title) {
        document.title = title;
    }

    async getHtml() {
        return "";
    }

    async addLogic() {
        return console.log("NOT SUPPORTED YET");
    }

    async removeLogic(){
        return console.log("NOT SUPPORTED YET");
    }
}