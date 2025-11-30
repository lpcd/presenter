# Éléments Avancés et Bonnes Pratiques

## Blocs de citations avancés

### Citation avec auteur

> "La simplicité est la sophistication suprême."
>
> — Leonardo da Vinci

### Citation technique avec code

> **Note importante**
>
> Toujours utiliser `try/catch` avec les opérations asynchrones :
>
> ```javascript
> try {
>   const data = await fetchData();
>   processData(data);
> } catch (error) {
>   console.error("Erreur:", error);
> }
> ```

### Callouts et alertes

> 💡 **Astuce** : Utilisez les React DevTools pour déboguer vos composants en temps réel.

> ⚠️ **Attention** : Cette opération va supprimer définitivement les données. Assurez-vous d'avoir une sauvegarde.

> ❌ **Erreur commune** : Oublier d'ajouter les dépendances dans le tableau de `useEffect`.

> ✅ **Bonne pratique** : Toujours valider les données côté serveur, même si elles sont validées côté client.

> 📌 **À retenir** : Les hooks React ne peuvent être appelés qu'au niveau racine d'un composant.

> 🚀 **Optimisation** : Utilisez `React.memo()` pour éviter les re-rendus inutiles.

> 🔒 **Sécurité** : Ne jamais stocker de tokens d'authentification dans le localStorage sans chiffrement.

## Formules mathématiques (notation)

### Formules inline

La formule d'Euler : e^(iπ) + 1 = 0

Le théorème de Pythagore : a² + b² = c²

### Formules en bloc

```
Équation quadratique :
x = (-b ± √(b² - 4ac)) / 2a

Formule de la distance :
d = √((x₂ - x₁)² + (y₂ - y₁)²)
```

## Diagrammes textuels

### Organigramme simple

```
Application
    │
    ├── Frontend (React)
    │   ├── Components
    │   ├── Pages
    │   └── Utils
    │
    ├── Backend (Node.js)
    │   ├── Routes
    │   ├── Controllers
    │   └── Models
    │
    └── Database (PostgreSQL)
        ├── Users
        ├── Posts
        └── Comments
```

### Flux de données

```
[Client] --HTTP--> [API Gateway] --REST--> [Microservices]
                                              │
                                              ├── [User Service]
                                              ├── [Order Service]
                                              └── [Payment Service]
                                                       │
                                                       └--> [Database]
```

### Séquence d'événements

```
1. Utilisateur soumet le formulaire
   ↓
2. Validation côté client
   ↓
3. Envoi de la requête HTTP POST
   ↓
4. Validation côté serveur
   ↓
5. Sauvegarde en base de données
   ↓
6. Envoi de la réponse au client
   ↓
7. Mise à jour de l'interface
```

## Tableaux complexes

### Tableau de décision

| Condition A | Condition B | Condition C | Action                  |
| :---------: | :---------: | :---------: | ----------------------- |
|     ✅      |     ✅      |     ✅      | Autoriser accès complet |
|     ✅      |     ✅      |     ❌      | Autoriser accès limité  |
|     ✅      |     ❌      |      -      | Demander validation     |
|     ❌      |      -      |      -      | Refuser accès           |

### Matrice de compatibilité

| Navigateur | Version | CSS Grid | Flexbox | ES6 | WebGL |
| ---------- | :-----: | :------: | :-----: | :-: | :---: |
| Chrome     |   90+   |    ✅    |   ✅    | ✅  |  ✅   |
| Firefox    |   88+   |    ✅    |   ✅    | ✅  |  ✅   |
| Safari     |   14+   |    ✅    |   ✅    | ✅  |  ⚠️   |
| Edge       |   90+   |    ✅    |   ✅    | ✅  |  ✅   |
| IE 11      |    -    |    ❌    |   ⚠️    | ❌  |  ❌   |

### Roadmap / Timeline

| Phase       | Q1 2024 | Q2 2024 | Q3 2024 | Q4 2024 |
| ----------- | :-----: | :-----: | :-----: | :-----: |
| Planning    |   ✅    |    -    |    -    |    -    |
| Development |   ✅    |   🔄    |    -    |    -    |
| Testing     |    -    |   ✅    |   🔄    |    -    |
| Deployment  |    -    |    -    |   ✅    |   🔄    |
| Maintenance |    -    |    -    |    -    |   ✅    |

