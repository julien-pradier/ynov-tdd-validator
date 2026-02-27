"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = App;
var _react = require("react");
var _reactRouterDom = require("react-router-dom");
var _Home = _interopRequireDefault(require("./Home"));
var _Register = _interopRequireDefault(require("./Register"));
var _api = require("./api");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @module App
 * @description Composant racine de l'application.
 * Gère le routing (navigation) entre les pages et la récupération des données via API.
 */

/**
 * Composant principal de l'application.
 * Initialise l'état des utilisateurs depuis l'API et configure les routes.
 */function App() {
  const [users, setUsers] = (0, _react.useState)([]);
  (0, _react.useEffect)(() => {
    const fetchInitialUsers = async () => {
      try {
        const apiUsers = await (0, _api.getUsersAPI)();
        // JSONPlaceholder renvoie { name: "Leanne Graham" }. On l'adapte à notre format.
        const formattedUsers = apiUsers.map(user => ({
          firstName: user.name.split(' ')[0],
          lastName: user.name.split(' ')[1] || '',
          email: user.email
        }));
        setUsers(formattedUsers);
      } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs", error);
        setUsers([]);
      }
    };
    fetchInitialUsers();
  }, []);
  const basename = process.env.PUBLIC_URL || '/';
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.BrowserRouter, {
    basename: basename,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "App",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactRouterDom.Routes, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
          path: "/",
          element: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Home.default, {
            users: users
          })
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
          path: "/register",
          element: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Register.default, {
            users: users,
            setUsers: setUsers
          })
        })]
      })
    })
  });
}