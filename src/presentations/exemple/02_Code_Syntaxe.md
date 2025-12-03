# Code et coloration syntaxique

durée : 5min

## Blocs de code simples

Utilisez trois backticks pour créer des blocs de code :

```text
Ceci est un bloc de code simple
sans coloration syntaxique
```

> \`\`\`text
>
> Ceci est un bloc de code simple
>
> sans coloration syntaxique
>
> \`\`\`

## Blocs de code colorisé

Pour avoir la coloration syntaxique il faut mettre le nom du langage souhaité à côté des 3 premières backquote.

**Exemple:** ```javascript

**Résultat :**

```javascript
// Fonction pour calculer la somme
function sum(a, b) {
  return a + b;
}
```

Pour la liste des langage supporté voir : [lien](https://github.com/jincheng9/markdown_supported_languages)

## Code inline dans du texte

Pour créer un utilisateur, utilisez `createUser('John', 'john@example.com')`.

La variable `API_KEY` doit être définie dans le fichier `.env`.

Appelez `npm install` pour installer les dépendances, puis `npm run dev` pour lancer le serveur.
