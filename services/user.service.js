const usersService = {
    findByUid: uid => {
        return firebase.firestore()
            .collection("login")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    save: async (uid, user) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("login")
            .doc(uid)
            .set(user);

            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};