/**
 * @module Register
 * @description Page d'inscription de l'application.
 * Contient le formulaire d'inscription avec validation en temps réel et gestion des erreurs.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidName, isValidEmail, isValidAge, isValidZipCode } from './validator';
import { registerUserAPI } from './api';

/**
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
export default function Register({ users, setUsers }) {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        birthDate: '',
        zipCode: '',
        city: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [apiError, setApiError] = useState('');

    /**
     * Valide l'intégralité des champs du formulaire en utilisant le module validator.
     * @function validate
     * @inner
     * @param {Object} values - Les données actuelles du formulaire.
     * @returns {Object} Un objet contenant les messages d'erreur par champ.
     */
    const validate = (values) => {
        const newErrors = {};
        try { isValidName(values.lastName); } catch (e) { newErrors.lastName = e.message; }
        try { isValidName(values.firstName); } catch (e) { newErrors.firstName = e.message; }
        try { isValidEmail(values.email); } catch (e) { newErrors.email = e.message; }
        try { isValidZipCode(values.zipCode); } catch (e) { newErrors.zipCode = e.message; }

        try {
            if (!values.city) throw new Error("La ville est requise");
            isValidName(values.city);
        } catch (e) { newErrors.city = e.message; }

        try {
            if (!values.birthDate) throw new Error("Date requise");
            isValidAge(new Date(values.birthDate));
        } catch (e) { newErrors.birthDate = e.message; }

        return newErrors;
    };

    /**
     * Effectue la validation à chaque modification des données du formulaire.
     */
    useEffect(() => {
        const currentErrors = validate(formData);
        setErrors(currentErrors);
    }, [formData]);

    /**
     * Gère la mise à jour des données du formulaire lors de la saisie utilisateur.
     * @function handleChange
     * @inner
     * @param {Object} e - L'événement de changement du DOM.
     */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    /**
     * Marque un champ comme "touché" lors du focus out pour déclencher l'affichage de l'erreur
     * @function handleBlur
     * @inner
     * @param {Object} e - L'événement de perte de focus (blur).
     */
    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    /**
     * Traite la soumission, ajoute l'utilisateur et redirige vers l'accueil.
     * @function handleSubmit
     * @inner
     * @param {Object} e - L'événement de soumission du formulaire.
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');

        const currentErrors = validate(formData);

        if (Object.keys(currentErrors).length === 0) {
            try {
                const newUser = await registerUserAPI(formData);
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

    const isFormInvalid = Object.keys(errors).length > 0 ||
        Object.values(formData).some(val => val === '');

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Inscription</h1>

            {/* Affichage des erreurs réseau ou métier si l'API échoue */}
            {apiError && (
                <div style={{ color: 'white', backgroundColor: '#dc3545', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                    {apiError}
                </div>
            )}

            <form data-testid="register-form" onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="lastName">Nom :</label>
                    <input id="lastName" type="text" name="lastName" data-cy="input-lastName" value={formData.lastName} onChange={handleChange} onBlur={handleBlur} style={{ display: 'block', width: '100%', padding: '8px' }} />
                    {touched.lastName && errors.lastName && <span data-cy="error-lastName" style={{ color: 'red', fontSize: '12px' }}>{errors.lastName}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="firstName">Prénom :</label>
                    <input id="firstName" type="text" name="firstName" data-cy="input-firstName" value={formData.firstName} onChange={handleChange} onBlur={handleBlur} style={{ display: 'block', width: '100%', padding: '8px' }} />
                    {touched.firstName && errors.firstName && <span data-cy="error-firstName" style={{ color: 'red', fontSize: '12px' }}>{errors.firstName}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email :</label>
                    <input id="email" type="email" name="email" data-cy="input-email" value={formData.email} onChange={handleChange} onBlur={handleBlur} style={{ display: 'block', width: '100%', padding: '8px' }} />
                    {touched.email && errors.email && <span data-cy="error-email" style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="birthDate">Date de naissance :</label>
                    <input id="birthDate" type="date" name="birthDate" data-cy="input-birthDate" value={formData.birthDate} onChange={handleChange} onBlur={handleBlur} style={{ display: 'block', width: '100%', padding: '8px' }} />
                    {touched.birthDate && errors.birthDate && <span data-cy="error-birthDate" style={{ color: 'red', fontSize: '12px' }}>{errors.birthDate}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="zipCode">Code Postal :</label>
                    <input id="zipCode" type="text" name="zipCode" data-cy="input-zipCode" value={formData.zipCode} onChange={handleChange} onBlur={handleBlur} style={{ display: 'block', width: '100%', padding: '8px' }} />
                    {touched.zipCode && errors.zipCode && <span data-cy="error-zipCode" style={{ color: 'red', fontSize: '12px' }}>{errors.zipCode}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="city">Ville :</label>
                    <input id="city" type="text" name="city" data-cy="input-city" value={formData.city} onChange={handleChange} onBlur={handleBlur} style={{ display: 'block', width: '100%', padding: '8px' }} />
                    {touched.city && errors.city && <span data-cy="error-city" style={{ color: 'red', fontSize: '12px' }}>{errors.city}</span>}
                </div>

                <button type="submit" data-cy="submit-btn" disabled={isFormInvalid} style={{ padding: '10px 20px', backgroundColor: isFormInvalid ? '#ccc' : '#007bff', color: 'white', border: 'none', cursor: isFormInvalid ? 'not-allowed' : 'pointer' }}>
                    Envoyer
                </button>
            </form>
        </div>
    );
}