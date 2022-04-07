import Dashboard from "./views/Dashboard.js";
import Posts from "./views/Posts.js";
import Settings from "./views/Settings.js";
import PostView from "./views/PostView.js";
import Login from "./views/Login.js";
import Register from "./views/Register.js";
import MyImageSite from "./views/MyImageSite.js";
import {checkIfLogin} from "./logic/SessionController.mjs";

checkIfLogin();
window.setInterval(checkIfLogin, 10000);
const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);
    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};
let view;
const router = async () => {
    console.log(pathToRegex("/posts/:id"));
    const routes = [{
        path: "/", view: Dashboard
    }, {
        path: "/posts", view: Posts
    }, {
        path: "/posts/:id", view: PostView
    }, {
        path: "/settings", view: Settings
    }, {
        path: "/login", view: Login
    }, {
        path: "/register", view: Register
    }, {
        path: "/myimage", view: MyImageSite
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

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", (e) => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            try {
                view.removeLogic();
            } catch {

            }
            checkIfLogin();
            e.preventDefault();
            navigateTo(e.target.href);
        }
    });

    router();
});