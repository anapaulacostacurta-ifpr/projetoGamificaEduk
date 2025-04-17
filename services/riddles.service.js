const riddleService = {
    getRiddleByGroundControlPointId:  async (ground_control_point_id, group_id) => {
    try {
        const querySnapshot = await firebase.firestore().collection("riddles")
        .where('ground_control_point_id', "==", ground_control_point_id)
        .where('group_id', '==', group_id)
        .get();

        if(querySnapshot.empty){
           return [];
        }
        const tokens = querySnapshot.docs.map(doc=>doc.data());
        return tokens;
    } catch (error) {
            console.error("Erro ao carregar Riddle:", error);
            return [];
    }
   }
}