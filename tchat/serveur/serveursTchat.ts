import * as shell from "shelljs";

import * as websocket from 'websocket';

import {
    Table,
    table,
    TableMutable,
    creerTableMutableVide
} from "../../bibliotheque/types/table";

import {
    Identifiant
} from "../../bibliotheque/types/identifiant";

import {
    TableIdentificationMutable, creerTableIdentificationMutableVide
} from "../../bibliotheque/types/tableIdentification";

import { FormatReseau } from "../../bibliotheque/reseau/reseaux";

import {
    messageRetourErreur,
    TypeMessageTchat, FormatMessageTchat, EtiquetteMessageTchat,
    messageTchat,
    configurationDeNoeudTchat, FormatConfigurationTchat, EtiquetteConfigurationTchat,
    erreurTchatDeMessage, FormatErreurTchat, EtiquetteErreurTchat, SommetTchat, FormatSommetTchat, ConfigurationTchat,
} from '../commun/echangesTchat';
import {
    ReseauTchatMutable, creerReseauTchatEnAnneau, creerReseauTchatEnEtoile,
    creerReseauTchatMutableVide,
    FormeReseau
} from "./generationReseaux"
import {
    AiguilleurWebSocket, CanalServeurClientWebSocket, ServeurCanaux, ServeurAbstraitCanaux
} from "../../bibliotheque/communication/serveurConnexions";
import {
    Interaction, ServeurApplicationsExpress, ServeurApplications
} from "../../bibliotheque/communication/serveurApplications";

import { dateMaintenant } from "../../bibliotheque/types/date"

/**
 * Canal de communication entre un client et le serveur, pour le tchat,
 * utilisant des Web Sockets.
 * Il implémente les trois méthodes de traitement correspondant aux trois étapes
 * de connexion :
 * - initialisation de la connexion ("traiterConnexion"),
 * - réception d'un message ("traiterMessage"),
 * - fermeture de la connexion ("traiterFermeture").
 * <br>
 * Il partage via l'aiguilleur transmis les trois attributs suivants :
 * - "reseaux" : portions de réseaux à connecter,
 * - "reseauxConnectes" : portions de réseaux déjà connectées,
 * - "connexions" : connexions entre les clients et le serveur.
 */

/**
 * Création du log admin avec winston
 * Redirige l'usage de console.info vers le fichier de log
 * */
let util = require('util'),
    winston = require('winston'),
    logger = winston.createLogger({
        transports: [
            new(winston.transports.Console)({
                format: winston.format.simple(),
            }),
            new (winston.transports.File)({
                filename: 'build/admin.log', // fichier de log pour l'interface admin
                format: winston.format.simple(),
            })
        ],
        exitOnError: false,
    });

