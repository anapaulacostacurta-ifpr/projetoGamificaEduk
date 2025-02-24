const userService = {
    findByUid: async (uid) => {
        return await firebase.firestore()
            .collection("users")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },getTeachers: async () => {
        const querySnapshot = await firebase.firestore()
            .collection("users")
            .where('profile','==',"professor")
            .where('state','==',true)
            .get();

            if(querySnapshot.empty){
                throw new Error("01 - Não encontrado.");
            }
            const teachers = querySnapshot.docs.map(doc=>doc.data());
            console.log(teachers);            
            return teachers;
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