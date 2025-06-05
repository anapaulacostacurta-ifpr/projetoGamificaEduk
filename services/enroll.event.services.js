// Serviço responsável pela manipulação de dados da coleção "enroll_events" no Firestore.

const enrollEventService = {
  /**
   * Busca inscrições por ID do evento e UID do usuário.
   * @param {string} eventUID - UID do evento.
   * @param {string} userUID - UID do usuário.
   * @returns {Promise<Array>} Lista de inscrições.
   */
  getEnrollsByEventUidUserUid: async (eventUID, userUID) => {
    try {
      const snapshot = await firebase.firestore()
        .collection("enroll_events")
        .where("event_id", "==", eventUID)
        .where("user_UID", "==", userUID)
        .get();

      if (snapshot.empty) return [];

      // Mapeia os documentos retornados
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        dados: doc.data()
      }));
    } catch (error) {
       throw `Erro ao buscar inscrições por evento e usuário: ${error}`;
    }
  },

  /**
   * Busca todas as inscrições de um usuário.
   * @param {string} userUID - UID do usuário.
   * @returns {Promise<Array>} Lista de inscrições.
   */
  getEnrollsByUserUID: async (userUID) => {
    try {
      const snapshot = await firebase.firestore()
        .collection("enroll_events")
        .where("user_UID", "==", userUID)
        .get();

      if (snapshot.empty) return [];

      return snapshot.docs.map(doc => ({
        uid: doc.id,
        dados: doc.data()
      }));
    } catch (error) {
      throw `Erro ao buscar inscrições do usuário: ${error}`;
    }
  },

  /**
   * Salva nova inscrição na coleção "enroll_events".
   * @param {Object} enrollData - Dados da inscrição.
   * @returns {Promise<void>}
   */
  save: async (enrollData) => {
    try {
      await firebase.firestore()
        .collection("enroll_events")
        .doc()
        .set(enrollData);
    } catch (error) {
      throw `Erro ao salvar inscrição:${error}`;
    }
  },

  /**
   * Atualiza uma inscrição existente na coleção "enroll_events".
   * @param {string} uid - ID do documento a ser atualizado.
   * @param {Object} enrollData - Novos dados da inscrição.
   * @returns {Promise<void>}
   */
  update: async (uid, enrollData) => {
    try {
      await firebase.firestore()
        .collection("enroll_events")
        .doc(uid)
        .update(enrollData);
    } catch (error) {
      throw `Erro ao atualizar inscrição: ${error}`;
    }
  }
};