Légende : ✅ Terminé | 🔄 En cours | - Non commencé

## Annotations et footnotes

Voici une phrase avec une référence[^1].

TypeScript apporte la sécurité des types à JavaScript[^typescript].

React est maintenu par Meta[^2] et la communauté open-source.

[^1]: Première note de bas de page avec des informations supplémentaires.
[^typescript]: TypeScript a été créé par Microsoft en 2012.
[^2]: Anciennement Facebook, renommé en Meta en 2021.

## Sections pliables (accordéon en texte)

### ▶️ Détails d'implémentation

<details>
<summary>Cliquez pour voir l'implémentation</summary>

```typescript
interface Config {
  apiUrl: string;
  timeout: number;
  retries: number;
}

const defaultConfig: Config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};
```

</details>

## Syntaxe avancée pour le code

### Code avec numéros de ligne

```typescript:counter.ts
1  import { useState } from 'react';
2
3  export const useCounter = (initialValue = 0) => {
4    const [count, setCount] = useState(initialValue);
5
6    const increment = () => setCount(c => c + 1);
7    const decrement = () => setCount(c => c - 1);
8    const reset = () => setCount(initialValue);
9
10   return { count, increment, decrement, reset };
11 };
```

### Code avec mise en évidence

```javascript
// Fonction utilitaire pour formater les dates
function formatDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("fr-FR", options).format(date);
}

// ATTENTION: Cette fonction modifie l'objet original
function updateUser(user, updates) {
  Object.assign(user, updates); // ⚠️ Mutation
  return user;
}
```

## Listes de pros/cons

### Avantages de TypeScript

✅ **Pros**

- Détection d'erreurs à la compilation
- Meilleure autocomplétion dans l'IDE
- Documentation intégrée via les types
- Refactoring plus sûr
- Meilleure maintenabilité du code

❌ **Cons**

- Courbe d'apprentissage initiale
- Configuration supplémentaire nécessaire
- Temps de compilation ajouté
- Peut être verbeux pour les petits projets

## Mixte : Tout combiné

### 📊 Exemple de documentation complète

**Contexte** : Création d'un système d'authentification

> 🎯 **Objectif** : Implémenter un système d'auth sécurisé avec JWT

**Stack technique**

- Frontend : React + TypeScript
- Backend : Node.js + Express
- Database : PostgreSQL
- Auth : JWT + bcrypt

**Étapes d'implémentation**

1. **Configuration de la base de données**

   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Création du service d'authentification**

   ```typescript
   class AuthService {
     async register(email: string, password: string) {
       const hash = await bcrypt.hash(password, 10);
       // Sauvegarder l'utilisateur...
     }

     async login(email: string, password: string) {
       // Vérifier les credentials...
       return jwt.sign({ userId }, SECRET, { expiresIn: "7d" });
     }
   }
   ```

3. **Intégration frontend**
   - [x] Formulaire de login
   - [x] Gestion du token dans le state
   - [x] Protected routes
   - [ ] Refresh token automatique

**Résultat attendu** ✅

| Fonctionnalité | Status | Tests |
| -------------- | ------ | ----- |
| Registration   | ✅     | 98%   |
| Login          | ✅     | 100%  |
| Logout         | ✅     | 100%  |
| Token refresh  | 🔄     | 75%   |

> 💡 **Note** : Toujours tester la sécurité avec des outils comme OWASP ZAP.

## Résumé final

Ce document démontre la **puissance** et la **flexibilité** du Markdown pour créer des présentations techniques riches et professionnelles.

**Points clés à retenir** :

- Utilisez les callouts pour attirer l'attention (💡 ⚠️ ✅)
- Combinez tableaux et emojis pour plus de clarté
- Structurez avec des titres et des listes
- Illustrez avec du code bien formaté
- Enrichissez avec des citations et des notes

**Prochaines étapes** :

1. Pratiquer avec vos propres contenus
2. Adapter le style à votre audience
3. Tester différentes combinaisons
4. Créer des templates réutilisables

---

🎉 **Félicitations !** Vous maîtrisez maintenant toutes les fonctionnalités avancées du Markdown !
