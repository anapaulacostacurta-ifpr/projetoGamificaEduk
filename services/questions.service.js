const transactionService = {
    findByUid: uid => {
        return firebase.firestore()
            .collection("questions")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            })
    },
    remove: questions => {
        return firebase.firestore()
            .collection("questions")
            .doc(questions.uid)
            .delete();
    },
    save: questions => {
        return firebase.firestore()
            .collection('questions')
            .add(questions);
    },
    update: questions => {
        return firebase.firestore()
            .collection("questions")
            .doc(getquestionsUid())
            .update(questions);
    }
}