import Dashboard from "../views/Dashboard.js";
import Posts from "../views/Posts.js";
import About from "../views/About.js";
import Login from "../views/Login.js";
import Register from "../views/Register.js";
import MyImageSite from "../views/MyImageSite.js";
import ImagesToAccept from "../views/ImagesToAccept.js";
import ImageToAccept from "../views/ImageToAccept.js";
import Logout from "../views/Logout.js";
import {checkIfLogin} from "./SessionController.mjs";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};


export const navigateTo = url => {
    checkIfLogin();
    history.pushState(null, null, url);
    router();
};
let view;

export const getView = () => {
    return view;
};

export const router = async () => {
    const routes = [{
        path: "/", view: Dashboard
    }, {
        path: "/posts/:id", view: Posts
    }, {
        path: "/about", view: About
    }, {
        path: "/login", view: Login
    }, {
        path: "/register", view: Register
    }, {
        path: "/logout", view: Logout
    }, {
        path: "/myimage", view: MyImageSite
    }, {
        path: "/imagesToAccept", view: ImagesToAccept
    }, {
        path: "/imageToAccept/:id", view: ImageToAccept
    }]


    const potentialMatches = routes.map(route => {
        return {
            route: route,
            result: location.pathname.match(pathToRegex(route.path))
        };
    });
    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null)

    if (!match) {
        match = {
            route: routes[0], result: [location.pathname]
        };
    }
    view = new match.route.view(getParams(match));
    document.querySelector("#app").innerHTML = await view.getHtml();

    view.addLogic();
};