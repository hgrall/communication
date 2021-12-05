Les applications Merite pour la communication entre machines peuvent être utilisées :
- sur le réseau Internet, en utilisant le service Heroku,
- sur le réseau local de l'établissement, après une installation locale.

# Utilisation sur le réseau Internet

Il est possible de tester et d'expérimenter avec les deux applications, le tchat et le jeu de distribution, en utilisant le service Heroku. Cependant, ces applications utilisent le protocole des [WebSockets](https://fr.wikipedia.org/wiki/WebSocket), qui permet une communication "full duplex" entre les navigateurs clients et le serveur. Présentement, les réseaux de l'Education Nationale bloquent ce protocole lorsque le serveur est extérieur à l'établissement : les applications ne peuvent donc pas être utilisées dans un établissement scolaire.

Les applications mettent à disposition des ressources partagées : dix jeux de tchat et un jeu de distribution. Plusieurs utilisateurs peuvent y jouer simultanément, et aucun contrôle d'accès n'est réalisé. 

- Tchat : cinq tchats en étoile, cinq tchats en anneau, avec cinq utilisateurs dans chaque tchat.
  - https://jeu1v1-distrib.herokuapp.com/tchat/etoile0
  - https://jeu1v1-distrib.herokuapp.com/tchat/etoile1
  - https://jeu1v1-distrib.herokuapp.com/tchat/etoile2
  - https://jeu1v1-distrib.herokuapp.com/tchat/etoile3
  - https://jeu1v1-distrib.herokuapp.com/tchat/etoile4
  - https://jeu1v1-distrib.herokuapp.com/tchat/anneau0
  - https://jeu1v1-distrib.herokuapp.com/tchat/anneau1
  - https://jeu1v1-distrib.herokuapp.com/tchat/anneau2
  - https://jeu1v1-distrib.herokuapp.com/tchat/anneau3
  - https://jeu1v1-distrib.herokuapp.com/tchat/anneau4
  
- Jeu de distribution : un jeu avec quinze utilisateurs dans cinq domaines en anneau.
  - https://jeu1v1-distrib.herokuapp.com/jeu1/distribution0

# Utilisation sur le réseau local

Pour utiliser les applications dans l'établissement scolaire, il est nécessaire de les installer sur le réseau local de l'établissement.

## Installation sous Windows

- Récupérer l'[archive](https://cloud.imt-atlantique.fr/index.php/s/mDt3ksxeNHYgxCy) qui contient sous le répertoire `Installation` : 
  - deux répertoires :
    - `tchat` : le code de l'application de tchat,
    - `distribution` : le code de l'application du jeu de distribution,
  -  le fichier `node.exe` de l'application [Node.js](https://fr.wikipedia.org/wiki/Node.js), le serveur en Javascript (version `14.18.2`).
- Créer un répertoire `merite` sur le poste qui servira de serveur.
- Désarchiver l'archive dans le répertoire `merite` pour obtenir le répertoire `Installation`. Les répertoires `tchat` et `distribution` contiennent :
  - le répertoire `build` contenant le code de l'application,
  - un répertoire `ǹode_modules`contenant les modules utilisés par l'application.

## Exécution locale du Tchat 

### Côté serveur - Professeur

1. Ouvrir le terminal sous Windows et aller dans le répertoire `merite\Installation\tchat`.
2. Exécuter la commande suivante pour démarrer l'application :
    ```
        ..\node.exe ./build/accueil/serveur/serveurPrincipal.js
    ```
3. Récupérer la clé d'accès :  
   - ouvrir un navigateur à l'adresse suivante : `http://localhost:8080/connexion`,
   - entrer le code d'accès `demo`, puis récupérer et sauvegarder la clé d'accès (six chiffres en hexadécimal, comme `b72081` par exemple,).
4. Tester l'application de tchat :
   - ouvrir dans un nouvel onglet l'adresse suivante : `http://localhost:8080/accueil/`,
   - entrer la clé d'accès formée de six chiffres hexadécimaux : le menu principal s'ouvre, permettant de choisir entre 
     - un jeu de tchat en étoile et 
     - un jeu de tchat en anneau,
   - sélectionner un des jeux, qui s'ouvre alors,
   - fermer ce dernier onglet pour ne plus être un utilisateur du tchat.
5. Pour récupérer l'adresse du serveur, exécuter la commande suivante dans l'invite de commandes MS-DOS.
    ```
        echo Adresse du serveur : http://%COMPUTERNAME%.%USERDOMAIN%:8080
    ```
    On note `adresseServeur` l'adresse qui s'affiche. Si cette adresse ne peut être obtenue, il est possible d'utiliser l'adresse IP de la machine, qu'on obtient en demandant au système d'exploitation des informations sur la connexion.

