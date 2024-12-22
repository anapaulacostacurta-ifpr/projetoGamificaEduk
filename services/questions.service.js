const questionService = {
    getAll: async () => {
        const questionsRef = firebase.firestore().collection("questions");
        const snapshot = await getDocs(questionsRef);
        const questions = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
        return questions;
    },
    findByUid: uid => {
        return firebase.firestore()
            .collection("questions")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            })
    },
    remove: question => {
        return firebase.firestore()
            .collection("questions")
            .doc(question.uid)
            .delete();
    },
    save: question => {
        return firebase.firestore()
            .collection("questions")
            .add(question);
    },
    update: question => {
        return firebase.firestore()
            .collection("questions")
            .doc(question.uid)
            .update(question);
    }
}