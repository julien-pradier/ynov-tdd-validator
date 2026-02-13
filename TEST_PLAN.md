# Plan de Test

## 1. Stratégie globale

**Approche utilisée :**
TDD (Test Driven Development)

**Environnement :**
Jest & React Testing Library

---

## 2. Tests Unitaires (UT)

**Cible :** `validator.js`

**But :** Valider la logique métier pure, les calculs et la protection contre les données malformées.

### 2.1 Logique de calcul (Age)

* **UT-01 - Calcul d'âge précis :** Vérification de l'âge au jour près (cas de l'anniversaire demain).
* **UT-02 - Gestion des erreurs de type :** Rejet si `null`, `undefined` ou si le paramètre n'est pas un objet `Date`.
* **UT-03 - Cas limites temporels :** Rejet des dates dans le futur ou des dates invalides (`Invalid Date`).

### 2.2 Règles Métiers (Âge légal)

* **UT-04 - Majorité légale :** Validation si l'utilisateur a 18 ans ou plus.
* **UT-05 - Utilisateur mineur :** Déclenchement d'une erreur si l'âge est inférieur à 18 ans.

### 2.3 Validation Textuelle & Sécurité

* **UT-06 - Identité & Sécurité :** Rejet des chiffres et des balises HTML pour les champs textuels (Nom, Prénom, Ville) - protection XSS simple.

### 2.4 Formats Spécifiques

* **UT-07 - Code Postal :** Format strict de 5 chiffres uniquement.
* **UT-08 - Email :** Format standard (présence de l'arobase, domaine et extension).

### 2.5 Validation Globale (Modèle métier)

* **UT-09 - Profil complet :** Validation d'un objet métier contenant les champs principaux (retourne un booléen simple).

---

## 3. Tests d’Intégration (IT)

**Cible :** `App.js`

**But :** Simuler un utilisateur réel et vérifier la communication entre l'UI et le validateur.

### 3.1 UI & Feedback Visuel

* **IT-01 - État initial :** Vérification de la présence des 6 champs et du bouton désactivé.
* **IT-02 - Scénario "Chaotique" :** Cycle complet
  Saisie invalide → Feedback erreur → Correction → Disparition erreur → Nouvelle erreur.
* **IT-03 - Couverture des branches (Erreurs) :**

    * Nom/Prénom avec chiffres
    * Utilisateur mineur (calcul dynamique)
    * Code postal avec lettres
    * Ville avec caractères interdits

### 3.2 Soumission & Persistance

* **IT-04 - Happy Path (Succès) :**

    * Activation du bouton après saisie valide
    * Appel à `localStorage.setItem` avec les bonnes données (vérifié via `jest.spyOn`)
    * Affichage du message de succès (Toaster)
    * Réinitialisation (Reset) du formulaire

* **IT-05 - Sécurité (Bypass) :**
  Vérification qu'une tentative de soumission forcée sur un formulaire invalide ne déclenche aucun effet de bord (pas d'appel au stockage).

---

## 4. Responsabilités (UT vs IT)

| Élément testé                    | UT| IT |
| -------------------------------- | - | -- |
| Calcul précis de l'âge           | ✅ | ❌  |
| Validation majorité (18+)        | ✅ | ❌  |
| Sécurité XSS (Regex texte)       | ✅ | ❌  |
| Visibilité des erreurs (Rouge)   | ❌ | ✅  |
| Activation/Désactivation bouton  | ❌ | ✅  |
| Persistance (LocalStorage)       | ❌ | ✅  |
| Reset du formulaire après succès | ❌ | ✅  |

---

## 5. Critères de succès

* **Exécution :** 100% des tests passent (`npm test`).
* **Couverture :** 100% des lignes testées sur `App.js` et `validator.js`.
* **Documentation :** JSDoc générée et complète pour l'ensemble du module.
