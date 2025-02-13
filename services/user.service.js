const userService = {
    findByUid: async (uid) => {
        return await firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    save: async (id,user) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("users")
            .doc(id)
            .set(user);

            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};