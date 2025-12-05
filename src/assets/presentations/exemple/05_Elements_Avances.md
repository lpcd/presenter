# Exemples

module : +
durée : 0

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

## Code avec numéros de ligne

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

## Code avec mise en évidence

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

## En plusieurs pages

**Contexte** : Création d'un système d'authentification

> 🎯 **Objectif** : Implémenter un système d'auth sécurisé avec JWT

**Stack technique**

- Frontend : React + TypeScript
- Backend : Node.js + Express
- Database : PostgreSQL
- Auth : JWT + bcrypt

## En plusieurs pages

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

## En plusieurs pages

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

## Exercice

durée : 30 min
repos : https://github.com/formation/exercice-auth-jwt
description : Implémentez un système d'authentification complet avec JWT en suivant les bonnes pratiques de sécurité

## Pause

durée : 15 min

## Dejeuner

retour : 13h30

## Vrai

description : JWT (JSON Web Token) permet une authentification stateless, ce qui facilite la scalabilité des applications distribuées

## Faux

description : Il est sûr de stocker les tokens JWT directement dans le localStorage sans aucune précaution supplémentaire

## Questions

## Attention

description : Cette opération va supprimer définitivement toutes les données. Assurez-vous d'avoir une sauvegarde complète avant de continuer.

## Objectifs

description : À la fin de ce module, vous serez capable de :

- Utiliser les blocs de citations avancés
- Intégrer du code avec coloration syntaxique
- Créer des callouts et alertes visuelles
- Implémenter des systèmes d'authentification sécurisés

## Demonstration

titre : Création d'un système d'auth complet
description : Nous allons créer ensemble un système d'authentification sécurisé avec JWT, en suivant les bonnes pratiques de sécurité.

## Recapitulatif

description : Points clés à retenir de ce module

- Les citations peuvent contenir du code et des callouts
- Les blocs de code supportent la numérotation des lignes
- Toujours valider les données côté serveur
- JWT est idéal pour l'authentification stateless
- Les tests de sécurité sont essentiels
