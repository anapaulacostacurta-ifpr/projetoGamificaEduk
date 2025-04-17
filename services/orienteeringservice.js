const orienteeringService = {
    getOrienteeringByUid: async (id) => {
        return await firebase.firestore().collection("orienteering")
            .doc(id)
            .get()
            .then(doc => {
                return doc.data();
            });
    }
}