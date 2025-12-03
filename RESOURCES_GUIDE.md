# Guide d'utilisation des ressources

## Images

### Images locales

Placez vos images dans le dossier `public/presentations/[votre-presentation]/ressources/`

Dans votre markdown, utilisez :

```markdown
![Description](./ressources/image.png)
```

### Images en ligne

Pour les images hébergées en ligne :

```markdown
![Description](https://example.com/image.png)
```

### Redimensionnement d'images

Pour contrôler la taille d'une image en ligne, utilisez le format suivant dans l'attribut alt :

#### Largeur uniquement

```markdown
![Description 400](https://example.com/image.png)
```

Cela affichera l'image avec une largeur de 400px et une hauteur automatique.

#### Largeur et hauteur

```markdown
![Description 400x300](https://example.com/image.png)
```

Cela affichera l'image avec une largeur de 400px et une hauteur de 300px.

**Format** : `![texte descriptif WIDTHxHEIGHT](url)` ou `![texte descriptif WIDTH](url)`

## PDF

Pour afficher un PDF dans vos slides, utilisez la syntaxe d'image :

```markdown
![Nom du PDF](./ressources/document.pdf)
```

Le PDF sera automatiquement affiché dans une iframe de 600px de hauteur.

## Exemples

```markdown
# Ma slide avec images

## Image locale

![Mon logo](./ressources/logo.png)

## Image en ligne redimensionnée

![Screenshot 800x600](https://example.com/screenshot.png)

## PDF

![Documentation](./ressources/doc.pdf)
```
