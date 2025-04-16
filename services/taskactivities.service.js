var activity_id;
var bonus_id;
var challange_id;
var good_fortune_id;
var quiz_final_id; 
var quizzes_id;
var tough_luck_id;
const taskActivityService = {
    getTaskActivity: async (activity_id) => {
        const querySnapshot = await firebase.firestore().collection("tasks_activities")
                .where("activity_id", '==',activity_id)
                .get();
                console.log(querySnapshot);

                const task_activity = querySnapshot.docs.map(doc=>doc.data());
                console.log(task_activity);
                return task_activity;
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