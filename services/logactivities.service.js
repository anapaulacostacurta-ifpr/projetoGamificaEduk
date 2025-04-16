const logActivityService = {
    save: (log_activities) => {
        return firebase.firestore()
            .collection("log_activities")
            .doc()
            .set(log_activities);
    },
    getAtivitityByUserUID: async (activity_uid,user_UID) => {
        const querySnapshot = await firebase.firestore().collection("log_activities")
        .where("activity_uid", "==", activity_uid)
        .where('user_UID','==',user_UID)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            return [];
        }
        const log_activity = querySnapshot.docs.map(doc=>doc.data());
        console.log(log_activity);
        return log_activity;
},
};