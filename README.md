# La Maison de Canelya — Architecture du code

## Pourquoi cette structure ?

Avant : un seul fichier `menu-traiteur.jsx` de 1000+ lignes contenant données,
logique métier et interface mélangées. Risque : une modification sur les
sauces pouvait casser l'affichage du planning, par exemple.

Maintenant : **chaque responsabilité a son fichier**, ce qui permet de faire
des mises à jour ciblées sans risque de régression sur le reste de l'app.

## Règle d'or

> Une modification métier (recette, prix, règle d'alternance, calcul d'équipe)
> ne touche QUE le fichier de `/data` ou `/logic` concerné.
> Une modification visuelle ne touche QUE `/components`.

## Structure

```
src/
├── data/                       Données métier pures (aucune logique)
│   ├── clients.js              Liste clients, jours, superviseurs, dresscodes
│   ├── proteines.js            Viandes/poissons + règle du lundi
│   ├── accompagnements.js      Accompagnements + règles de compatibilité
│   └── menus.js                Entrées, desserts, pauses café, cocktails
│
├── logic/                      Logique pure (testable, sans dépendance React)
│   ├── utils.js                pick, pickNR, alternance, dates
│   ├── proteines.js            Sélection protéines (alternance rouge/blanc/poisson)
│   ├── accompagnements.js      Compatibilité accompagnement <-> protéine
│   ├── genererMenu.js          genJour, buildRows, tracking alternance (used)
│   ├── calculEquipe.js         Serveurs / cuisiniers / chauffeurs
│   ├── calculPlanning.js       Heures de départ logistique et repas
│   ├── calculDevis.js          Tarifs, HT, TVA, TTC
│   ├── genererEvenement.js     Orchestration complète (assemble tout ce qui précède)
│   └── storage.js              Persistance historique (+ migration v1→v2)
│
├── components/                 Interface React — un fichier par bloc visuel
│   ├── styles.js                Tout le CSS de l'app
│   ├── EtapeClient.jsx          Étape 1 du formulaire
│   ├── EtapePrestations.jsx     Étape 2 du formulaire
│   ├── EtapeLogistique.jsx      Étape 3 du formulaire
│   ├── EtapeEquipe.jsx          Étape 4 du formulaire
│   ├── TableauMenu.jsx          Tableau menu éditable + régénération par jour
│   ├── PanneauResultat.jsx      Devis + Planning + Équipe (affichage)
│   ├── Resultat.jsx             Assemble en-tête + TableauMenu + PanneauResultat
│   └── Historique.jsx           Liste des événements précédents
│
├── api/                         (à venir lors du déploiement Vercel)
│   ├── db.js                    Connexion MySQL centralisée
│   ├── menus.js                 Endpoints CRUD événements
│   └── generate-docx.js         Génération des 5 documents Word côté serveur
│
└── App.jsx                      Assemble tout — AUCUNE logique métier ici
```

## Exemples concrets

**"Le prix du déjeuner passe à 10 000 FCFA"**
→ Modifier uniquement `logic/calculDevis.js`, ligne `dejeuner: 9500`.

**"Ajouter une nouvelle sauce locale aux accompagnements compatibles"**
→ Modifier uniquement `data/accompagnements.js`.

**"Changer la couleur du bouton Générer"**
→ Modifier uniquement `components/styles.js`.

**"Le calcul du nombre de cuisiniers doit changer"**
→ Modifier uniquement `logic/calculEquipe.js`.

Dans tous les cas : **un seul fichier touché, zéro risque sur le reste.**

## Prochaine étape

Connexion à la base MySQL (`canelyac_gen`) via les fonctions serverless
Vercel dans `/api`, pour remplacer le stockage `window.storage` actuel
(propre à l'environnement Claude) par une vraie persistance en ligne.
