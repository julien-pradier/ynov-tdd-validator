"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.registerUserAPI = exports.getUsersAPI = void 0;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const API_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Envoie les données d'inscription vers notre fausse API.
 * @param {Object} userData - Les données du formulaire
 * @returns {Promise<Object>} L'utilisateur créé avec son ID
 */
const registerUserAPI = async userData => {
  try {
    const response = await _axios.default.post("".concat(API_URL, "/users"), userData);
    return response.data;
  } catch (error) {
    console.error("Erreur réseau lors de l'inscription :", error);
    throw error;
  }
};

/**
 * Récupère la liste des utilisateurs depuis notre fausse API au démarrage.
 * @returns {Promise<Array>} La liste des utilisateurs
 */
exports.registerUserAPI = registerUserAPI;
const getUsersAPI = async () => {
  try {
    const response = await _axios.default.get("".concat(API_URL, "/users"));
    return response.data;
  } catch (error) {
    console.error("Erreur réseau lors de la récupération des utilisateurs :", error);
    throw error;
  }
};
exports.getUsersAPI = getUsersAPI;