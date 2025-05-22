// events.service.js

/**
 * Serviço de manipulação de dados da coleção "events" no Firestore.
 * Inclui operações de busca por ID, data, UID e persistência (save/update).
 */

const eventService = {
  /**
   * Busca eventos por ID, data de início e estado (ex: "started").
   * @param {string} eventId - Código do evento.
   * @param {string} eventDate - Data de início no formato DD/MM/AAAA.
   * @param {string} eventState - Estado do evento (ex: "started").
   * @returns {Promise<Array>} Lista de eventos encontrados.
   */
  getEventsByDateStart: async (eventId, eventDate, eventState) => {
    const snapshot = await firebase.firestore()
      .collection("events")
      .where("id", "==", eventId)
      .where("date_start", "==", eventDate)
      .where("state", "==", eventState)
      .get();

    if (snapshot.empty) {
      throw new Error("01 - Não encontrado.");
    }

    return snapshot.docs.map(doc => ({
      uid: doc.id,
      dados: doc.data()
    }));
  },

  /**
   * Busca eventos por ID.
   * @param {string} eventId - Código do evento.
   * @returns {Promise<Array>} Lista de eventos encontrados.
   */
  getEventsByID: async (eventId) => {
    const snapshot = await firebase.firestore()
      .collection("events")
      .where("id", "==", eventId)
      .get();

    if (snapshot.empty) {
      throw new Error("01 - Não encontrado.");
    }

    return snapshot.docs.map(doc => ({
      uid: doc.id,
      dados: doc.data()
    }));
  },

  /**
   * Retorna os dados de um evento pelo UID do documento no Firestore.
   * @param {string} eventUID - UID do documento.
   * @returns {Promise<Object>} Dados do evento.
   */
  getEventByUID: async (eventUID) => {
    const doc = await firebase.firestore()
      .collection("events")
      .doc(eventUID)
      .get();

    if (!doc.exists) {
      throw new Error("01 - Não encontrado.");
    }

    return doc.data();
  },

  /**
   * Retorna todos os eventos com data ordenada, excluindo os finalizados.
   * @returns {Promise<Array>} Lista de eventos ativos ou pendentes.
   */
  getEvents: async () => {
    const snapshot = await firebase.firestore()
      .collection("events")
      .orderBy("date_start", "asc")
      .get();

    if (snapshot.empty) {
      throw new Error("01 - Não encontrado.");
    }

    return snapshot.docs
      .map(doc => ({
        uid: doc.id,
        dados: doc.data()
      }))
      .filter(event => event.dados.state !== "finished");
  },

  /**
   * Salva um novo evento na coleção.
   * @param {Object} eventData - Objeto com dados do evento.
   * @returns {Promise<void>}
   */
  save: async (eventData) => {
    try {
      await firebase.firestore()
        .collection("events")
        .doc()
        .set(eventData);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Atualiza os dados de um evento existente.
   * @param {string} id - UID do documento a ser atualizado.
   * @param {Object} eventData - Novos dados para o evento.
   * @returns {Promise<void>}
   */
  update: async (id, eventData) => {
    try {
      await firebase.firestore()
        .collection("events")
        .doc(id)
        .update(eventData);
    } catch (error) {
      throw error;
    }
  }
};
