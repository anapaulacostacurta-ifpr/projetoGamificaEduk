const playerService = {
    save: async (activity_id,players)  => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("activities")
            .doc(activity_id)
            .collection("players")
            .doc()
            .set(players);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    }
};