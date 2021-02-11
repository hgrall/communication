# Compte Rendu - Stage Helder 

Compte rendu sur les réunions et le progrès du stage de Helder BETIOL pendant les mois de janvier et février 2021.

## Tâches disponibles
1. Ressource Admin : permettre le suivre du progrès des élèves et obtenir des statistiques sur le jeu.
2. Plusieurs écoles simultanément connectées sur Heroku : actuellement, les élèves des différentes écoles pourront être connectées sur le même réseau.
3. Modification de la taille du réseau : créer une option configurable de la taille du réseau (actuellement, 15).
4. Guide d'utilisateur
5. Les variants du jeu
6. Bibliothèque intermédiaire, abstraction du code et DSL.

## Semaine 1 (04/01) 
Prise en main du projet :
- Lecture du code.
- Lecture du guide.
- Création de l'environnement local et compilation.
- Mise à jour des paquets.
- Correction des bugs de compilation.
- Proposition de possible colaboration avec l'université au Brésil -> *(à suivre)*

## Semaine 2 (11/01)
La tâche 2 a été choisie.
- Création d'une application Heroku de test.
- Ajoute du plugin HTML Webpack pour création des fichiers HTML pendant le build.
- Création d'une page d'accueil (chemin : /)
    - Page initiale demande un code d'accès.
    - Deuxième page présente les options des jeux .
    
## Semaine 3 (18/01)
Continuation et corrections de la tâche 2 :
- Codes d'accès : fichier .env ou variable d'environnement (config var dans Heroku).
- Code d'accès comme paramètre obligatoire dans le chemin pour accéder aux serveurs.

Tâche 3 :
- Modification des initialisations des jeux.
- Nombre d'utilisateurs du jeu distribution intégré au code d'accès.
    - Proposition d'utiliser des clés privées, chiffrement et fichiers de configurations.

## Semaine 4 (25/01)
Extension et finalization tâche 3 :
- Creation d'un fichier avec les configurations du jeu selon le code d'accès. La somme des codes ASCII de chaque character du code d'accès donne l'identifiant de la configuration à utiliser.
- Ajout d'une autre option de chiffrement (RSA) pour les code d'accès (securite.ts).

## Semaine 5 (01/02)
Finalization tâche 2 :
- Séparation des serveurs canaux selon le code d'accès. Chaque code d'accès valide reçoit un identifiant école numérique qui est ajouté au début du chemin pour les serveurs canaux. De cette façon, deux écoles peuvent se connecter simultanément et avoir son propre réseau independent. La variable MAX_ECOLES définit combien d'écoles simultanées sont supportées (2, par défaut). Exemple :
  - /tchat/etoile0?code=A1 -> traduit comme /0/tchat/etoile0
  - /tchat/etoile0?code=B2 -> traduit comme /1/tchat/etoile0

La tâche 1 a été choisie :
- Étude et conception d'une solution.
  - Définition de la solution : création d'un fichier log par les serveurs. Un nouveau endpoint et requête GET pour fournir ces données. Une nouvelle interface cliente pour afficher les logs obtenus à partir de cette requête HTTP. 

## Semaine 6 (08/02)
Tâche 1 :
- Création d'un fichier de log côté serveur avec [winston](https://github.com/winstonjs/winston).
- Requête HTTP GET pour obtenir le log. Chemin : /admin/logs
- Nouvelle interface client pour trier et afficher les logs selon le réseau choisi par l'utilisateur. Chemin : /admin
