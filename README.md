# configuration

- installation de *node* (dernière version LTS)
  - installation de *npm*

- dépendances spécifiées dans ```package.json``

# compilation

```
    npm run build
    npm run buildAvecVerif
```

# exécution locale

```
    node build/applications/applicationsMerite.js

    navigateur : http://localhost:8081/
```

- chemins
  - / : accueil
  - tchat/etoile0
  - TODO etc.

Deux applications disponibles : ```tchat``` et ```jeu1```
- ```tchat/etoileN``` (```N``` entre 0 et 4)
- ```tchat/anneauN``` (```N``` entre 0 et 4)
- ```jeu1/distribution0```

# déploiement sur heroku

- adresse : ```https://jeu1v1-distrib.herokuapp.com/```
- configuration : voir ```Procfile```

# guide du développeur

- installation de *visual studio code*

## Tutoriels 

- [npm](https://cdiese.fr/commandes-npm/)

## Mise à jour des paquets

(extrait du tutoriel référencé ci-dessus)

### Afficher les packages à mettre à jour

- Pour afficher les packages pour lesquels une nouvelle version existe, il faut exécuter:

```
  > npm outdated
```

L’affichage se fera de cette façon:

```
  Package     Current  Wanted  Latest  Location 
  protractor    5.3.0   5.3.2   5.3.2  test_package 
```

### Effectuer des mises à jour

Pour mettre à jour un package:

```
  > npm update <nom du package>  // ou > npm up <nom du package> 
```

Certains éléments peuvent empêcher la mise à jour d’un package comme l’utilisation d’un fichier ```package-lock.json```, ```npm-shrinkwrap.json```, l’absence de caractères ```^``` ou ```~``` dans la liste des dépendances dans le fichier ```package.json```. Ces éléments sont précisés plus haut.

## Webpack

Webpack est un groupeur de modules (module bundler) JavaScript open source. Il prend des modules avec des dépendances et génère des assets statiques représentant ces modules.
- [Concepts](https://webpack.js.org/concepts/)
- [Getting Started](https://webpack.js.org/guides/getting-started/)

Dans ce projet, le plugin [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin) est utilisé pour créer les fichiers HTML. Pendant le build, le plugin utilise le template HTML sur le dossier */site* et les configurations sur webpack.config.ts pour créer les fichiers HTML qui sont ensuite deposés sur */build*.

Le plugin [dotenv-webpack](https://github.com/mrsteele/dotenv-webpack) est utilisé pour la lecture des variables d'environnement, les codes d'accès sont inclus dans ce cas. Dans Heroku, ces variables sont appelés Config Vars et peuvent être modifiés dans l'onglet "Settings". Du côté client, les variables sont définies pendant le build et, du côté serveur, pendant l'exécution (runtime). Il faut réinitialiser l'application pour appliquer les modifications des variables dans le client. La lecture peut aussi se faire à partir d'un fichier .env dans la racine.
# guide de l'utilisateur
