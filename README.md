# StudyMate

## Conception et développement d’une plateforme web de gestion et de suivi des sessions d’étude pour les étudiants

StudyMate est une plateforme web permettant aux étudiants d’organiser leurs sessions d’étude, de suivre leurs activités académiques et d’améliorer leur gestion du temps.

Le projet vise à proposer un outil numérique simple et efficace pour aider les étudiants à structurer leur travail personnel et à optimiser leur processus d’apprentissage.

Ce projet s’inscrit dans le cadre d’un **Projet de Fin d’Études en ingénierie informatique**.

---

# Objectifs du projet

L’objectif principal de StudyMate est de concevoir une plateforme permettant aux étudiants de mieux organiser leurs activités d’apprentissage.

Les objectifs spécifiques sont :

- permettre aux utilisateurs de créer et gérer des sessions d’étude
- proposer un tableau de bord pour visualiser les sessions
- mettre en place un système d’authentification sécurisé
- développer une architecture web moderne basée sur une API REST
- faciliter la communication entre le frontend et le backend

---

# Fonctionnalités actuelles

Le projet StudyMate comprend actuellement les fonctionnalités suivantes :

## Authentification utilisateur

- inscription et connexion
- gestion des tokens JWT
- protection des routes sécurisées

## Gestion des sessions d’étude

- création d’une session d’étude
- affichage des sessions dans le tableau de bord
- suppression d’une session

## Tableau de bord

- affichage des sessions de l’utilisateur
- ajout de nouvelles sessions
- visualisation des activités d’étude

---

# Architecture du projet

Le projet est basé sur une architecture **frontend / backend**.

---

# Frontend

Développé avec :

- React.js
- React Router
- Axios
- Tailwind CSS

Le frontend est responsable de :

- l’interface utilisateur
- la navigation entre les pages
- l’envoi des requêtes vers l’API backend

### Structure principale
frontend
├── src
│ ├── components
│ │ ├── CTA.jsx
│ │ ├── EventManager.jsx
│ │ ├── EventModal.jsx
│ │ ├── Features.jsx
│ │ ├── Footer.jsx
│ │ ├── HeroSection.jsx
│ │ ├── Mockup.jsx
│ │ ├── Navbar.jsx
│ │ ├── PrivateRoute.jsx
│ │ ├── Schedule.jsx
│ │ ├── SessionManager.jsx
│ │ ├── Testimonials.jsx
│ │ ├── UserManager.jsx
│
│ ├── pages
│ │ ├── Login.jsx
│ │ ├── LandingPage.jsx
│ │ ├── Profile.jsx
│ │ ├── Register.jsx
│ │ ├── Dashboard.jsx
│
│ ├── services
│ │ ├── api.js
│ │ ├── authService.js
│ │ ├── sessionService.js
│
│ ├── context
│ │ └── AuthContext.jsx
│
│ ├── App.jsx
│ └── main.jsx

---

# Backend

Développé avec :

- Node.js
- Express.js
- Prisma ORM
- JWT pour l’authentification

Le backend est responsable de :

- la gestion des utilisateurs
- la gestion des sessions
- l’authentification
- la communication avec la base de données

### Structure principale
backend
├── controllers
│ ├── authController.js
│ ├── eventController.js
│ ├── userController.js
│ └── sessionController.js
│
├── routes
│ ├── authRoutes.js
│ ├── eventRoutes.js
│ ├── userRoutes.js
│ └── sessionRoutes.js
│
├── middleware
│ └── authMiddleware.js
│
├── prisma
│ └── schema.prisma
│
└── server.js

---

# Technologies utilisées

## Frontend

- React.js
- Axios
- React Router
- Tailwind CSS

## Backend

- Node.js
- Express.js
- Prisma ORM
- JSON Web Token (JWT)

## Base de données

- Base relationnelle gérée avec Prisma

## Outils

- Git
- GitHub
- Visual Studio Code

---

# Installation du projet

## Cloner le projet

```bash
git clone https://github.com/ton-username/studymate.git
cd studymate
```
---
# Installation du backend

```bash
cd backend
npm install
```
---
## Lancer le serveur

```bash
node server.js
```
---
## Le serveur démarre sur:
[http://localhost:3000]

---
# Installation du frontend

```bash
cd frontend
npm install
npm run dev
```
---
## L'application sera accessible sur:
[http://localhost:5173]

---
# API principale
Authentification

POST /auth/register

Créer un utilisateur

POST /auth/login

Connexion utilisateur

---
# Sessions d’étude

GET /sessions/me

Récupérer les sessions de l’utilisateur

POST /sessions

Créer une session

DELETE /sessions/:id

Supprimer une session

---
# Difficultés rencontrées

Plusieurs défis techniques ont été rencontrés durant le développement :
- intégration entre React et l’API backend
- gestion de l’authentification avec JWT
- gestion du token dans les requêtes Axios
- erreurs d’autorisation (401 Unauthorized) lors de l’accès aux routes protégées
Ces difficultés ont permis de mieux comprendre la gestion de la sécurité et de la communication dans une architecture web moderne.

---
# Perspectives d’amélioration

Plusieurs améliorations sont envisagées pour les prochaines versions :
- ajout de statistiques d’apprentissage
- amélioration de l’interface utilisateur
- sessions collaboratives entre étudiants
- intégration d’intelligence artificielle pour proposer des sessions d’étude personnalisées
- développement d’une application mobile

---
# Auteur

Projet réalisé par **ODJO Imtynane** dans le cadre d’un projet de fin d’études en ingénierie informatique.
