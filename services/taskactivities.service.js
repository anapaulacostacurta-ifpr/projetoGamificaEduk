const taskActivityService = {
    getTaskActivity: async (activity_id) => {
        try{
            const querySnapshot = await firebase.firestore().collection("tasks_activities")
                .where('activity_id','==',activity_id)
                .get();
                console.log(querySnapshot);
                
                if(querySnapshot.empty){
                    return [];
                }

                const task_activity = querySnapshot.docs.map(doc=>doc.data());
                console.log(task_activity);
                return task_activity;
        }catch (error) {
            throw error;
        }
    },
    save: async (tasks_activities) => {
        try{
            const querySnapshot = await firebase.firestore().collection("tasks_activities")
            .doc()
            .set(tasks_activities);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (id,tasks_activities)  => {
        try{
            const querySnapshot = await firebase.firestore().collection("tasks_activities")
            .doc(id)
            .update(tasks_activities);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
};