function formatArgs(args: IArguments){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.info = function(){
    logger.info.apply(logger, formatArgs(arguments));
};

/**
 * CanalTchat
 * */
class CanalTchat extends CanalServeurClientWebSocket<
    FormatErreurTchat, EtiquetteErreurTchat,
    FormatConfigurationTchat, EtiquetteConfigurationTchat,
    FormatMessageTchat, EtiquetteMessageTchat,
    ConfigurationTchat
    >
{
    /**
     * Constructeur initialisant les attributs à partir de l'aiguilleur.
     * @param noeudsAConnecter noeuds à connecter
     * @param noeudsConnectes noeuds connectés du réseau mutable.
     * @param connexions table associant à un identifiant de sommet le canal de communication
     *        entre le sommet client et le serveur.
     * @param chemin chemin utilisé par le canal.
     * @param connexion connexion par Web Socket
     * @param adresseIPClient adresse IP du client
     */
    constructor(
        private noeudsAConnecter: ReseauTchatMutable,
        private noeudsConnectes: ReseauTchatMutable,
        private connexions:
            TableIdentificationMutable<'sommet', CanalTchat, CanalTchat>,
        chemin: string, connexion: websocket.connection, adresseIPClient: string) {
        super(chemin, connexion, adresseIPClient);
    }
    /**
     * Traite la connexion par les actions suivantes :
     * - sélection d'un noeud dans la portion de réseau à connecter,
     *   associée au chemin,
     *   - si elle échoue, le réseau est complet ;
     * - vérification de la cohérence du réseau,
     * - mise-à-jour des connexions courantes par les canaux,
     * - définition et envoi de la configuration associée au noeud sélectionné,
     * - retrait du noeud de la portion de réseau à connecter,
     * - ajout du noeud à la portion de réseau connectée associée au chemin.
     */
    traiterConnexion(): boolean {
        let chemin = this.cheminServeur();
        let ID_sommet: Identifiant<'sommet'>;

        try {
            ID_sommet = this.noeudsAConnecter.selectionNoeud();
        } catch (e) {
            let d = dateMaintenant();
            console.log("* " + d.representationLog() + " - " + (<Error>e).message);
            console.log("* " + d.representationLog() + " - Connexion impossible d'un client : le réseau est complet.");
            this.envoyerMessageErreur(erreurTchatDeMessage(
                "Tchat - Réseau complet ! Il est impossible de se connecter : le réseau est complet.",
                d.val()));
            return false;
        }

        if (this.connexions.contient(ID_sommet) || this.noeudsConnectes.possedeNoeud(ID_sommet)) {
            let d = dateMaintenant()
            console.log("* " + d.representationLog() + " - Connexion impossible d'un client : le réseau est corrompu.");
            this.envoyerMessageErreur(erreurTchatDeMessage(
                "Tchat - Réseau corrompu ! Il est impossible de se connecter : le réseau est corrompu. Contacter l'administrateur.",
                d.val()));
            return false;
        }

        // Cas où la sélection d'un noeud a réussi
        let d = dateMaintenant()
        console.log("* " + d.representationLog() + " - Connexion de " + ID_sommet.val + " par Web socket.");

        this.connexions.ajouter(ID_sommet, this);

        let n = this.noeudsAConnecter.noeud(ID_sommet);
        let config = configurationDeNoeudTchat(n, d.val());
        console.log("- envoi au client d'adresse " + this.adresseClient());
        console.log("  - de la configuration brute " + config.brut());
        console.log("  - de la configuration nette " + config.representation());
        this.envoyerConfiguration(config);
        this.noeudsAConnecter.retirerNoeud(n);
        this.noeudsConnectes.ajouterNoeud(n);
        return true;
    }
    /**
     * Traite le message par les actions suivantes :
     * - cas d'un message de type COM :
     *   - contrôle de l'émetteur et du destinataire,
     *   - contrôle des droits de communication,
     *   - envoi du message, en transit du serveur au client destinataire,
     *   - envoi d'un accusé de réception au client émetteur,
     * - autres cas : envoi d'un message d'erreur au client émetteur.
     * @param m message reçu du client au format JSON.
     */
    traiterMessage(m: FormatMessageTchat): void {
        let chemin = this.cheminServeur();
        let msg = messageTchat(m);
        console.log("* Traitement d'un message");
        console.log("- brut : " + msg.brut());
        console.log("- net : " + msg.representation());
        switch (m.type) {
            case TypeMessageTchat.COM:
                let ID_emetteurUrl = this.configuration().val().centre.ID;
                let ID_emetteurMsg = m.ID_emetteur;
                let ID_destinataireMsg = m.ID_destinataire;
                // Contrôle de l'émetteur et du destinataire
                if (!(ID_emetteurUrl.val === ID_emetteurMsg.val)) {
                    let msgErreur = "Problème d'identité pour l'émetteur : le client utilisant l'adresse "
                        + this.adresseClient()
                        + " devrait signer ses messages " + ID_emetteurUrl + " et non " + ID_emetteurMsg + ".";
                    console.log("- " + msgErreur);
                    this.envoyerAuClient(messageRetourErreur(msg, TypeMessageTchat.ERREUR_EMET, msgErreur));
                    break;
                }
                if (this.connexions.valeur(ID_emetteurMsg) === undefined) {
                    let msgErreur = "Problème de Web socket : la connexion n'est plus active. Fermer l'onglet et se reconnecter.";
                    console.log("- " + msgErreur);
                    this.envoyerAuClient(messageRetourErreur(msg, TypeMessageTchat.ERREUR_EMET, msgErreur));
                    break;
                }
                if (this.connexions.valeur(ID_destinataireMsg) === undefined) {
                    let msgErreur = "Destinataire inconnu ou non connecté. Attendre sa connexion ou essayer un autre destinataire.";
                    console.log("- " + msgErreur);
                    msgErreur = msgErreur + "\n- Message original : \n" + m.contenu;
                    this.envoyerAuClient(messageRetourErreur(msg, TypeMessageTchat.ERREUR_DEST, msgErreur));
                    break;
                }
                // Contrôle des communications
                if (!this.noeudsConnectes.sontVoisins(ID_emetteurMsg, ID_destinataireMsg)) {
                    let msgErreur = "communication interdite : le noeud émetteur "
                        + ID_emetteurMsg.val
                        + " n'est pas vosin du noeud destinataire " + ID_destinataireMsg.val + ".";
                    console.log("- " + msgErreur);
                    this.envoyerAuClient(messageRetourErreur(msg, TypeMessageTchat.INTERDICTION, msgErreur));
                    break;
                }
                // Fonctionnement normal
                let lienDestinaire: CanalTchat = this.connexions.valeur(ID_destinataireMsg);
                let lienEmetteur: CanalTchat = this.connexions.valeur(ID_emetteurMsg);
                let msgTransit = msg.transit();
                console.log("- Envoi en transit au client utilisant l'adresse "
                    + lienDestinaire.adresseClient());
                console.log("  - du message brut : " + msgTransit.brut());
                console.log("  - du message net : " + msgTransit.representation());
                lienDestinaire.envoyerAuClient(msgTransit);
                let msgAR = msg.avecAccuseReception();
                console.log("- Envoi en accusé de réception au client utilisant l'adresse "
                    + lienEmetteur.adresseClient());
                console.log("  - du message brut : " + msgAR.brut());
                console.log("  - du message net : " + msgAR.representation());
                lienEmetteur.envoyerAuClient(msgAR);
                break;
            default:
                let msgErreur = "Type de message non reconnu : le type doit être "
                    + TypeMessageTchat.COM.toString() + " et non " + m.type + ".";
                console.log("- " + msgErreur);
                this.envoyerAuClient(messageRetourErreur(msg, TypeMessageTchat.ERREUR_TYPE, msgErreur));
                break;
        }
    }
    /**
     * Traite la fermeture par les actions suivantes :
     * - contrôle de la connexion, qui doit être active au moment de la
     * fermeture,
     * - retrait du noeud de la portion de réseau connectée assoicée au chemin,
     * - retrait du canal de la table des connexions actives,
     * - ajout du noeud à la portion de réseau à connecter.
     * @param r code de fermeture (normalement : 1001).
     * @param desc description textuelle expliquant la fermeture (normalement :
     * Remote peer is going away).
     */
    traiterFermeture(r: number, desc: string): void {
        let chemin = this.cheminServeur();
        let ID_centre = this.configuration().val().centre.ID;
        if ((this.connexions.valeur(ID_centre) === undefined)
            || (!this.noeudsConnectes.possedeNoeud(ID_centre))) {
            console.log("* Impossibilité de fermer la connexion par Web socket : "
                + ID_centre.val + " est déjà déconnecté.");
            this.connexions.ajouter(ID_centre, this);
            return;
        }
        console.log(" * " + dateMaintenant().representationLog()
            + " - Déconnexion du client " + ID_centre.val
            + " utilisant l'adresse " + this.adresseClient() + ".");
        console.log("- identité : " + this.configuration().val().centre.ID.val);
        console.log("- raison : " + r + " ; description : " + desc);
        let n = this.noeudsConnectes.noeud(ID_centre);
        this.noeudsConnectes.retirerNoeud(n);
        this.connexions.retirer(ID_centre);
        this.noeudsAConnecter.ajouterNoeud(n);
    }
}

/**
 * Serveur de canaux pour le tchat, implémentant la fabrique de canaux et
 * agrégeant un aiguilleur d'accès privé pour le transmettre à chaque canal
 * créé.
 */
export class ServeurCanauxTchat<S extends ServeurApplications>
    extends ServeurAbstraitCanaux<S, websocket.connection>
    implements ServeurCanaux<websocket.connection>
{

    /**
     * Table associant au chemin un réseau. Cette table
     * contient les portions de réseaux encore à connecter.
     */
    private _reseauxAConnecter: ReseauTchatMutable;
    /**
     * Table associant à un chemin la portion de réseau connectée.
     */
    private _reseauxConnectes: ReseauTchatMutable;
    /**
     * Table associant à un identificateur de sommet le canal tchat. * Elle est centralisée par le serveur de canaux et partagée par * tous les canaux. Elle aurait pu être décomposée par 
     * application de tchat (par chemin donc).
     */
    private _connexions: TableIdentificationMutable<'sommet', CanalTchat, CanalTchat>;
    /**
     * Constructeur du serveur de canaux à partir d'un aiguilleur.
     * @param aiguilleur aiguilleur de tchat
     */
    constructor(
        chemin: string,
        aiguilleur: AiguilleurWebSocket<S>,
        private forme: FormeReseau,
        private noms: ReadonlyArray<string>,
        private prefixeIdSommet: string // TODO ID de ???
    ) {
        super(chemin, aiguilleur);

        this._connexions =
            creerTableIdentificationMutableVide<'sommet', CanalTchat, CanalTchat>(
                'sommet', (x) => x);
    }
    /**
     * Fabrique un canal à partir des arguments passés et en 
     * transmettant l'aiguilleur.
     * @param chemin chemin sur l'hôte.
     * @param connexion connexion par Web Socket.
     * @param adresseIPClient adresse IP du client.
     */
    creerCanal(chemin: string, connexion: websocket.connection, adresseIPClient: string) {
        return new CanalTchat(
            this._reseauxAConnecter,
            this._reseauxConnectes,
            this._connexions,
            chemin, connexion, adresseIPClient);
    }

    preInit(
        chemin: string,
        nombreUtilisateurs: number,
        prefixeIdDom: string
    ) {}

    /**
     * Administre le serveur de canaux de tchat. TODO
     */
    initialiser(): void {
        switch (this.forme) {
            case FormeReseau.ANNEAU:
                this._reseauxAConnecter =
                    creerReseauTchatEnAnneau(this.noms, this.prefixeIdSommet);
                break;
            case FormeReseau.ETOILE:
                this._reseauxAConnecter =
                    creerReseauTchatEnEtoile(this.noms, this.prefixeIdSommet);
                break;
        }
        this._reseauxConnectes = creerReseauTchatMutableVide();
    }
}





