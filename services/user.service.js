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
    getPlayersInative: (host) => {
        return callApi({
            method: "GET",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users/${host}`
        })
    },
    save: (user) => {
        return callApi({
            method: "POST",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users`,
            params:user
        })
    },
    update: (user) => {
        return callApi({
            method: "PATCH",
            url: `https://api.github.com:3000/users/anapaulacostacurta-ifpr/users/${user.uid}`, 
            params: user
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
        
        xhr.setRequestHeader('Authorization',await firebase.auth().currentUser.getIdToken());

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
        xhr.send();
    })
}