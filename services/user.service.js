const userService = {
    findByUid: uid => {
        return firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    save: user_UID => {
        return firebase.firestore()
            .collection("users")
            .add(user_UID);
    }
}