import { useState } from 'react';

export default function App() {
    // Juste les champs, pas de logique de validation pour l'instant
    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        birthDate: '',
        zipCode: '',
        city: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <h1>Inscription</h1>
            <form>
                {/* Structure visuelle uniquement */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="lastName">Nom :</label>
                    <input id="lastName" type="text" name="lastName" value={formData.lastName} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="firstName">Prénom :</label>
                    <input id="firstName" type="text" name="firstName" value={formData.firstName} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="email">Email :</label>
                    <input id="email" type="email" name="email" value={formData.email} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="birthDate">Date de naissance :</label>
                    <input id="birthDate" type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="zipCode">Code Postal :</label>
                    <input id="zipCode" type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="city">Ville :</label>
                    <input id="city" type="text" name="city" value={formData.city} onChange={handleChange} style={{ display: 'block', width: '100%', padding: '8px' }} />
                </div>
                <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none' }}>Envoyer</button>
            </form>
        </div>
    );
}