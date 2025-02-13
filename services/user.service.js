const usersService = {
    findByUid: uid => {
        return firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    save: async (user) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("users")
            .doc(user.uid)
            .set(user);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};