"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Home;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @module Home
 * @description Page d'accueil de l'application.
 * Affiche le nombre d'utilisateurs inscrits et la liste de leurs noms.
 */

/**
 * Composant Home.
 * Affiche un message de bienvenue, un compteur d'utilisateurs et la liste des inscrits.
 * Propose un lien vers la page d'inscription.
 *
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {Array<Object>} props.users - La liste des utilisateurs inscrits. Chaque utilisateur doit avoir au moins {firstName, lastName}.
 * @returns {JSX.Element} La page d'accueil rendue.
 */function Home(_ref) {
  let {
    users
  } = _ref;
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    style: {
      padding: '20px',
      maxWidth: '600px',
      margin: '0 auto',
      textAlign: 'center'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Bienvenue sur notre application"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("h2", {
      "data-cy": "counter",
      children: [users.length, " utilisateur(s) inscrit(s)"]
    }), users.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
      "data-cy": "user-list",
      style: {
        listStyleType: 'none',
        padding: 0
      },
      children: users.map((user, index) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("li", {
        style: {
          margin: '10px 0',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px'
        },
        children: [user.firstName, " ", user.lastName]
      }, index))
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      style: {
        marginTop: '30px'
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Link, {
        to: "/register",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
          "data-cy": "nav-register",
          style: {
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          },
          children: "Aller s'inscrire"
        })
      })
    })]
  });
}