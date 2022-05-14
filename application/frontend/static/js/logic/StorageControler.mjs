export function getSession() {
    let session = JSON.parse(localStorage.getItem("Session"));
    if (session === undefined) {
        removeSession();
        getSession();xxx
    }
    return session;
}

export function addSession(token, name, role) {
    localStorage.setItem("Session", JSON.stringify({token: `${token}`, name: `${name}`, role: `${role}`}));
}

export function removeSession() {
    addSession("", "", "");
}