const boardgamesService = {
    findAll: async () => {
        const querySnapshot =  await firebase.firestore()
        .collection("boardgames")
        .get()
        console.log(querySnapshot);
        
        if(querySnapshot.empty){
            throw new Error("Retornou sem conteúdo");
        }

        var boardgames = new Array();
        querySnapshot.forEach(doc => {
            var boardgameid = doc.id;
            var boarddados = doc.data();
            var boardgame = {boardgameid,boarddados};
            boardgames.push(boardgame);
        });
        console.log(boardgames);
        return boardgames;
    },
    findByUid: uid => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(uid)
            .get()
            .then(doc => {
                return doc.data();
            });
    },
    getBoardGameByID: async (boardgameid) => {
            const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('boardgameid','==',boardgameid)
            .where('state','==','started')
            .where('round_date','==',(new Date()).toLocaleDateString('pt-BR'))
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Tabuleiro não encontrador:" + boardgameid);
            }
            var boardgames = new Array();
            querySnapshot.forEach(doc => {
                var boardgameid = doc.id;
                var boarddados = doc.data();
                var boardgame = {boardgameid,boarddados};
                boardgames.push(boardgame);
            });
            console.log(boardgames);
            return boardgames;
    },
    getBoardGameByID: async (boardgameid,round_date, host, level,state) => {
        const querySnapshot = await firebase.firestore().collection("boardgames")
        .where('boardgameid','==',boardgameid)
        .where('round_date','==',round_date)
        .where('host','==',host)
        .where('level','==',level)
        .where('state','==',state)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("Tabuleiro não encontrador:" + boardgameid);
        }
        var boardgames = new Array();
        querySnapshot.forEach(doc => {
            var boardgameid = doc.id;
            var boarddados = doc.data();
            var boardgame = {boardgameid,boarddados};
            boardgames.push(boardgame);
        });
        console.log(boardgames);
        return boardgames;
},
    getBoardgameRounds: async (boardgameid,round_date, host, level) => {
    const querySnapshot = await firebase.firestore().collection("boardgames")
    .where('boardgameid','==',boardgameid)
    .where('round_date','==',round_date)
    .where('host','==',host)
    .where('level','==',level)
    .get();
    console.log(querySnapshot);

    if(querySnapshot.empty){
        throw new Error("Tabuleiro não encontrador:" + boardgameid);
    }
    var boardgames = new Array();
    querySnapshot.forEach(doc => {
            var boardgameid = doc.id;
            var boarddados = doc.data();
            var boardgame = {boardgameid,boarddados};
            boardgames.push(boardgame);
    });
    console.log(boardgames);
    return boardgams;
},
    remove: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgames.uid)
            .delete();
    },
    save: async (boardgames) => {
        return await firebase.firestore()
            .collection("boardgames")
            .doc()
            .set(boardgames)
    },
    update: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .update(boardgames);
    },
    addPlayers:  (boardgameid, players) => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgameid)
            .update(players);
            
    }
};