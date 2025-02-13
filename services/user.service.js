const userService = {
    findByUid: async (id) => {
        return await firebase.firestore()
            .collection("users")
            .doc(id)
            .get();
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