Grâce aux clés d'accès, il est possible d'avoir plusieurs classes utilisant simultanément le même serveur, chaque classe utilisant sa propre clé d'accès . 

### Côté client - Elèves

Le professeur communique aux élèves de sa classe 
- la clé d'accès récupérée sur le serveur, 
- l'adresse de la page d'accueil de l'application `adresseServeur/accueil/`.

Instructions à suivre par les élèves
1. Ouvrir un navigateur.
2. Dans un nouvel onglet, dans la barre des adresses, entrer `adresseServeur/accueil/`.
3. Entrer la clé d'accès formée de six chiffres hexadécimaux : le menu principal s'ouvre, permettant de choisir entre 
   - un jeu de tchat en étoile et 
   - un jeu de tchat en anneau.
4. Sélectionner un des jeux, qui s'ouvre alors.

Chaque jeu comporte cinq réseaux de cinq utilisateurs, soit vingt-cinq utilisateurs. Dans un tchat en étoile, le réseau forme un graphe complet : chaque utilisateur est relié à tous les autres. Dans un tchat en anneau, le réseau forme un anneau : chaque utilisateur est relié à deux voisins. La connexion d'un utilisateur au tchat dure le temps de la connexion de l'onglet : elle s'arrête si l'onglet est fermé mais aussi si la page est rechargée. Lorsque les cinq réseaux sont remplis, il devient impossible de se connecter : un message avertit que le réseau est complet.  
   
Cette application de tchat n'utilise pas le protocole des "Web Sockets" mais des connexions http persistantes. Il existe une limitation à leur utilisation dans un navigateur : à tout moment, le nombre de connexions persistantes ouvertes ne doit pas dépasser une limite, de l'ordre de cinq ou six. 

## Exécution locale du jeu de distribution

### Côté serveur - Professeur

1. Ouvrir le terminal sous Windows et aller dans le répertoire `merite\Installation\distribution`.
2. Exécuter la commande suivante pour démarrer l'application :
    ```
        ..\node.exe build/applications/applicationsMerite.js
    ```
3. Tester l'application du jeu de distribution :
   - ouvrir dans un nouvel onglet l'adresse suivante : `http://localhost:8081/`,
   - entrer un des quatre codes d'accès, `IMTA_5`, `IMTA_10`, `IMTA_15` ou `IMTA_20`, où le nombre indique le nombre d'utilisateurs : le menu principal s'ouvre, permettant de sélectionner le jeu de distribution, qui s'ouvre alors,
   - fermer ce dernier onglet pour ne plus être un utilisateur du jeu.
5. Pour récupérer l'adresse du serveur, exécuter la commande suivante.
    ```
        echo Adresse du serveur : http://%COMPUTERNAME%.%USERDOMAIN%:8081
    ```
    On note `adresseServeur` l'adresse qui s'affiche. Si cette adresse ne peut être obtenue, il est possible d'utiliser l'adresse IP de la machine, qu'on obtient en demandant au système d'exploitation des informations sur la connexion.

Grâce aux codes d'accès, il est possible d'avoir plusieurs configurations du jeu de distribution. Le réseau est formé de cinq domaines en anneau. Le code d'accès indique le nombre total d'utilisateurs :
- `IMTA_5` : cinq utilisateurs, soit un utilisateur par domaine,
- `IMTA_10` : dix utilisateurs, soit deux utilisateurs par domaine,
- `IMTA_15` : quinze utilisateurs, soit trois utilisateurs par domaine,
- `IMTA_20` : vingt utilisateurs, soit quatre utilisateurs par domaine.

### Côté client - Eleves

Le professeur communique aux élèves de sa classe 
- un des quatres code d'accès : `IMTA_5`, `IMTA_10`, `IMTA_15` ou `IMTA_20`, suivant la configuration souhaitée, 
- l'adresse de la page d'accueil de l'application `adresseServeur/`.

Instructions à suivre par les élèves  
1. Ouvrir un navigateur.
2. Dans un nouvel onglet, dans la barre des adresses, entrer `adresseServeur/`.
3. Entrer le code d'accès : le menu principal s'ouvre, permettant de sélectionner le jeu de distribution, qui s'ouvre alors.

Le jeu de distribution comporte un réseau en anneau de cinq domaines. Chaque domaine contient un à quatre utilisateurs, suivant la configuration choisie. La connexion d'un utilisateur au jeu dure le temps de la connexion de l'onglet : elle s'arrête si l'onglet est fermé mais aussi si la page est rechargée. Lorsque le réseau est complet, il devient impossible de se connecter : un message avertit que le réseau est complet.  

Cette application de distribution utilise le protocole des "Web Sockets" : il n'y a pas de limitation pour le nombre d'onglets ouverts simultanément dans un navigateur.