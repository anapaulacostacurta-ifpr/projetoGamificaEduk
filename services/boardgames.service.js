const boardgamesService = {
    getBoardGameByRodadaID: async (rodadaid) => {
            const querySnapshot = await firebase.firestore().collection("boardgames")
            .where('boardgameid','==',rodadaid)
            .where('state','==','started')
            .where('round_date','==',(new Date()).toLocaleDateString('pt-BR'))
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Não encontrado");
            }
            var boardgames = new Array();
            querySnapshot.forEach(doc => {
                var id = doc.id;
                var dados = doc.data();
                var boardgame = {id,dados};
                boardgames.push(boardgame);
            });
            console.log(boardgames);
            return boardgames;
    },
    getBoardGameByDados: async (boardgameid,round_date, host, level,state) => {
        const querySnapshot = await firebase.firestore().collection("boardgames")
        .where('boardgameid','==',boardgameid)
        .where('round_date','==',round_date)
        .where('host','==',host)
        .where('level','==',level)
        .where('state','==',state)
        .get();
        console.log(querySnapshot);

        if(querySnapshot.empty){
            throw new Error("Tabuleiro não encontrado:" + boardgameid);
        }
        var boardgames = new Array();
        querySnapshot.forEach(doc => {
            var id = doc.id;
            var dados = doc.data();
            var boardgame = {id,dados};
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
        throw new Error("Tabuleiro não encontrado:" + boardgameid);
    }
    var boardgames = new Array();
    querySnapshot.forEach(doc => {
            var id = doc.id;
            var dados = doc.data();
            var boardgame = {id,dados};
            boardgames.push(boardgame);
    });
    console.log(boardgames);
    return boardgames;
},
getActivitiesbyDateStart: async (date_start) => {
    const querySnapshot = await firebase.firestore().collection("activities")
    .where('date_start','==', date_start)
    .where('state','==','started')
    .get();
    console.log(querySnapshot);

    if(querySnapshot.empty){
        throw new Error("01 - Não encontrado.");
    }
    var activities = new Array();
    querySnapshot.forEach(doc => {
            var uid = doc.id;
            var dados = doc.data();
            var activity = {uid,dados};
            activities.push(activity);
    });
    console.log(activities);
    return activities;
},
getActivities: async (id) => {
    const querySnapshot = await firebase.firestore().collection("activities")
            .where('id', '==',id)
            .where('state','==','started')
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Atividade não encontrado:" + id);
            }
            var activities = new Array();
            querySnapshot.forEach(doc => {
                var uid = doc.id;
                var dados = doc.data();
                var activity = {uid,dados};
                activities.push(activity);
            });
            console.log(activities);
            return activities;
},
getActivitybyPlayer: async (user_UID, date_start,date_final,time_start,time_final) => {
    const querySnapshot = await firebase.firestore().collection("activities")
            .where('state','==','started') 
            .where("date_start", ">=", date_start)
            .where('date_final','<=',date_final)
            .where('time_start','>=',time_start)
            .where('time_final','<=',time_final)
            .orderBy("date_start", "asc")
            .get();
            console.log(querySnapshot);

            if(querySnapshot.empty){
                throw new Error("Tabuleiro não encontrado:" + rodadaid);
            }
            var boardgames = new Array();
            querySnapshot.forEach(doc => {
                var id = doc.id;
                var dados = doc.data();
                var players = dados.players;
                players.forEach(player => {
                    if(player.user_UID == user_UID){
                        var boardgame = {id,dados};
                        boardgames.push(boardgame);
                    }
                  });
                
            });
            console.log(boardgames);
            return boardgames;
},
    remove: boardgames => {
        return firebase.firestore()
            .collection("boardgames")
            .doc(boardgames.uid)
            .delete();
    },
    save: async (activities) => {
        try{
            const querySnapshot = await firebase.firestore()
            .collection("activities")
            .doc()
            .set(activities);
            return querySnapshot;
        }catch (error) {
            throw error;
        }
    },
    update: async (id,activities)  => {
        return await firebase.firestore()
            .collection("activities")
            .doc(id)
            .update(activities);
    }
};