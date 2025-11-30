# Code et Coloration Syntaxique

## Blocs de code simples

Utilisez trois backticks pour créer des blocs de code :

```
Ceci est un bloc de code simple
sans coloration syntaxique
```

## JavaScript / TypeScript

```javascript
// Fonction pour calculer la somme
function sum(a, b) {
  return a + b;
}

// Utilisation
const result = sum(5, 3);
console.log(`Résultat : ${result}`);
```

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const createUser = (name: string, email: string): User => {
  return {
    id: Math.random(),
    name,
    email,
  };
};

// Exemple avec async/await
async function fetchUsers(): Promise<User[]> {
  const response = await fetch("/api/users");
  const data = await response.json();
  return data;
}
```

## React / JSX

```jsx
import React, { useState, useEffect } from "react";

const Counter = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return (
    <div className="counter">
      <h1>Compteur : {count}</h1>
      <button onClick={() => setCount(count + 1)}>Incrémenter</button>
      <button onClick={() => setCount(0)}>Réinitialiser</button>
    </div>
  );
};

export default Counter;
```

## Python

```python
# Classes et décorateurs
class Database:
    def __init__(self, connection_string):
        self.connection_string = connection_string
        self.connected = False

    def connect(self):
        """Établit la connexion à la base de données"""
        print(f"Connexion à {self.connection_string}")
        self.connected = True

    def query(self, sql):
        if not self.connected:
            raise Exception("Database not connected")
        return f"Executing: {sql}"

# Utilisation de list comprehension
numbers = [1, 2, 3, 4, 5]
squares = [n**2 for n in numbers if n % 2 == 0]
print(f"Carrés des nombres pairs : {squares}")
```

## HTML / CSS

```html
<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ma Page</title>
    <style>
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .card {
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Bienvenue</h1>
      <div class="card">
        <p>Contenu de la carte</p>
      </div>
    </div>
  </body>
</html>
```

## SQL

```sql
-- Création de table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Requête avec JOIN
SELECT
    u.username,
    COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id, u.username
HAVING COUNT(p.id) > 5
ORDER BY post_count DESC;
```

## JSON

```json
{
  "name": "Mon Application",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "test": "vitest"
  },
  "config": {
    "port": 3000,
    "api": {
      "url": "https://api.example.com",
      "timeout": 5000
    }
  }
}
```

## Shell / Bash

```bash
#!/bin/bash

# Variables
PROJECT_NAME="mon-projet"
DEPLOY_DIR="/var/www/html"

# Fonctions
deploy() {
    echo "Déploiement de $PROJECT_NAME..."
    npm run build

    if [ $? -eq 0 ]; then
        echo "✅ Build réussi"
        rsync -av dist/ "$DEPLOY_DIR/"
        echo "✅ Déploiement terminé"
    else
        echo "❌ Erreur lors du build"
        exit 1
    fi
}

# Exécution
deploy
```

## Diff / Comparaison

```diff
  function calculateTotal(items) {
-   return items.reduce((sum, item) => sum + item.price, 0);
+   return items.reduce((sum, item) => {
+     const price = item.discounted ? item.price * 0.9 : item.price;
+     return sum + price;
+   }, 0);
  }
```

## YAML

```yaml
# Configuration Docker Compose
version: "3.8"

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80

  database:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: secret
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```

## Code inline dans du texte

Pour créer un utilisateur, utilisez `createUser('John', 'john@example.com')`.

La variable `API_KEY` doit être définie dans le fichier `.env`.

Appelez `npm install` pour installer les dépendances, puis `npm run dev` pour lancer le serveur.

## Résumé

La coloration syntaxique améliore considérablement la **lisibilité du code** et facilite la **compréhension** des exemples techniques.
