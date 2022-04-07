export function getSession() {
    try {
        return JSON.parse(document.cookie)
    } catch (e) {
        document.cookie.split(";").forEach(function (c) {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires="
                + new Date().toUTCString() + ";path=/");
        });
        removeSession();
        return getSession();
    }
}

export function addSession(token, name, role) {
    document.cookie = JSON.stringify({token: `${token}`, name: `${name}`, role: `${role}`});
}

export function removeSession() {
    addSession("", "", "");
}