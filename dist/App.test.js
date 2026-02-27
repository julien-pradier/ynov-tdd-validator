"use strict";

var _react = require("@testing-library/react");
var _App = _interopRequireDefault(require("./App"));
var _api = require("./api");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
jest.mock('./Home', () => _ref => {
  let {
    users
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    "data-testid": "home-page",
    children: ["Page d'accueil - ", users.length, " users"]
  });
});
jest.mock('./Register', () => () => /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
  "data-testid": "register-page",
  children: "Page d'inscription"
}));
jest.mock('./api');
describe('App Navigation & Data Loading', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test('Charge les utilisateurs depuis l\'API au démarrage', async () => {
    _api.getUsersAPI.mockResolvedValueOnce([{
      name: 'John Doe',
      email: 'john@test.com'
    }, {
      name: 'Zendaya',
      email: 'zendaya@test.com'
    }]);
    window.history.pushState({}, 'Home', '/');
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText("Page d'accueil - 2 users")).toBeInTheDocument();
    });
    expect(_api.getUsersAPI).toHaveBeenCalledTimes(1);
  });
  test('Gère le cas où l\'API échoue (affiche 0 utilisateur)', async () => {
    _api.getUsersAPI.mockRejectedValueOnce(new Error("Network Error"));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    window.history.pushState({}, 'Home', '/');
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByText("Page d'accueil - 0 users")).toBeInTheDocument();
    });
    consoleSpy.mockRestore();
  });
  test('Navigue vers la page d\'inscription', async () => {
    _api.getUsersAPI.mockResolvedValueOnce([]);
    window.history.pushState({}, 'Register', '/register');
    (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {}));
    await (0, _react.waitFor)(() => {
      expect(_react.screen.getByTestId('register-page')).toBeInTheDocument();
    });
  });
});