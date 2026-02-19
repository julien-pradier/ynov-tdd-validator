# Tests

![Build Status](https://github.com/julien-pradier/ynov-tdd-validator/actions/workflows/build_test_react.yml/badge.svg)
![Codecov](https://codecov.io/gh/julien-pradier/ynov-tdd-validator/branch/main/graph/badge.svg)
![Cypress](https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg)

Ce projet est une application React développée selon la méthode **TDD**.
Il sert de support pour la mise en place d'une chaîne complète d'intégration et de déploiement continu (**CI/CD**).

---

## 🚀 Fonctionnalités CI/CD

Ce dépôt intègre une automatisation complète via **GitHub Actions** :

* **Intégration Continue (CI)** :
  Installation des dépendances, build de l'application et exécution des tests unitaires à chaque push

* **Qualité du Code** :
  Analyse de la couverture de code et envoi automatique du rapport vers **Codecov**

* **Documentation** :
  Génération automatique de la documentation technique (**JSDoc**) incluant ce README.

* **Déploiement Continu (CD)** :
  Déploiement automatique de l'application et de la documentation sur **GitHub Pages**.

---

## 🔗 Liens Utiles

* **Application Déployée** :
  👉 [Voir le site](https://julien-pradier.github.io/ynov-tdd-validator/)

* **Documentation Technique** :
  👉 [Voir la JSDoc](https://julien-pradier.github.io/ynov-tdd-validator/docs/)

* **Rapport Codecov** :
  👉 [Voir le Dashboard](https://app.codecov.io/gh/julien-pradier/ynov-tdd-validator)

---

## 🛠️ Pré-requis

Pour faire tourner ce projet localement, vous avez besoin de :

* **Node.js** (version 20.x ou supérieure recommandée)
* **npm**

---

## 📦 Installation

Clonez le dépôt et installez les dépendances :

```bash
git clone https://github.com/julien-pradier/ynov-tdd-validator.git
cd ynov-tdd-validator
npm ci
```

---

## ▶️ Lancer l'application

Pour démarrer le serveur de développement local :

```bash
npm start
```

L'application sera accessible sur :
👉 [http://localhost:3000](http://localhost:3000)

---

## 🧪 Lancer les tests

Pour exécuter la suite de tests unitaires (**Jest / React Testing Library**) :

```bash
npm test
```

Pour voir la couverture de code en local :

```bash
npm test -- --coverage --watchAll=false
```

---

## 🌲 Lancer les tests E2E (Cypress)

Pour exécuter les tests de bout en bout (End-to-End) avec Cypress :

```bash
npm run cypress
```

Cela ouvrira l'interface graphique de Cypress où vous pourrez sélectionner et lancer les scénarios de test (ex: `navigation.cy.js`).

---

## 📚 Générer la documentation

Pour générer la JSDoc localement (dans le dossier `public/docs`) :

```bash
npm run docs
```

---
