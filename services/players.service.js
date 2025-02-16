const playerService = {
    getPlayer: async (id, user_UID) => {
        const querySnapshot = await firebase.firestore().collection("activities")
        .doc(id)
        .where('state','==','starterd')
        .collection("players")
        .doc(user_UID)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("01 - Não encontrado.");
        }
        var players = new Array();
        querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var player = {uid,dados};
            players.push(player);
        });
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