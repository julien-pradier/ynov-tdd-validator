"use strict";

var _react = require("@testing-library/react");
var _Register = _interopRequireDefault(require("./Register"));
var _api = require("./api");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } // Mock de react-router-dom pour simuler useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => _objectSpread(_objectSpread({}, jest.requireActual('react-router-dom')), {}, {
  useNavigate: () => mockNavigate
}));

// Mock du module API pour isoler le composant du réseau
jest.mock('./api');
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
const renderRegister = () => {
  const mockSetUsers = jest.fn();
  const mockUsers = [];
  return _objectSpread(_objectSpread({}, (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_Register.default, {
    users: mockUsers,
    setUsers: mockSetUsers
  }))), {}, {
    mockSetUsers,
    mockUsers
  });
};
describe('Integration Tests - Inscription Form', () => {
  test('UI Initial : Le formulaire affiche tous les champs et le bouton est désactivé', () => {
    renderRegister();
    expect(_react.screen.getByLabelText(/^Nom :/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Prénom :/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Email :/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Date de naissance :/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Code Postal :/i)).toBeInTheDocument();
    expect(_react.screen.getByLabelText(/Ville :/i)).toBeInTheDocument();
    const submitButton = _react.screen.getByRole('button', {
      name: /Envoyer/i
    });
    expect(submitButton).toBeDisabled();
  });
  test('Soumission réussie avec appel API simulé', async () => {
    const {
      mockSetUsers,
      mockUsers
    } = renderRegister();
    const majorYear = new Date().getFullYear() - 20;
    _react.fireEvent.change(_react.screen.getByLabelText(/^Nom :/i), {
      target: {
        value: 'Doe'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Prénom :/i), {
      target: {
        value: 'John'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Email :/i), {
      target: {
        value: 'john.doe@test.com'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Date de naissance :/i), {
      target: {
        value: "".concat(majorYear, "-01-01")
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Code Postal :/i), {
      target: {
        value: '75001'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Ville :/i), {
      target: {
        value: 'Paris'
      }
    });
    const submitButton = _react.screen.getByRole('button', {
      name: /Envoyer/i
    });
    await (0, _react.waitFor)(() => expect(submitButton).toBeEnabled());
    const mockApiResponse = {
      id: 11,
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@test.com',
      birthDate: "".concat(majorYear, "-01-01"),
      zipCode: '75001',
      city: 'Paris'
    };
    _api.registerUserAPI.mockResolvedValueOnce(mockApiResponse);
    _react.fireEvent.submit(_react.screen.getByTestId('register-form'));
    await (0, _react.waitFor)(() => {
      expect(_api.registerUserAPI).toHaveBeenCalledTimes(1);
    });
    expect(_api.registerUserAPI).toHaveBeenCalledWith({
      lastName: 'Doe',
      firstName: 'John',
      email: 'john.doe@test.com',
      birthDate: "".concat(majorYear, "-01-01"),
      zipCode: '75001',
      city: 'Paris'
    });
    await (0, _react.waitFor)(() => {
      expect(mockSetUsers).toHaveBeenCalledTimes(1);
    });
    expect(mockSetUsers).toHaveBeenCalledWith([...mockUsers, mockApiResponse]);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  test('Affiche une erreur réseau générale si l\'API échoue (Erreur 500)', async () => {
    const {
      mockSetUsers
    } = renderRegister();
    const majorYear = new Date().getFullYear() - 20;
    _react.fireEvent.change(_react.screen.getByLabelText(/^Nom :/i), {
      target: {
        value: 'Doe'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Prénom :/i), {
      target: {
        value: 'John'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Email :/i), {
      target: {
        value: 'john.doe@test.com'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Date de naissance :/i), {
      target: {
        value: "".concat(majorYear, "-01-01")
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Code Postal :/i), {
      target: {
        value: '75001'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Ville :/i), {
      target: {
        value: 'Paris'
      }
    });
    const submitButton = _react.screen.getByRole('button', {
      name: /Envoyer/i
    });
    await (0, _react.waitFor)(() => expect(submitButton).toBeEnabled());
    _api.registerUserAPI.mockRejectedValueOnce(new Error('Network Error'));
    _react.fireEvent.submit(_react.screen.getByTestId('register-form'));
    await (0, _react.waitFor)(() => {
      expect(_api.registerUserAPI).toHaveBeenCalledTimes(1);
    });
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText('Une erreur réseau est survenue. Veuillez réessayer.')).toBeInTheDocument();
    });
    expect(mockSetUsers).not.toHaveBeenCalled();
  });
  test('Affiche une erreur spécifique si l\'email existe déjà (Erreur Métier 400)', async () => {
    const {
      mockSetUsers
    } = renderRegister();
    const majorYear = new Date().getFullYear() - 20;
    _react.fireEvent.change(_react.screen.getByLabelText(/^Nom :/i), {
      target: {
        value: 'Doe'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Prénom :/i), {
      target: {
        value: 'John'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Email :/i), {
      target: {
        value: 'existant@test.com'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Date de naissance :/i), {
      target: {
        value: "".concat(majorYear, "-01-01")
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Code Postal :/i), {
      target: {
        value: '75001'
      }
    });
    _react.fireEvent.change(_react.screen.getByLabelText(/Ville :/i), {
      target: {
        value: 'Paris'
      }
    });
    const submitButton = _react.screen.getByRole('button', {
      name: /Envoyer/i
    });
    await (0, _react.waitFor)(() => expect(submitButton).toBeEnabled());
    const mockError400 = {
      response: {
        status: 400,
        data: {
          message: "Email already exists"
        }
      }
    };
    _api.registerUserAPI.mockRejectedValueOnce(mockError400);
    _react.fireEvent.submit(_react.screen.getByTestId('register-form'));
    await (0, _react.waitFor)(() => {
      expect(_api.registerUserAPI).toHaveBeenCalledTimes(1);
    });
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText('Cet email existe déjà.')).toBeInTheDocument();
    });
    expect(mockSetUsers).not.toHaveBeenCalled();
  });
  test('Affiche les messages d\'erreur sous les champs lorsqu\'ils sont touchés et invalides', async () => {
    renderRegister();
    const inputs = [_react.screen.getByLabelText(/^Nom :/i), _react.screen.getByLabelText(/Prénom :/i), _react.screen.getByLabelText(/Email :/i), _react.screen.getByLabelText(/Date de naissance :/i), _react.screen.getByLabelText(/Code Postal :/i), _react.screen.getByLabelText(/Ville :/i)];
    inputs.forEach(input => {
      _react.fireEvent.blur(input);
    });
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText("La ville est requise")).toBeInTheDocument();
    });
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText("Date requise")).toBeInTheDocument();
    });
  });
  test('Sécurité : Tentative de soumission forcée avec formulaire invalide', () => {
    const {
      mockSetUsers
    } = renderRegister();
    _react.fireEvent.submit(_react.screen.getByTestId('register-form'));
    expect(_api.registerUserAPI).not.toHaveBeenCalled();
    expect(mockSetUsers).not.toHaveBeenCalled();
  });
});