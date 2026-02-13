/**
 * Module principal de l'interface utilisateur pour l'Activité 2.
 * @module App
 */

import { useState, useEffect } from 'react';
import { isValidName, isValidEmail, isValidAge, isValidZipCode } from './validator';

/**
 * Composant React gérant le formulaire d'inscription.
 * * Ce composant assure l'intégration de la logique métier de validation,
 * le feedback visuel immédiat en rouge, la gestion de l'état désactivé
 * du bouton et la persistance des données dans le localStorage
 *
 * @component
 * @returns {JSX.Element} Le formulaire d'inscription complet.
 */
export default function App() {
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
    const [showSuccess, setShowSuccess] = useState(false);

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
        setShowSuccess(false);
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
     * Traite la soumission, sauvegarde dans localStorage et réinitialise les champs
     * @function handleSubmit
     * @inner
     * @param {Object} e - L'événement de soumission du formulaire.
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        const currentErrors = validate(formData);

        if (Object.keys(currentErrors).length === 0) {
            localStorage.setItem('user_data', JSON.stringify(formData));
            setShowSuccess(true);
            setFormData({
                lastName: '',
                firstName: '',
                email: '',
                birthDate: '',
                zipCode: '',
                city: ''
            });
            setTouched({});
        }
    };

    /**
     * Détermine si le bouton de soumission doit être désactivé
     */
    const isFormInvalid = Object.keys(errors).length > 0 ||
        Object.values(formData).some(val => val === '');

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Inscription</h1>

            {/* Toaster de succès */}
            {showSuccess && (
                <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '4px' }}>
                    Formulaire sauvegardé avec succès !
                </div>
            )}

            <form onSubmit={handleSubmit}>
                {/* Champ Nom */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="lastName">Nom :</label>
                    <input
                        id="lastName"
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    {touched.lastName && errors.lastName && (
                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.lastName}</span>
                    )}
                </div>

                {/* Champ Prénom */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="firstName">Prénom :</label>
                    <input
                        id="firstName"
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    {touched.firstName && errors.firstName && (
                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.firstName}</span>
                    )}
                </div>

                {/* Champ Email */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email :</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    {touched.email && errors.email && (
                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>
                    )}
                </div>

                {/* Champ Date de naissance*/}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="birthDate">Date de naissance :</label>
                    <input
                        id="birthDate"
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    {touched.birthDate && errors.birthDate && (
                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.birthDate}</span>
                    )}
                </div>

                {/* Champ Code Postal */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="zipCode">Code Postal :</label>
                    <input
                        id="zipCode"
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    {touched.zipCode && errors.zipCode && (
                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.zipCode}</span>
                    )}
                </div>

                {/* Champ Ville */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="city">Ville :</label>
                    <input
                        id="city"
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ display: 'block', width: '100%', padding: '8px' }}
                    />
                    {touched.city && errors.city && (
                        <span style={{ color: 'red', fontSize: '12px' }}>{errors.city}</span>
                    )}
                </div>

                {/* Bouton de soumission*/}
                <button
                    type="submit"
                    disabled={isFormInvalid}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: isFormInvalid ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: isFormInvalid ? 'not-allowed' : 'pointer'
                    }}
                >
                    Envoyer
                </button>
            </form>
        </div>
    );
}