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

## Design system

- `src/styles/tokens.css` : couleurs (thème clair et sombre), typographie, espacements, formes.
- `src/styles/global.css` : styles de base, impression, utilitaires (`.container`, `.section`, `.tag`).
- `src/components/` : en-tête, chiffres clés, section, carte d'expérience.

## Exigences

- Accessibilité : contrastes AA (RGAA), navigation au clavier, lien d'évitement, focus visible.
- Écoconception : aucun JavaScript côté navigateur, polices système, aucune ressource tierce, budget de 100 Ko.
- Sécurité : en-têtes HTTP (CSP stricte, HSTS, etc.) définis dans `vercel.json`, audit des dépendances en CI.
