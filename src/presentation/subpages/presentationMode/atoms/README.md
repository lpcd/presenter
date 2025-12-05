# Atoms - Composants atomiques Markdown

Ce dossier contient tous les composants atomiques utilisés pour le rendu du contenu Markdown dans le mode présentation.

## Structure

Chaque composant représente un élément HTML de base utilisé dans le rendu Markdown :

### Composants de texte

- **Paragraph.tsx** - Paragraphes (`<p>`)
- **Strong.tsx** - Texte en gras (`<strong>`)
- **Emphasis.tsx** - Texte en italique (`<em>`)

### Composants de listes

- **UnorderedList.tsx** - Listes non ordonnées (`<ul>`)
- **OrderedList.tsx** - Listes ordonnées (`<ol>`)
- **ListItem.tsx** - Éléments de liste (`<li>`)

### Composants de liens et médias

- **Link.tsx** - Liens hypertexte (`<a>`)
- **Video.tsx** - Lecteur vidéo HTML5 (`<video>`)
- **Audio.tsx** - Lecteur audio HTML5 (`<audio>`)
- **Iframe.tsx** - Iframe pour documents et URLs
- **Embed.tsx** - Balise embed pour contenu embarqué
- **Image.tsx** - Images avec support des légendes et dimensions

### Composants de code

- **Code.tsx** - Code inline et blocs de code (`<code>`)
- **Pre.tsx** - Conteneur de code préformaté (`<pre>`)

### Composants de tableaux

- **Table.tsx** - Conteneur de tableau (`<table>`)
- **TableHead.tsx** - En-tête de tableau (`<thead>`)
- **TableBody.tsx** - Corps de tableau (`<tbody>`)
- **TableHeader.tsx** - Cellule d'en-tête (`<th>`)
- **TableCell.tsx** - Cellule de données (`<td>`)

### Autres composants

- **Blockquote.tsx** - Citations (`<blockquote>`)
- **HorizontalRule.tsx** - Ligne horizontale (`<hr>`)

## Utilisation

Les composants sont exportés depuis `index.ts` et utilisés dans `MarkdownContent.tsx` :

```tsx
import {
  Paragraph,
  UnorderedList,
  OrderedList,
  // ...
} from "../atoms";
```

Chaque composant encapsule ses propres styles et comportements, facilitant la maintenance et la réutilisation.

## Convention de nommage

- Les composants suivent la convention PascalCase
- Les props suivent la convention camelCase
- Les types sont définis avec le suffixe `Props`

## Avantages de cette architecture

1. **Modularité** - Chaque composant est indépendant et réutilisable
2. **Maintenabilité** - Modification des styles centralisée
3. **Testabilité** - Chaque atom peut être testé individuellement
4. **Lisibilité** - Code plus clair et organisé
5. **Type-safety** - TypeScript garantit la cohérence des props
