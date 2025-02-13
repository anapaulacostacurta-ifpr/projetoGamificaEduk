const userService = {
    findByUid: async (uid) => {
        const querySnapshot = await firebase.firestore()
            .collection("users")
            .where('uid','==',uid)
            .get();

            if(querySnapshot.empty){
                throw new Error("Nenhuma pergunta encontrada para o nível "+ level+ " .");
            }
            var users = new Array();
            querySnapshot.forEach(doc => {
                var uid = doc.id;
                var dados = doc.data();
                users.push({uid,dados});              
            });
            console.log(users);
            return users;
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