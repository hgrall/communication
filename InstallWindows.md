# Installation sur Windows

Le fichier build.zip disponible sur la racine du dépôt a été testé sur une machine Windows et peut être utilisé pour une nouvelle installation.

## Prérequis

- [Installation de Node.js (dernière version LTS)](https://nodejs.org/fr/download/)
  - installation de *npm* : automatique avec l'installation du node

# Exécution locale

1. Créer un nouveau dossier et télécharger dedans le fichier build.zip et package.json de ce dépôt.
2. Décompresser le fichier build.zip
3. Ouvrir le terminal sur Windows et aller dans le dossier où se trouve package.json.
```
    dir [chemin dossier où se trouve package.json]
```
4. Exécuter la commande :
```
    npm install
```
5. Après l'installation de dépendences avec la commande précedente, exécuter le suivant pour démarrer l'application :
```
    node build/applications/applicationsMerite.js

    navigateur : http://localhost:8081/
```

