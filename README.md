# Presenter

Présentation markdown visuelle avec application web

## Lancer l'application en local

1. Installez les dépendances :
   ```bash
   npm install
   ```
2. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```
3. Ouvrez votre navigateur à l'adresse indiquée (généralement http://localhost:5173).

## Emplacement des fichiers Markdown

Les fichiers markdown utilisés pour les présentations se trouvent dans le dossier :

- Pour les présentations personnalisées, allez dans `src/presentations/` puis dans le dossier de la présentation souhaitée (ex : `exemple/`).
- Chaque présentation peut contenir plusieurs fichiers markdown (`00_Plan.md`, `01_Formatage_Texte.md`, etc.), un fichier `metadata.json` et dans public le dossier `ressources/`
