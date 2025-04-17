const challangeService = {
    getChallengesByUid: async (id) => {
        return await firebase.firestore().collection("challanges")
            .doc(id)
            .get()
            .then(doc => {
                return doc.data();
            });
    }
}