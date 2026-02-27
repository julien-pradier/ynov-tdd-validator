"use strict";

var _react = require("@testing-library/react");
var _reactRouterDom = require("react-router-dom");
var _Home = _interopRequireDefault(require("./Home"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// Helper pour rendre le composant avec le Router
const renderWithRouter = component => {
  return (0, _react.render)(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.BrowserRouter, {
    children: component
  }));
};
describe('Home Component', () => {
  test('Affiche le titre et le bouton d\'inscription', () => {
    renderWithRouter(/*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
      users: []
    }));
    expect(_react.screen.getByText(/Bienvenue sur notre application/i)).toBeInTheDocument();
    expect(_react.screen.getByRole('button', {
      name: /Aller s'inscrire/i
    })).toBeInTheDocument();
  });
  test('Affiche 0 utilisateur inscrit par défaut', () => {
    renderWithRouter(/*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
      users: []
    }));
    expect(_react.screen.getByText(/0 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();
    expect(_react.screen.queryByRole('list')).not.toBeInTheDocument();
  });
  test('Affiche la liste des utilisateurs quand il y en a', () => {
    const mockUsers = [{
      firstName: 'John',
      lastName: 'Doe'
    }, {
      firstName: 'Jane',
      lastName: 'Smith'
    }];
    renderWithRouter(/*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
      users: mockUsers
    }));
    expect(_react.screen.getByText(/2 utilisateur\(s\) inscrit\(s\)/i)).toBeInTheDocument();

    // Vérifie que la liste est présente
    const list = _react.screen.getByRole('list');
    expect(list).toBeInTheDocument();

    // Vérifie que les utilisateurs sont affichés
    expect(_react.screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(_react.screen.getByText(/Jane Smith/i)).toBeInTheDocument();
  });
});