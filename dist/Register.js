"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Register;
var _react = require("react");
var _reactRouterDom = require("react-router-dom");
var _validator = require("./validator");
var _api = require("./api");
var _jsxRuntime = require("react/jsx-runtime");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); } /**
 * @module Register
 * @description Page d'inscription de l'application.
 * Contient le formulaire d'inscription avec validation en temps réel et gestion des erreurs.
 */ /**
 * Composant Register.
 * Gère le formulaire d'inscription, la validation des champs, l'affichage des erreurs et la soumission.
 * Redirige vers la page d'accueil après une inscription réussie.
 *
 * @component
 * @param {Object} props - Les propriétés du composant.
 * @param {Array<Object>} props.users - La liste actuelle des utilisateurs (pour l'ajout).
 * @param {Function} props.setUsers - Fonction pour mettre à jour la liste des utilisateurs.
 * @returns {JSX.Element} Le formulaire d'inscription rendu.
 */
function Register(_ref) {
  let {
    users,
    setUsers
  } = _ref;
  const navigate = (0, _reactRouterDom.useNavigate)();
  const [formData, setFormData] = (0, _react.useState)({
    lastName: '',
    firstName: '',
    email: '',
    birthDate: '',
    zipCode: '',
    city: ''
  });
  const [errors, setErrors] = (0, _react.useState)({});
  const [touched, setTouched] = (0, _react.useState)({});
  const [apiError, setApiError] = (0, _react.useState)('');

  /**
   * Valide l'intégralité des champs du formulaire en utilisant le module validator.
   * @function validate
   * @inner
   * @param {Object} values - Les données actuelles du formulaire.
   * @returns {Object} Un objet contenant les messages d'erreur par champ.
   */
  const validate = values => {
    const newErrors = {};
    try {
      (0, _validator.isValidName)(values.lastName);
    } catch (e) {
      newErrors.lastName = e.message;
    }
    try {
      (0, _validator.isValidName)(values.firstName);
    } catch (e) {
      newErrors.firstName = e.message;
    }
    try {
      (0, _validator.isValidEmail)(values.email);
    } catch (e) {
      newErrors.email = e.message;
    }
    try {
      (0, _validator.isValidZipCode)(values.zipCode);
    } catch (e) {
      newErrors.zipCode = e.message;
    }
    try {
      if (!values.city) throw new Error("La ville est requise");
      (0, _validator.isValidName)(values.city);
    } catch (e) {
      newErrors.city = e.message;
    }
    try {
      if (!values.birthDate) throw new Error("Date requise");
      (0, _validator.isValidAge)(new Date(values.birthDate));
    } catch (e) {
      newErrors.birthDate = e.message;
    }
    return newErrors;
  };

  /**
   * Effectue la validation à chaque modification des données du formulaire.
   */
  (0, _react.useEffect)(() => {
    const currentErrors = validate(formData);
    setErrors(currentErrors);
  }, [formData]);

  /**
   * Gère la mise à jour des données du formulaire lors de la saisie utilisateur.
   * @function handleChange
   * @inner
   * @param {Object} e - L'événement de changement du DOM.
   */
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [name]: value
    }));
  };

  /**
   * Marque un champ comme "touché" lors du focus out pour déclencher l'affichage de l'erreur
   * @function handleBlur
   * @inner
   * @param {Object} e - L'événement de perte de focus (blur).
   */
  const handleBlur = e => {
    const {
      name
    } = e.target;
    setTouched(prev => _objectSpread(_objectSpread({}, prev), {}, {
      [name]: true
    }));
  };

  /**
   * Traite la soumission, ajoute l'utilisateur et redirige vers l'accueil.
   * @function handleSubmit
   * @inner
   * @param {Object} e - L'événement de soumission du formulaire.
   */
  const handleSubmit = async e => {
    e.preventDefault();
    setApiError('');
    const currentErrors = validate(formData);
    if (Object.keys(currentErrors).length === 0) {
      try {
        const newUser = await (0, _api.registerUserAPI)(formData);
        setUsers([...users, newUser]);
        navigate('/');
      } catch (error) {
        console.error("Erreur d'inscription:", error);

        // --- GESTION DE L'ERREUR MÉTIER 400 ---
        if (error.response && error.response.status === 400) {
          setApiError("Cet email existe déjà.");
        } else {
          // Pour toutes les autres erreurs (ex: 500 Crash Serveur)
          setApiError('Une erreur réseau est survenue. Veuillez réessayer.');
        }
      }
    }
  };
  const isFormInvalid = Object.keys(errors).length > 0 || Object.values(formData).some(val => val === '');
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    style: {
      padding: '20px',
      maxWidth: '500px',
      margin: '0 auto'
    },
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Inscription"
    }), apiError && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      style: {
        color: 'white',
        backgroundColor: '#dc3545',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '15px'
      },
      children: apiError
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
      "data-testid": "register-form",
      onSubmit: handleSubmit,
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          marginBottom: '15px'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "lastName",
          children: "Nom :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "lastName",
          type: "text",
          name: "lastName",
          "data-cy": "input-lastName",
          value: formData.lastName,
          onChange: handleChange,
          onBlur: handleBlur,
          style: {
            display: 'block',
            width: '100%',
            padding: '8px'
          }
        }), touched.lastName && errors.lastName && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-cy": "error-lastName",
          style: {
            color: 'red',
            fontSize: '12px'
          },
          children: errors.lastName
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          marginBottom: '15px'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "firstName",
          children: "Pr\xE9nom :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "firstName",
          type: "text",
          name: "firstName",
          "data-cy": "input-firstName",
          value: formData.firstName,
          onChange: handleChange,
          onBlur: handleBlur,
          style: {
            display: 'block',
            width: '100%',
            padding: '8px'
          }
        }), touched.firstName && errors.firstName && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-cy": "error-firstName",
          style: {
            color: 'red',
            fontSize: '12px'
          },
          children: errors.firstName
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          marginBottom: '15px'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "email",
          children: "Email :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "email",
          type: "email",
          name: "email",
          "data-cy": "input-email",
          value: formData.email,
          onChange: handleChange,
          onBlur: handleBlur,
          style: {
            display: 'block',
            width: '100%',
            padding: '8px'
          }
        }), touched.email && errors.email && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-cy": "error-email",
          style: {
            color: 'red',
            fontSize: '12px'
          },
          children: errors.email
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          marginBottom: '15px'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "birthDate",
          children: "Date de naissance :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "birthDate",
          type: "date",
          name: "birthDate",
          "data-cy": "input-birthDate",
          value: formData.birthDate,
          onChange: handleChange,
          onBlur: handleBlur,
          style: {
            display: 'block',
            width: '100%',
            padding: '8px'
          }
        }), touched.birthDate && errors.birthDate && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-cy": "error-birthDate",
          style: {
            color: 'red',
            fontSize: '12px'
          },
          children: errors.birthDate
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          marginBottom: '15px'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "zipCode",
          children: "Code Postal :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "zipCode",
          type: "text",
          name: "zipCode",
          "data-cy": "input-zipCode",
          value: formData.zipCode,
          onChange: handleChange,
          onBlur: handleBlur,
          style: {
            display: 'block',
            width: '100%',
            padding: '8px'
          }
        }), touched.zipCode && errors.zipCode && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-cy": "error-zipCode",
          style: {
            color: 'red',
            fontSize: '12px'
          },
          children: errors.zipCode
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
        style: {
          marginBottom: '15px'
        },
        children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
          htmlFor: "city",
          children: "Ville :"
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
          id: "city",
          type: "text",
          name: "city",
          "data-cy": "input-city",
          value: formData.city,
          onChange: handleChange,
          onBlur: handleBlur,
          style: {
            display: 'block',
            width: '100%',
            padding: '8px'
          }
        }), touched.city && errors.city && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
          "data-cy": "error-city",
          style: {
            color: 'red',
            fontSize: '12px'
          },
          children: errors.city
        })]
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
        type: "submit",
        "data-cy": "submit-btn",
        disabled: isFormInvalid,
        style: {
          padding: '10px 20px',
          backgroundColor: isFormInvalid ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          cursor: isFormInvalid ? 'not-allowed' : 'pointer'
        },
        children: "Envoyer"
      })]
    })]
  });
}