import express from 'express';
import http from 'http';
import * as sysFichier from 'fs';

import {
    dateMaintenant
} from "../types/date";
import { TableMutable } from '../types/table';

/**
 * Interaction entre un client et le serveur d'applications. Une interaction
 * correspond à une requête-réponse.
 *
 */
export interface Interaction {

    // servirVueDynamiquement(prefixe: string, remplacement: { [cle: string]: string }): void;
    /**
     * Sert un fichier.
     * @param chemin chemin vers le fichier à servir
     * @param fichier nom du fichier
     */
    servirFichier(chemin: string, fichier: string): void;
    //servirContenuSimple(contenu: string): void;
}

/**
 * Implémentation d'une interaction en utilisant Express
 * (cf. http://expressjs.com/en/api.html).

 */
class InteractionExpress implements Interaction {
    private _requete: express.Request;
    private _reponse: express.Response;
    private _suite: express.NextFunction;
    constructor(requete: express.Request, reponse: express.Response, suite: express.NextFunction) {
        this._requete = requete;
        this._reponse = reponse;
        this._suite = suite;
    }

    /*servirVueDynamiquement(prefixe: string, remplacement: { [cle: string]: string }): void {
        this._reponse.render(prefixe, remplacement);
    }*/

    /**
     * Sert le fichier en utilisant Express.
     * @param chemin chemin absolu vers le répertoire du fichier à servir.
     * @param fichier nom du fichier.
     */
    servirFichier(chemin: string, fichier: string): void {
        let options = {
            root: chemin,
        };
        this._reponse.sendFile(fichier, options);
    }

    /*
          servirContenuSimple(contenu: string): void {
        this._reponse.send(contenu);
    }*/
}

/**
 * Serveur d'applications Web. Une application est une page Web contenant
 * du code Javascript.
 */
export interface ServeurApplications {
    /**
     * Accesseur en lecture au serveur http.
     */
    serveurHttp(): http.Server;

    /**
     * Démarre le serveur.
     */
    demarrer(): void;

    /**
     * Spécifie le répertoire des scripts embarqués.
     * @param rep chemin relatif vers le répertoire des scripts embarqués.
     */
    specifierRepertoireScriptsEmbarques(rep: string): void;

    /**
     * Spécifie la ressource à servir étant donné un chemin.
     */
    specifierRessourceAServir(
        chemin: string, repertoire: string, ressource: string): void;
}

/**
 * Serveur abstrait d'applications web implémenté grâce à Express
 * (cf. http://expressjs.com/en/api.html).
 * Il reste la méthode initialiser à implémenter.
 */
export class ServeurApplicationsExpress implements ServeurApplications {
    /**
     * Application express sous-jacente.
     */
    private appli: express.Application;

    /**
     * Serveur Http produit par l'application et écoutant le port indiqué.
     */
    private serveur: http.Server;

    /**
     * Constructeur initialisant l'application Express et le port avec celui passé en argument.
     * @param port port utilisé par le serveur.
     */
    constructor(
        private port: number) {
        this.appli = express();
        this.port = port;
    }

    /**
     * Accesseur en lecture au serveur http.
     */
    serveurHttp(): http.Server {
        return this.serveur;
    }
    /**
     * Initialise le serveur Http à partir de l'application Express et du port.
     */
    demarrer(): void {
        this.serveur =
            this.appli.listen(this.port, () => {
                console.log("* " + dateMaintenant().representationLog()
                    + " - Le serveur écoute le port " + this.port + " de l'hôte (local ou heroku).");
            });
    }
    /*
    Les pages se terminant par suffixe sont paramétrées.
    Attention : le typage de la paramétrisation n'est pas vérifié.
    TODO actuellement inutilisé - Exemple d'usage à (re)trouver !

    definirParametrisationVuesDynamique(suffixe: string, rep: string, cles: string[]): void {
        this.appli.engine(suffixe,
            (chemin: string,
                remplacement: { [cle: string]: string },
                continuation: (err: NodeJS.ErrnoException, rendu?: string) => string) => {
                sysFichier.readFile(chemin, (err: NodeJS.ErrnoException, contenu: Buffer) => {
                    if (err) return continuation(err);
                    let rendu = contenu.toString();
                    cles.forEach((c: string, i: number, tab: string[]) => {
                        rendu = rendu.replace("#" + c + "#", remplacement[c]);
                    });
                    return continuation(err, rendu);
                });
            });
        this.appli.set('view engine', suffixe); // enregistre la paramétrisation
        this.appli.set('views', rep) // spécifie le répertoire des vues dynamiques
    }

        specifierRepertoireVuesStatiques(rep : string) : void {
        TODO ???
    }*/
    /**
     * Paramètre l'application Express pour utiliser le répertoire passé en argument.
     * @param rep chemin relatif vers le répertoire des scripts embarqués.
     */
    specifierRepertoireScriptsEmbarques(rep: string): void {
        this.appli.use(express.static(rep)); // répertoire local visible
    }

    /**
     * Paramètre l'application Express pour réagir à une requête GET
     * sur le chemin indiqué.
     * @param chemin chemin de la requête Http.
     * @param reaction procédure de réaction.
     */
    private enregistrerReponseARequeteGET(
        chemin: string, reaction: (i: Interaction) => void): void {
        this.appli.get(chemin,
            (requete: express.Request,
                reponse: express.Response,
                suite: express.NextFunction) => {
                reaction(new InteractionExpress(requete, reponse, suite));
            });
    }
    /**
     * TODO
     */
    specifierRessourceAServir(
        chemin: string, repertoire: string, ressource: string): void {
        this.enregistrerReponseARequeteGET(chemin, (i: Interaction) => {
            console.log("* " + dateMaintenant().representationLog()
                + " - Service de " + ressource + " en " + chemin);
            i.servirFichier(repertoire, ressource);
        });
    }
}

