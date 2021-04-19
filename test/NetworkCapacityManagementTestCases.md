
# Test Tchat
Test | Description | Résultat attendu | Passé / Échoue | 
--- | --- | --- | --- |
Nombre de connexions actives 1 | Le nombre d'utilisateurs actives change pour tous le connexions au moment d'une nouvelle connexion | Le nombre d'utilisateurs a augmenté pour toutes les connexions actives| Passé |
Nombre de connexions actives 2 | Le nombre d'utilisateurs actives change pour tous le connexions au moment d'une déconnexion | Le nombre d'utilisateurs a diminué pour toutes les connexions actives| Passé |
Gestion état jeu 1 | Les messages ne peuvent pas être envoyés si la salle de jeu est incomplete  | Une alerte avec le message d'erreur est affichée | Passé |
Gestion état jeu 2 | Les messages peuvent être envoyés si la salle de jeu est complete  | Le message est envoyé au destinataire correspondante | Passé |
Gestion état jeu 3 | Les messages ne peuvent pas être envoyés si la salle de jeu était complete et quelqu'un quite la salle  | Une alerte avec le message d'erreur est affichée | Passé |
Gestion taille de la salle 1 | Si la salle de jeu et complete l'utilisateur est automatiquement redirectionné à la suivant salle de jeu incomplete| Le utilisateur est redirectionné  | Passé |
Gestion taille de la salle 2 | Si la salle de jeu 4 est complete le prochain utilisateur à se connecter reçoit un message d'erreur | Le message d'erreur est affiché| Passé |


# Test Distribution
Test | Description | Résultat attendu | Passé / Échoue | 
--- | --- | --- | --- |
Nombre de connexions actives 1 | Le nombre d'utilisateurs actives change pour tous le connexions au moment d'une nouvelle connexion | Le nombre d'utilisateurs a augmenté pour toutes les connexions actives| Passé |
Nombre de connexions actives 2 | Le nombre d'utilisateurs actives change pour tous le connexions au moment d'une déconnexion | Le nombre d'utilisateurs a diminué pour toutes les connexions actives| Passé |
Gestion état jeu 1 | Les messages ne peuvent pas être envoyés si la salle de jeu est incomplete  | Une alerte avec le message d'erreur est affichée | Passé |
Gestion état jeu 2 | Les messages peuvent être envoyés si la salle de jeu est complete  | Le message est envoyé au destinataire correspondante | Passé |
Gestion état jeu 3 | Les messages ne peuvent pas être envoyés si la salle de jeu était complete et quelqu'un quite la salle  | Une alerte avec le message d'erreur est affichée | Passé |
Taille de la salle | La taille de la salle affiché dans nombre de connexions actives change en fonction du code d'entré | La taille de réseau est 10 pour le code A1 et 20 pour le code B2 | Passé |