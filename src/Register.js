import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { isValidName, isValidEmail, isValidAge, isValidZipCode } from './validator';

export default function Register({ users, setUsers }) {
    const navigate = useNavigate(); // Hook pour la redirection

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

    useEffect(() => {
        const currentErrors = validate(formData);
        setErrors(currentErrors);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentErrors = validate(formData);

        if (Object.keys(currentErrors).length === 0) {
            // On ajoute le nouvel utilisateur au tableau existant
            setUsers([...users, formData]);

            // On redirige automatiquement vers la page d'accueil !
            navigate('/');
        }
    };

    const isFormInvalid = Object.keys(errors).length > 0 ||
        Object.values(formData).some(val => val === '');

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Inscription</h1>

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