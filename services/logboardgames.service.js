const logboardgamesService = {
    save: (log_answers) => {
        return firebase.firestore()
            .collection("logboardgames")
            .doc()
            .set(log_answers);
    },
};