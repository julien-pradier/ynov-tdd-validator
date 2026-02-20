import { registerUserAPI } from './api';
import axios from 'axios';

// On simule (mock) intégralement la librairie axios pour ne pas faire de vrais appels réseau
jest.mock('axios');

describe('Service API - registerUserAPI', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Réinitialise les compteurs entre chaque test
    });

    it('doit appeler axios.post et retourner les données en cas de succès', async () => {
        // 1. Préparation des fausses données
        const mockUserData = { firstName: 'Julien', lastName: 'Pradier' };
        const mockApiResponse = { data: { id: 11, ...mockUserData } };

        // 2. Configuration du Mock pour simuler une réponse 200 OK du serveur
        axios.post.mockResolvedValueOnce(mockApiResponse);

        // 3. Exécution de la fonction
        const result = await registerUserAPI(mockUserData);

        // 4. Vérifications (Assertions)
        expect(axios.post).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users', mockUserData);
        expect(axios.post).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockApiResponse.data);
    });

    it("doit lever une exception si l'API renvoie une erreur (ex: Network Error)", async () => {
        const mockUserData = { firstName: 'Julien', lastName: 'Pradier' };
        const networkError = new Error('Network Error');

        // Pour garder la console propre pendant les tests, on masque l'erreur prévue
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        // Configuration du Mock pour simuler une erreur (rejet de la promesse)
        axios.post.mockRejectedValueOnce(networkError);

        // On vérifie que notre fonction laisse bien remonter l'erreur
        await expect(registerUserAPI(mockUserData)).rejects.toThrow('Network Error');

        // On restaure le comportement normal de la console
        consoleSpy.mockRestore();
    });
});