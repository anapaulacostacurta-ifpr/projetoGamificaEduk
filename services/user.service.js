const userService = {
    findByUid: uid => {
        return callApi({
            method: "GET",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users/${uid}`
        })
    },
    getHosts: () => {
        return callApi({
            method: "GET",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users/`
        })
    },
    getPlayers: (host) => {
        return callApi({
            method: "GET",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users/${host}`
        })
    },
    save: (users) => {
        return callApi({
            method: "POST",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users`,
            params:users
        })
    },
    update: (users) => {
        return callApi({
            method: "PATCH",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users/${users.uid}`, 
            params: users
        })
    },
}

function callApi({method, url}){
    return new Promise(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(
            method,
            url,
            true
        );
        
        xhr.setRequestHeader('Authorization', await firebase.auth().currentUser.getIdToken());
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.onreadystatechange = function(){
            if(this.readyState == 4){
                const json = JSON.parse(this.responseText);
                if(this.status != 200){
                    reject(json);
                }else{
                    resolve(json);
                }
            }
        };
        xhr.send(JSON.stringify(params));
    })
}