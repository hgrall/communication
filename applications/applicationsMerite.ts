import * as shell from "shelljs";

import { ServeurApplicationsExpress } from '../bibliotheque/communication/serveurApplications';
import { AiguilleurWebSocket } from '../bibliotheque/communication/serveurConnexions';
import { ServeurCanauxTchat } from '../tchat/serveur/serveursTchat';
import { ServeurCanauxJeu1Distribution } from '../distribution/serveur/serveursJeu1Distribution';
import { FormeReseau } from "../tchat/serveur/generationReseaux";

/**
 * Port égal :
 * - soit à celui attribué par l'environnement Heroku,
 * - soit à 8081 en local.
 */

function calculPort() : number{
    try{
      return Number(process.env.PORT) || 8081;
    }catch(e){
      return 8081;
    }
} 

export const port: number = calculPort(); 


/**
 * Serveur d'applications du tchat et du jeu 1 de distribution,
 * paramétré par le port.
 * Le serveur est initialisé puis démarré.
 */
const serveurApplisMerite
    = new ServeurApplicationsExpress(port);

const repertoireHtml: string = shell.pwd() + "/build";

serveurApplisMerite.specifierRepertoireScriptsEmbarques(repertoireHtml);
serveurApplisMerite.demarrer();

const cheminsTchat: { [chemin: string]: FormeReseau } = {
    "/tchat/etoile0": FormeReseau.ETOILE,
    "/tchat/etoile1": FormeReseau.ETOILE,
    "/tchat/etoile2": FormeReseau.ETOILE,
    "/tchat/etoile3": FormeReseau.ETOILE,
    "/tchat/etoile4": FormeReseau.ETOILE,
    "/tchat/anneau0": FormeReseau.ANNEAU,
    "/tchat/anneau1": FormeReseau.ANNEAU,
    "/tchat/anneau2": FormeReseau.ANNEAU,
    "/tchat/anneau3": FormeReseau.ANNEAU,
    "/tchat/anneau4": FormeReseau.ANNEAU
};


const ressourceTchat = "interfaceTchat.html";

for (let ch in cheminsTchat) {
    serveurApplisMerite.specifierRessourceAServir(
        ch, repertoireHtml, ressourceTchat
    );
}

const cheminJeu1 = "/jeu1/distribution0";
const ressourceJeu1 = "interfaceJeu1Distribution.html";

serveurApplisMerite.specifierRessourceAServir(
    cheminJeu1, repertoireHtml, ressourceJeu1
);

const cheminAdminJeu1 = "/jeu1/distribution0/admin";
const ressourceAdminJeu1 = "interfaceAdminJeu1Distribution.html";

serveurApplisMerite.specifierRessourceAServir(
    cheminAdminJeu1, repertoireHtml, ressourceAdminJeu1
);

// Accueil
const cheminAccueil = "/";
const ressourceAccueil = "interfaceAccueil.html";

serveurApplisMerite.specifierRessourceAServir(
    cheminAccueil, repertoireHtml, ressourceAccueil
);

const aiguilleur = new AiguilleurWebSocket(serveurApplisMerite);

aiguilleur.demarrer();

/*
 *********
 * Tchat *
 *********
 */

/**
 * Noms des utilisateurs de tchat. Tous les réseaux de tchat
 * ont ces cinq utilisateurs.
 */
const noms: ReadonlyArray<string> = ["dede", "fifi", "jojo", "lulu", "zaza"];

let etoiles = 0;
let anneaux = 0;
for (let ch in cheminsTchat) {
    let prefixe = "";
    switch (cheminsTchat[ch]) {
        case FormeReseau.ANNEAU:
            prefixe = "A" + anneaux + "-";
            anneaux++;
            break;
        case FormeReseau.ETOILE:
            prefixe = "E" + etoiles + "-";
            etoiles++;
            break;
    }
    const serveurCanauxTchat
        = new ServeurCanauxTchat(
            ch, aiguilleur, cheminsTchat[ch], noms, prefixe);
}


/*
 *************************
 * Jeu 1 de distribution *
 *************************
 */

const serveurCanauxJeu1
    = new ServeurCanauxJeu1Distribution(
        cheminJeu1, aiguilleur);

/*
 * Administration programmatique au lieu d'admin interactive.
 */



