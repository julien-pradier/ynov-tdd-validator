/**
 * @module api
 * @description Module gérant les communications réseau (requêtes HTTP) avec l'API backend Python.
 * Centralise tous les appels axios pour l'inscription, la récupération et la connexion.
 */

import axios from "axios";

const port = process.env.REACT_APP_SERVER_PORT || 8000;

const API_URL = `http://${window.location.hostname}:${port}`;

/**
 * Envoie les données d'inscription vers notre API Python.
 * @async
 * @function registerUserAPI
 * @param {Object} userData - Les données brutes du formulaire.
 * @param {string} userData.lastName - Le nom de famille.
 * @param {string} userData.firstName - Le prénom.
 * @param {string} userData.email - L'adresse email.
 * @param {string} userData.birthDate - La date de naissance.
 * @returns {Promise<Object>} L'utilisateur créé
 * @throws {Error} Lance une erreur en cas d'échec réseau ou de validation (422).
 */
export const registerUserAPI = async (userData) => {
    const payload = {
        name: userData.lastName,   // ← renommage du champ
        firstName: userData.firstName,
        email: userData.email,
        birthDate: userData.birthDate,
        // zipCode et city sont ignorés par l'API (pas dans UserCreate)
    };

    try {
        const response = await axios.post(`${API_URL}/users`, payload);
        return response.data;
    } catch (error) {
        if (error.response?.status === 422) {
            console.error("Détail 422 :", JSON.stringify(error.response.data.detail, null, 2));
        }
        throw error;
    }
};

/**
 * Récupère la liste des utilisateurs depuis notre API Python au démarrage.
 * @async
 * @function getUsersAPI
 * @returns {Promise<Array<Object>>} La liste des utilisateurs formatée pour le frontend.
 * @throws {Error} Lance une erreur si la récupération échoue.
 */
export const getUsersAPI = async () => {
    try {
        const response = await axios.get(`${API_URL}/users`);
        // On traduit "name" du back vers "lastName" pour que Home.js l'affiche correctement
        return response.data.utilisateurs.map(user => ({
            ...user,
            lastName: user.name
        }));
    } catch (error) {
        console.error("Erreur réseau lors de la récupération des utilisateurs :", error);
        throw error;
    }
};

/**
 * Connecte un utilisateur (admin) et récupère le token JWT.
 * @async
 * @function loginAPI
 * @param {string} email - L'email de l'administrateur
 * @param {string} password - Le mot de passe de l'administrateur
 * @returns {Promise<string>} Le token JWT
 * @throws {Error} Lance une erreur si les identifiants sont invalides ou en cas de problème réseau.
 */
export const loginAPI = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });
        // On retourne uniquement le token depuis l'objet { token: "..." }
        return response.data.token;
    } catch (error) {
        console.error("Erreur réseau lors de la connexion :", error);
        throw error;
    }
};
