const activityTaskService = {
    getTaskActivity: async (activity_id) => {
        try{
            return querySnapshot = await firebase.firestore().collection("activity_tasks")
                .where('activity_id','==',activity_id)
                .get()
                .then(doc => {
                    return doc.data();
                });
        }catch (error) {
            throw error;
        }
    },
    save: async (activity_task) => {
        try{
            const querySnapshot = await firebase.firestore().collection("activity_tasks")
            .doc()
            .set(activity_task);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (id,activity_task)  => {
        try{
            const querySnapshot = await firebase.firestore().collection("activity_tasks")
            .doc(id)
            .update(activity_task);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
};