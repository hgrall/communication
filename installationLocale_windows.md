# Installation sous Windows

- Récupérer une des deux archives : 
  - `installLocaleMerite.zip`,
  - `installLocaleMerite.7z`,
- Créer un répertoire merite.
- Désarchiver l'archive dans le répertoire merite pour obtenir un répertoire `Installation` contenant :
  - le répertoire `build` contenant le code de l'application,
  - un répertoire `ǹode_modules`contenant les modules utilisés par l'application,
  - une archive `node-v14.16.0-win-x64.zip` contenant le code de la plateforme [Node.js](https://fr.wikipedia.org/wiki/Node.js) (serveur en Javascript),
  - le fichier de configuration `package.json` contenant la liste des modules utilisés.

## Prérequis : installation de node

Deux possibilités
- Pour installer la derière version : télécharger [Node.js (dernière version LTS)](https://nodejs.org/fr/download/).
- Pour installer la version de l'archive : désarchiver l'archive `node-v14.16.0-win-x64.zip`.

L'installation fournit notamment deux programmes :
- `node` pour exécuter les applications,
- [npm](https://fr.wikipedia.org/wiki/Npm) pour gérer les paquets (ou modules) utilisés dans les applications.

# Exécution locale : côté serveur

1. Ouvrir le terminal sous Windows et aller dans le répertoire ```merite\Installation```.
2. Exécuter la commande suivante pour démarrer l'application :
    ```
        node-v14.16.0-win-x64\node.exe build\applications\applicationsMerite.js
    ```
3. Pour tester, ouvrir un navigateur à l'adresse suivante : `http://localhost:8081/`.
4. Pour récupérer l'adresse du serveur, exécuter la commande suivante.
    ```
        echo Adresse du serveur : http://%COMPUTERNAME%.%USERDOMAIN%:8081
    ```
    On note `adresseServeur` l'adresse qui s'affiche. Si cette adresse ne peut être obtenue, il est possible d'utiliser l'adresse IP de la machine, qu'on obtient en demandant au système d'exploitation des informations sur la connexion.

# Exécution locale : côté client

1. Ouvrir un navigateur.
2. Dans la barre des adresses, entrer `adresseServeur`
3. Pour code d'accès, entrer `A1`.
   