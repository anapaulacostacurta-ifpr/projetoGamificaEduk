const taskActivityService = {
    getTaskActivity: async (activity_id) => {
        try{
            const querySnapshot = await firebase.firestore().collection("tasks_activities").get();
                 querySnapshot.forEach(doc => {
                    console.log("DOC ID:", doc.id);
                    console.log("activity_id:", doc.data().activity_id);
                });
                //.where('activity_id','==',"nXrhex9iArUIBvhAG0wT")
                //.get();
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