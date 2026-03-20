import { registerUserAPI, getUsersAPI, loginAPI } from './api';
import axios from 'axios';

// On simule (mock) intégralement la librairie axios pour ne pas faire de vrais appels réseau
jest.mock('axios');

const port = process.env.REACT_APP_SERVER_PORT || 8000;
const API_URL = `http://${window.location.hostname}:${port}`;

describe('Service API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ==========================================
    // TESTS POUR LE POST (Inscription)
    // ==========================================
    describe('registerUserAPI (POST)', () => {
        it('doit formater les données, appeler axios.post et retourner les données en cas de succès', async () => {
            const mockUserData = { lastName: 'Dupont', firstName: 'Jean', email: 'jean@test.com', birthDate: '2000-01-01' };
            
            // Ce que l'API est censée envoyer (avec `name` au lieu de `lastName`)
            const expectedPayload = { name: 'Dupont', firstName: 'Jean', email: 'jean@test.com', birthDate: '2000-01-01' };
            const mockApiResponse = { data: { id: 11, message: "Utilisateur créé avec succès" } };

            axios.post.mockResolvedValueOnce(mockApiResponse);

            const result = await registerUserAPI(mockUserData);

            expect(axios.post).toHaveBeenCalledWith(`${API_URL}/users`, expectedPayload);
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockApiResponse.data);
        });

        it("doit logguer le détail spécifique si le serveur renvoie une erreur 422 (Unprocessable Entity)", async () => {
            const mockUserData = { lastName: 'Dupont' }; // Il manque des champs pour forcer l'erreur
            const error422 = {
                response: {
                    status: 422,
                    data: { detail: [{ msg: "field required" }] }
                }
            };

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            axios.post.mockRejectedValueOnce(error422);

            // L'erreur doit bien remonter
            await expect(registerUserAPI(mockUserData)).rejects.toEqual(error422);
            
            // Le log doit avoir été affiché formaté
            expect(consoleSpy).toHaveBeenCalledWith("Détail 422 :", JSON.stringify(error422.response.data.detail, null, 2));
            
            consoleSpy.mockRestore();
        });

        it("doit lever une exception si l'API renvoie une erreur (ex: Network Error)", async () => {
            const mockUserData = { firstName: 'Julien', lastName: 'Pradier' };
            const networkError = new Error('Network Error');

            axios.post.mockRejectedValueOnce(networkError);

            await expect(registerUserAPI(mockUserData)).rejects.toThrow('Network Error');
        });
    });

    // ==========================================
    // TESTS POUR LE GET (Récupération liste)
    // ==========================================
    describe('getUsersAPI (GET)', () => {
        it('doit récupérer les données, traduire "name" en "lastName" et retourner la liste', async () => {
            const mockApiResponse = {
                data: {
                    utilisateurs: [
                        { id: 1, name: 'Doe', firstName: 'John', email: 'john@test.com' },
                        { id: 2, name: 'Smith', firstName: 'Jane', email: 'jane@test.com' }
                    ]
                }
            };

            axios.get.mockResolvedValueOnce(mockApiResponse);

            const result = await getUsersAPI();

            expect(axios.get).toHaveBeenCalledWith(`${API_URL}/users`);
            expect(axios.get).toHaveBeenCalledTimes(1);
            
            // On vérifie que la duplication "name" -> "lastName" a bien été effectuée
            expect(result).toEqual([
                { id: 1, name: 'Doe', lastName: 'Doe', firstName: 'John', email: 'john@test.com' },
                { id: 2, name: 'Smith', lastName: 'Smith', firstName: 'Jane', email: 'jane@test.com' }
            ]);
        });

        it("doit lever une exception si la récupération échoue", async () => {
            const networkError = new Error('Network Error');
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            axios.get.mockRejectedValueOnce(networkError);

            await expect(getUsersAPI()).rejects.toThrow('Network Error');
            expect(consoleSpy).toHaveBeenCalledWith("Erreur réseau lors de la récupération des utilisateurs :", networkError);
            
            consoleSpy.mockRestore();
        });
    });

    // ==========================================
    // TESTS POUR LE LOGIN (Connexion Admin)
    // ==========================================
    describe('loginAPI (POST)', () => {
        it('doit envoyer les identifiants et retourner un token JWT', async () => {
            const email = "admin@test.com";
            const password = "password123";
            const mockApiResponse = { data: { token: "mon_super_token_jwt" } };

            axios.post.mockResolvedValueOnce(mockApiResponse);

            const result = await loginAPI(email, password);

            expect(axios.post).toHaveBeenCalledWith(`${API_URL}/login`, { email, password });
            expect(result).toBe("mon_super_token_jwt");
        });

        it('doit lever une erreur si la connexion échoue', async () => {
            const networkError = new Error('Bad credentials');
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            axios.post.mockRejectedValueOnce(networkError);

            await expect(loginAPI("admin@test.com", "wrong")).rejects.toThrow('Bad credentials');
            expect(consoleSpy).toHaveBeenCalledWith("Erreur réseau lors de la connexion :", networkError);

            consoleSpy.mockRestore();
        });
    });
});