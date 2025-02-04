const userService = {
    findByUid: async uid => {
        return await firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    save: (user_UID, user) => {
        return firebase.firestore()
            .collection("users")
            .doc(user_UID)
            .set(user);
    }
};