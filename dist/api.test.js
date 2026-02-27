"use strict";

var _api = require("./api");
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
      const mockUserData = {
        firstName: 'Dupont',
        lastName: 'Dupond'
      };
      const mockApiResponse = {
        data: _objectSpread({
          id: 11
        }, mockUserData)
      };

      // 2. Configuration du Mock pour simuler une réponse 200 OK du serveur
      _axios.default.post.mockResolvedValueOnce(mockApiResponse);

      // 3. Exécution de la fonction
      const result = await (0, _api.registerUserAPI)(mockUserData);

      // 4. Vérifications
      expect(_axios.default.post).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users', mockUserData);
      expect(_axios.default.post).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockApiResponse.data);
    });
    it("doit lever une exception si l'API renvoie une erreur (ex: Network Error)", async () => {
      const mockUserData = {
        firstName: 'Julien',
        lastName: 'Pradier'
      };
      const networkError = new Error('Network Error');

      // Pour garder la console propre pendant les tests, on masque l'erreur prévue
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      // Configuration du Mock pour simuler une erreur
      _axios.default.post.mockRejectedValueOnce(networkError);

      // On vérifie que notre fonction laisse bien remonter l'erreur
      await expect((0, _api.registerUserAPI)(mockUserData)).rejects.toThrow('Network Error');

      // On restaure le comportement normal de la console
      consoleSpy.mockRestore();
    });
  });

  // ==========================================
  // TESTS POUR LE GET (Récupération liste)
  // ==========================================
  describe('getUsersAPI (GET)', () => {
    it('doit appeler axios.get et retourner la liste des utilisateurs', async () => {
      const mockUsers = [{
        id: 1,
        name: 'John Doe',
        email: 'john@test.com'
      }, {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@test.com'
      }];
      _axios.default.get.mockResolvedValueOnce({
        data: mockUsers
      });
      const result = await (0, _api.getUsersAPI)();
      expect(_axios.default.get).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users');
      expect(_axios.default.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });
    it("doit lever une exception si la récupération échoue", async () => {
      const networkError = new Error('Network Error');
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      _axios.default.get.mockRejectedValueOnce(networkError);
      await expect((0, _api.getUsersAPI)()).rejects.toThrow('Network Error');
      consoleSpy.mockRestore();
    });
  });
});