const tokenService = {
    getTokensQuiz:  async (tokenid) => {
    try {
        const querySnapshot = await firebase.firestore().collection("tokens")
        .where('quiz','array-contains',tokenid)
        .get();

        if(querySnapshot.empty){
            throw new Error("Token inválido!");
        }
        const tokens = querySnapshot.docs.map(doc=>doc.data());
        alert(tokens);
        return tokens;
    } catch (error) {
            console.error("Erro ao carregar perguntas:", error);
            alert("Falha ao carregar perguntas. Tente novamente mais tarde.");
            return [];
    }
   },
   findByUid: uid => {
        return firebase.firestore()
            .collection("tokens")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    remove: token => {
        return firebase.firestore()
            .collection("tokens")
            .doc(tokens.uid)
            .delete();
    },
    save: token => {
        return firebase.firestore()
            .collection("tokens")
            .add(tokens);
    },
    update: token => {
        return firebase.firestore()
            .collection("tokens")
            .doc(tokens.uid)
            .update(tokens);
    }
};
