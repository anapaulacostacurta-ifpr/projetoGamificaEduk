const userService = {
    findByUid: uid => {
        return callApi({
            method: "GET",
            url: `https://api.github.com/users/anapaulacostacurta-ifpr/apiGamificaEduk/users/${uid}`
        })
    },
    getHosts: () => {
        return callApi({
            method: "GET",
            url: `https://api.github.com/users/anapaulacostacurta-ifpr/apiGamificaEduk/users`
        })
    },
    getPlayers: (host) => {
        return callApi({
            method: "GET",
            url: `https://api.github.com/users/anapaulacostacurta-ifpr/apiGamificaEduk/users/${host}`
        })
    },
    save: (users) => {
        return callApi({
            method: "POST",
            url: `https://api.github.com/users/anapaulacostacurta-ifpr/apiGamificaEduk/users`,
            params:users
        })
    },
    update: (users) => {
        return callApi({
            method: "PATCH",
            url: `https://api.github.com/users/anapaulacostacurta-ifpr/apiGamificaEduk/users/${users.uid}`, 
            params: users
        })
    },
}

function callApi({method, url, params}){
    return new Promise(async (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(method,url,true);
        
        xhr.setRequestHeader('Authorization', await firebase.auth().currentUser.getIdToken());
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

        xhr.onreadystatechange = function(){
            if(this.readyState == 4){
                if (!this.responseText) {
                    reject({ error: "Resposta vazia da API." });
                    return;
                }
                try {
                    const json = JSON.parse(this.responseText);
                    if(this.status != 200){
                        reject(json);
                    }else{
                        resolve(json);
                    }
                } catch (e) {
                    reject({ error: "Erro ao fazer parse do JSON", detalhes: e.message });
                }
            }
        };
        xhr.send(JSON.stringify(params));
    })
}