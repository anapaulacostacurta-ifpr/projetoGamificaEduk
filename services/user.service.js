const userService = {
    findByUid: async uid => {
        const querySnapshot = await firebase.firestore()
            .collection("users")
            .doc(uid)
            .get();
            
            if(querySnapshot.empty){
                throw new Error("Usuário não encontrado!");
            }
            
            const user = await querySnapshot.docs.map(doc=>doc.data());
            return user;
    },
    save: (user_UID, user) => {
        return firebase.firestore()
            .collection("users")
            .doc(user_UID)
            .set(user);
    }
};