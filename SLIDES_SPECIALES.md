# Guide des Slides Spéciales

## Vue d'ensemble

Le système de présentation supporte désormais des **slides spéciales** pré-formatées pour améliorer l'expérience de présentation. Ces slides ont des designs uniques et sont automatiquement masquées en mode support.

## 📋 Liste des slides disponibles

| Slide            | Titre Markdown     | Utilisation                     | Couleur       |
| ---------------- | ------------------ | ------------------------------- | ------------- |
| 🏋️ Exercice      | `## Exercice`      | Introduire un exercice pratique | Orange-Rouge  |
| ☕ Pause         | `## Pause`         | Annoncer une pause              | Bleu ciel     |
| 🍽️ Déjeuner      | `## Dejeuner`      | Pause déjeuner                  | Émeraude      |
| ✅ Vrai          | `## Vrai`          | Réponse correcte / Fait vrai    | Vert          |
| ❌ Faux          | `## Faux`          | Réponse incorrecte / Fait faux  | Rouge         |
| ❓ Questions     | `## Questions`     | Session Q&R                     | Violet        |
| ⚠️ Attention     | `## Attention`     | Avertissement important         | Jaune-Orange  |
| 🎯 Objectifs     | `## Objectifs`     | Objectifs d'apprentissage       | Bleu profond  |
| 💻 Démonstration | `## Demonstration` | Live coding / démo              | Vert émeraude |
| 📝 Récapitulatif | `## Recapitulatif` | Résumé des points clés          | Gris-bleu     |

## 📝 Syntaxe Markdown

### Exercice

```markdown
## Exercice

durée : 20 min
repos : https://github.com/username/repo
description : Créez des tests unitaires pour la classe Calculator
```

### Pause

```markdown
## Pause

durée : 10 min
```

### Déjeuner

```markdown
## Dejeuner

retour : 14h30
```

### Vrai

```markdown
## Vrai

description : Les tests unitaires améliorent la qualité du code
```

### Faux

```markdown
## Faux

description : Cette affirmation est incorrecte car...
```

### Questions

```markdown
## Questions
```

### Attention

```markdown
## Attention

description : Cette opération est irréversible et supprimera toutes les données
```

### Objectifs

```markdown
## Objectifs

description : À la fin de ce module, vous serez capable de...

- Créer des tests unitaires efficaces
- Utiliser les mocks et stubs
- Mesurer la couverture de code
```

### Démonstration

```markdown
## Demonstration

titre : Création d'un API REST
description : Nous allons créer ensemble une API complète avec Express et TypeScript
```

### Récapitulatif

```markdown
## Recapitulatif

description : Revoyons les points essentiels de ce module

- Les tests unitaires isolent une seule unité de code
- Les mocks simulent les dépendances externes
- La couverture de code mesure les lignes testées
```

## 🎯 Règles importantes

### 1. Niveaux de titres supportés

- ✅ Fonctionne avec : `## (h2)`, `### (h3)`, `#### (h4)`, etc.
- ❌ Ne fonctionne PAS avec : `# (h1)` (réservé au titre principal)

### 2. Détection insensible à la casse

```markdown
## Exercice ✅

## exercice ✅

## EXERCICE ✅

## Pause ✅

## pause ✅
```

### 3. Format des données

- Les lignes de données utilisent le format : `clé : valeur`
- Les espaces autour du `:` sont optionnels
- Exemples valides :
  ```markdown
  durée : 10 min
  durée: 10 min
  durée :10 min
  ```

## 🎨 Comportement visuel

### En mode Présentation

- Design complet avec couleurs, icônes et animations
- Transition fluide avec Framer Motion
- Icônes en arrière-plan semi-transparentes
- Texte centré et optimisé pour la lisibilité

### En mode Support

- **Automatiquement masquées** ✨
- Ne polluent pas le support de cours
- Seul le contenu pédagogique est conservé

## 💡 Exemples d'utilisation

### Scénario 1 : Module avec quiz

