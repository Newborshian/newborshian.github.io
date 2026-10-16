# CV en ligne de Christopher Bouthemy

Site statique construit avec [Astro](https://astro.build), hébergé sur Vercel.

## Mettre à jour le contenu

Tout le contenu est dans `src/data/cv.ts`. Le reste du site n'a pas besoin d'être modifié.

## Développer

```sh
npm install
npm run dev          # serveur local
npm run build        # construit le site dans dist/
npm run check:weight # vérifie le budget de poids (écoconception)
```

## Assistant IA

`api/ask.ts` est une fonction Vercel qui répond aux questions des visiteurs à partir de `src/data/cv.ts`, via l'API Claude.
Le formulaire (`src/components/Assistant.astro`) n'apparaît que si JavaScript est actif.

Variables d'environnement à définir dans Vercel :

- `ANTHROPIC_API_KEY` : clé dédiée à ce site, avec une limite de dépense côté Anthropic.
- `ALLOWED_ORIGIN` : adresse exacte du site (par exemple `https://cv-christopher-bouthemy.vercel.app`) ; les autres origines reçoivent une erreur 403.
- `CLAUDE_MODEL` (facultatif) : modèle utilisé, `claude-opus-5-5` par défaut.

Protections : question limitée à 500 caractères, 10 questions par heure et par adresse IP (en mémoire, par instance), réponse affichée en texte brut.
Une règle de limitation de débit dans le pare-feu Vercel est recommandée en complément.

## Design system

- `src/styles/tokens.css` : couleurs (thème clair et sombre), typographie, espacements, formes.
- `src/styles/global.css` : styles de base, impression, utilitaires (`.container`, `.section`, `.tag`).
- `src/components/` : en-tête, chiffres clés, section, carte d'expérience.

## Exigences

- Accessibilité : contrastes AA (RGAA), navigation au clavier, lien d'évitement, focus visible.
- Écoconception : moins de 1 Ko de JavaScript (assistant uniquement), polices système, aucune ressource tierce, budget de 100 Ko.
- Sécurité : en-têtes HTTP (CSP stricte, HSTS, etc.) définis dans `vercel.json`, audit des dépendances en CI.
