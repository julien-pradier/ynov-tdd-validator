import { registerUserAPI, getUsersAPI } from './api';
import axios from 'axios';

// On simule (mock) intégralement la librairie axios pour ne pas faire de vrais appels réseau
jest.mock('axios');

describe('Service API', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    // ==========================================
    // TESTS POUR LE POST (Inscription)
    // ==========================================
    describe('registerUserAPI (POST)', () => {
        it('doit appeler axios.post et retourner les données en cas de succès', async () => {
            // 1. Préparation des fausses données
            const mockUserData = { firstName: 'Dupont', lastName: 'Dupond' };
            const mockApiResponse = { data: { id: 11, ...mockUserData } };

            // 2. Configuration du Mock pour simuler une réponse 200 OK du serveur
            axios.post.mockResolvedValueOnce(mockApiResponse);

            // 3. Exécution de la fonction
            const result = await registerUserAPI(mockUserData);

            // 4. Vérifications
            expect(axios.post).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users', mockUserData);
            expect(axios.post).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockApiResponse.data);
        });

        it("doit lever une exception si l'API renvoie une erreur (ex: Network Error)", async () => {
            const mockUserData = { firstName: 'Julien', lastName: 'Pradier' };
            const networkError = new Error('Network Error');

            // Pour garder la console propre pendant les tests, on masque l'erreur prévue
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            // Configuration du Mock pour simuler une erreur
            axios.post.mockRejectedValueOnce(networkError);

            // On vérifie que notre fonction laisse bien remonter l'erreur
            await expect(registerUserAPI(mockUserData)).rejects.toThrow('Network Error');

            // On restaure le comportement normal de la console
            consoleSpy.mockRestore();
        });
    });

    // ==========================================
    // TESTS POUR LE GET (Récupération liste)
    // ==========================================
    describe('getUsersAPI (GET)', () => {
        it('doit appeler axios.get et retourner la liste des utilisateurs', async () => {
            const mockUsers = [
                { id: 1, name: 'John Doe', email: 'john@test.com' },
                { id: 2, name: 'Jane Doe', email: 'jane@test.com' }
            ];

            axios.get.mockResolvedValueOnce({ data: mockUsers });

            const result = await getUsersAPI();

            expect(axios.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
            expect(axios.get).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockUsers);
        });

        it("doit lever une exception si la récupération échoue", async () => {
            const networkError = new Error('Network Error');

            const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

            axios.get.mockRejectedValueOnce(networkError);

            await expect(getUsersAPI()).rejects.toThrow('Network Error');

            consoleSpy.mockRestore();
        });
    });
});