// events.service.js

/**
 * Serviço de manipulação de dados da coleção "events" no Firestore.
 * Inclui operações de busca por ID, data, UID e persistência (save/update).
 */

const eventService = {
  /**
   * Busca eventos por ID, data de início e estado.
   * @param {string} eventId - Código do evento.
   * @param {string} eventDate - Data de início no formato DD/MM/AAAA.
   * @param {string} eventState - Estado do evento (ex: "started").
   * @returns {Promise<Array|null>} Lista de eventos encontrados ou null se vazio.
   */
  getEventsByDateStart: async (eventId, eventDate, eventState) => {
    const snapshot = await firebase.firestore()
      .collection("events")
      .where("id", "==", eventId)
      .where("date_start", "==", eventDate)
      .where("state", "==", eventState)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map(doc => ({
      uid: doc.id,
      dados: doc.data()
    }));
  },

  /**
   * Busca eventos por ID (sem verificar estado).
   * @param {string} eventId - Código do evento.
   * @returns {Promise<Array|null>} Lista de eventos ou null se nenhum encontrado.
   */
  getEventsByID: async (eventId) => {
    const snapshot = await firebase.firestore()
      .collection("events")
      .where("id", "==", eventId)
      .get();

    if (snapshot.empty) {
      return null; // 01 - Evento não encontrado
    }

    return snapshot.docs.map(doc => ({
      uid: doc.id,
      dados: doc.data()
    }));
  },

  /**
   * Obtém dados completos de um evento a partir do UID.
   * @param {string} eventUID - UID do documento do evento.
   * @returns {Promise<Object|null>} Objeto de dados do evento ou null.
   */
  getEventByUID: async (eventUID) => {
    const doc = await firebase.firestore()
      .collection("events")
      .doc(eventUID)
      .get();

    if (!doc.exists) {
      return null;
    }

    return doc.data();
  },

  /**
   * Retorna todos os eventos não finalizados, ordenados por data de início.
   * @returns {Promise<Array|null>} Lista de eventos ou null se nenhum encontrado.
   */
  getEvents: async () => {
    const snapshot = await firebase.firestore()
      .collection("events")
      .orderBy("date_start", "asc")
      .get();

    if (snapshot.empty) {
      return null;
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
   * @param {Object} eventData - Objeto contendo os dados do novo evento.
   * @returns {Promise<void>}
   */
  save: async (eventData) => {
    try {
      await firebase.firestore()
        .collection("events")
        .doc()
        .set(eventData);
    } catch (error) {
      throw new Error("Erro ao salvar evento: " + error.message);
    }
  },

  /**
   * Atualiza dados de um evento existente a partir do UID.
   * @param {string} id - UID do evento.
   * @param {Object} eventData - Dados atualizados do evento.
   * @returns {Promise<void>}
   */
  update: async (id, eventData) => {
    try {
      await firebase.firestore()
        .collection("events")
        .doc(id)
        .update(eventData);
    } catch (error) {
      throw new Error("Erro ao atualizar evento: " + error.message);
    }
  }
};
