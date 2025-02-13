const userService = {
    findByUid: async (uid) => {
        return await firebase.firestore()
            .collection("login")
            .where('uid','==',uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    save: async (user) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("users")
            .doc()
            .set(user);

            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};