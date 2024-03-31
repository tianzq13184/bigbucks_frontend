// const domain = "http://127.0.0.1:5000"

export const login = (credential, asHost) => {
    const loginUrl = '/login/${asHost? "host" : "user"}';
    // const loginUrl = '/login/${asHost? "host" : "user"}';
    return fetch(loginUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
    }).then((response) => {
        if(response.status !== 200) {
            throw Error("Fail to log in");
        }

        return response.json();
    });
};

export const register = (credential) => {
    const registerUrl = '/register/';
    // const registerUrl = '/register/';
    return fetch(registerUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credential),
    }).then((response) => {
        if(response.status !== 200) {
            throw Error("Fail to register");
        }
    });
};