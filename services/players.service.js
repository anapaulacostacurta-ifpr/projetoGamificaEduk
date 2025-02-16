const playerService = {
    getPlayer: async (id, user_UID) => {
        const querySnapshot = await firebase.firestore().collection("activities")
        .doc(id)
        .collection("players")
        .doc(user_UID)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("01 - Não encontrado.");
        }
        const players = querySnapshot.docs.map(doc=>doc.data());
        console.log(players);
        return players;
    },

    save: async (activity_id,players)  => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("activities")
            .doc(activity_id)
            .collection("players")
            .doc(players.user_UID)
            .set(players);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};