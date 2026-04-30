# Branding et customisation

## Activation

La configuration est centralisée dans `src/config/config.ts`.

Groupe debug (en tête du fichier config) :

- `appConfig.debug.isLocalDevelopment` : indicateur local dev.
- `appConfig.debug.showBrandingPresetSelector` : affiche/cache le sélecteur de preset sur la Home.

- `appConfig.branding.enabled = true` : active le branding dynamique (theme + mode).
- `appConfig.branding.enabled = false` : l'application utilise uniquement les valeurs `:root` de `tokens.css`.

## Sélection d'un preset (variable unique)

Utilisez `appConfig.branding.preset.selectedPreset` pour choisir le branding actif au lancement.

Presets disponibles :

- `light` : Light (actuel)
- `dark` : thème sombre
- `blue` : nuances de bleu
- `contrast` : thème très foncé avec accent vif
- `ocean` : variante bleue/teal

Exemple :

- `appConfig.branding.preset.selectedPreset = "blue"`

Le preset est appliqué sur `data-theme` et `data-color-scheme` au démarrage.

## Option export PDF

Dans `src/config/config.ts` :

- `appConfig.pdf.codeBlockRenderMode = "wrap"` : retour à la ligne des longs blocs de code dans le PDF.
- `appConfig.pdf.codeBlockRenderMode = "scale"` : conserve les lignes longues, puis réduit la capture pour tenir sur la page.

## Où modifier les couleurs

Fichier: `src/styles/tokens.css`

- `--color-primary`, `--color-primary-dark`, `--color-secondary`
  - Impact: boutons, loaders, liens, accents visuels.
- `--color-text*`
  - Impact: textes principaux/secondaires sur Home, pages présentation, support.
- `--color-surface*`, `--color-page`
  - Impact: fonds de page, cartes, panneaux, sections.
- `--color-border*`
  - Impact: bordures cartes, champs de recherche, séparateurs.
- `--gradient-*`
  - Impact: bandeaux des cartes Home et backgrounds de gradient.

## Fichiers CSS et portée

- `tokens.css`: variables globales et thèmes (`[data-theme]`, `[data-color-scheme]`).
- `base.css`: styles globaux HTML/body/#root.
- `components.css`: styles markdown (`.prose`, `.inline-markdown`).
- `utilities.css`: utilitaires sémantiques (`.text-brand-*`, `.bg-brand-page`).

## Catégories des présentations

Les catégories ne sont plus en dur.

- Source: lecture de tous les `metadata.json` via `presentationLoader.ts`.
- Clé utilisée: `type` dans chaque metadata.
- Affichage Home: sectionnement automatique par type (`Formation`, `Démonstration`, etc.).
- Fallback: `appConfig.presentations.uncategorizedLabel`.