```markdown
# Tests Unitaires en C#

## Introduction

Les tests unitaires sont essentiels...

## Quiz - Question 1

Les tests unitaires testent une seule unité de code.

## Vrai

description : C'est la définition même d'un test unitaire

## Quiz - Question 2

On doit mocker toutes les dépendances.

## Faux

description : Seulement les dépendances externes ou complexes
```

### Scénario 2 : Module avec exercice

```markdown
# Pratique des Mocks

## Théorie

Présentation des concepts...

## Exercice

durée : 30 min
repos : https://github.com/formation/exercice-mocks
description : Créez des mocks pour tester la classe UserService

## Correction

Voyons ensemble la correction...
```

### Scénario 3 : Formation d'une journée

```markdown
# Formation .NET - Jour 1

## Accueil

Bienvenue...

## Module 1

Contenu du premier module...

## Pause

durée : 15 min

## Module 2

Contenu du deuxième module...

## Dejeuner

retour : 13h30

## Module 3 (après-midi)

Contenu de l'après-midi...

## Questions

## Conclusion

Merci et à demain !
```

## 🔧 Personnalisation

Les slides peuvent être personnalisées en modifiant les composants dans :

```
src/presentation/subpages/presentationMode/specialSlides/
```

Chaque slide est un composant React indépendant avec :

- Props typées
- Animations Framer Motion
- Styles Tailwind CSS
- Icônes Lucide React

## 🐛 Dépannage

### La slide spéciale ne s'affiche pas

- Vérifiez le niveau de titre (pas de h1)
- Vérifiez l'orthographe exacte du titre
- Les accents comptent : "Dejeuner" ou "Déjeuner"

### Les données ne s'affichent pas

- Vérifiez le format `clé : valeur`
- Assurez-vous qu'il n'y a pas de caractères invisibles
- Vérifiez que la clé correspond (durée, repos, description, retour)

### La slide apparaît en mode support

- C'est un bug, les slides spéciales doivent être filtrées
- Vérifiez que `detectSpecialSlide` retourne le bon type
- Vérifiez le filtre dans `SupportMode.tsx`

## 📚 Référence technique

### Architecture

```
specialSlides/
├── index.ts                    # Exports
├── ExerciseSlide.tsx          # Composant Exercice
├── PauseSlide.tsx             # Composant Pause
├── DejeunerSlide.tsx          # Composant Déjeuner
├── VraiSlide.tsx              # Composant Vrai
├── FauxSlide.tsx              # Composant Faux
├── QuestionsSlide.tsx         # Composant Questions
├── AttentionSlide.tsx         # Composant Attention
├── ObjectifsSlide.tsx         # Composant Objectifs
├── DemonstrationSlide.tsx     # Composant Démonstration
└── RecapitulatifSlide.tsx     # Composant Récapitulatif

utils/
└── specialSlideDetector.ts    # Logique de détection

components/
├── SlideContent.tsx           # Intégration des slides
└── SupportMode.tsx            # Filtrage pour le support
```

### Flux de traitement

1. Markdown parsé en sections
2. Pour chaque section, détection du type
3. Si type spécial → composant spécial
4. Sinon → rendu markdown standard
5. En mode support → slides spéciales filtrées

## 🚀 Ajout d'une nouvelle slide

1. **Créer le composant** dans `specialSlides/`

   ```tsx
   export const MaSlide = ({ prop1, prop2 }) => {
     return <motion.div>...</motion.div>;
   };
   ```

2. **Exporter** dans `specialSlides/index.ts`

   ```tsx
   export { MaSlide } from "./MaSlide";
   ```

3. **Ajouter la détection** dans `utils/specialSlideDetector.ts`

   ```tsx
   if (normalizedHeading === "maslide") {
     return { type: "maslide", ...parseContent(content) };
   }
   ```

4. **Intégrer** dans `SlideContent.tsx`

   ```tsx
   case "maslide":
     return <MaSlide {...specialSlideData} />;
   ```

5. **Tester** avec un markdown

   ```markdown
   ## MaSlide

   propriété : valeur
   ```
