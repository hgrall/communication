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

    navigateur : http://localhost:8081/tchat/etoile0
```

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

# guide de l'utilisateur