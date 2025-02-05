// services/state.service.js
// Mapa para almacenar el estado de los usuarios
const userStates = new Map();

// Mapa para almacenar datos temporales de los usuarios (opcional)
const userData = new Map();

/**
 * Obtiene el estado actual de un usuario.
 * @param {string} userId - El ID del usuario (puede ser su número de teléfono).
 * @returns {string} - El estado actual del usuario (o 'INICIO' si no existe).
 */
exports.getUserState = (userId) => {
  return userStates.get(userId) || 'INICIO';
};

/**
 * Establece el estado de un usuario.
 * @param {string} userId - El ID del usuario.
 * @param {string} state - El nuevo estado del usuario.
 */
exports.setUserState = (userId, state) => {
  if (!userId || !state) {
    throw new Error('userId y state son requeridos');
  }
  userStates.set(userId, state);
};

/**
 * Elimina el estado de un usuario.
 * @param {string} userId - El ID del usuario.
 */
exports.clearUserState = (userId) => {
  userStates.delete(userId);
};

/**
 * Obtiene datos temporales de un usuario.
 * @param {string} userId - El ID del usuario.
 * @returns {object} - Los datos almacenados para el usuario (o un objeto vacío si no existen).
 */
exports.getUserData = (userId) => {
  return userData.get(userId) || {};
};

/**
 * Guarda datos temporales para un usuario.
 * @param {string} userId - El ID del usuario.
 * @param {object} data - Los datos a almacenar.
 */
exports.setUserData = (userId, data) => {
  if (!userId || !data) {
    throw new Error('userId y data son requeridos');
  }
  userData.set(userId, data);
};

/**
 * Elimina los datos temporales de un usuario.
 * @param {string} userId - El ID del usuario.
 */
exports.clearUserData = (userId) => {
  userData.delete(userId);
};

/**
 * Reinicia completamente el estado y los datos de un usuario.
 * @param {string} userId - El ID del usuario.
 */
exports.resetUser = (userId) => {
  this.clearUserState(userId);
  this.clearUserData(userId);
};