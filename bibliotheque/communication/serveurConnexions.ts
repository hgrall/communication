// Serveur établissant les connexions par Web Socket
// - Configuration à la connexion
// - Communication entre clients
// - Déconnexion

// Un module commençant par un import
import * as http from 'http';
import * as websocket from 'websocket';

import { creerTableMutableVide, TableMutable } from "../types/table";

import {
    FormatMessage, Message,
    FormatConfigurationInitiale, Configuration,
    FormatErreurRedhibitoire, ErreurRedhibitoire,
} from "../reseau/formats";

import { ServeurApplications } from './serveurApplications';
import {obtenirConfig, obtenirConfigCodeChiffre, verifierCodedAcces} from "./securite";

/**
 * Configurateur d'un canal entre le client et le serveur.
 */
export interface ConfigurateurCanalClientServeur {

    /**
     * Traite la première connexion entre le client et le serveur.
     */
    traiterConnexion(): boolean;
    /**
     * Enregistre le traitement des messages.
     */
    enregistrerTraitementMessages(): void;
    /**
     * Enregistre le traitement pour l'appliquer à la fermeture.
     */
    enregistrerTraitementFermeture(): void;

}

/**
 * Interface décrivant un canal entre le client et le serveur, paramétrée
 * par le type de connexions.
 * @param TC type des connexions.
 * @param FErr type décrivant les erreurs en JSON.
 * @param EtErr étiquettes pertinentes pour décrire les erreurs.
 * @param FConf type décrivant les configurations en JSON.
 * @param EtConf étiquettes pertinentes pour décrire les configurations.
 * @param FMsg type décrivant les messages en JSON.
 * @param EtMsg étiquettes pertinentes pour décrire les messages.
 */
export interface CanalServeurClient<
    TC,
    FErr extends FormatErreurRedhibitoire, EtErr extends string,
    FConf extends FormatConfigurationInitiale, EtConf extends string,
    FMsg extends FormatMessage, EtMsg extends string>
    extends ConfigurateurCanalClientServeur {
    /**
     * Connexion réellement utilisée.
     */
    connexionReelle(): TC;
    /**
     * Adresse du client.
     */
    adresseClient(): string;
    /**
     * Chemin sur le serveur hôte.
     */
    cheminServeur(): string;
    /**
     * Traite le message reçu du client.
     * @param m message provenant d'un client.
     */
    traiterMessage(m: FMsg): void;
    /**
     * Traite la fermeture de la connexion entre le client et le serveur, par
     * exemple lorsque le client se déconnecte en fermant l'onglet du navigateur.
     * @param r code de fermeture (normalement : 1001).
     * @param desc description textuelle expliquant la fermeture (normalement :
     * Remote peer is going away).
     */
    traiterFermeture(raison: number, description: string): void;
    /**
     * Envoie le message du serveur au client.
     * @param m message à envoyer.
     */
    envoyerAuClient(m: Message<FMsg, EtMsg>): void;
    /**
     * Envoie la configuration du serveur au client.
     * @param c configuration à envoyer.
     */
    envoyerConfiguration(c: Configuration<FConf, EtConf>): void;
    /**
     * Détermine si la configuration a été envoyée au client.
     * @returns true si la configuration a été envoyée, false sinon.
     */
    estConfigure(): boolean;
    /**
     * Accesseur en lecture à la configuration.
     * Précondition : estConfigure() renvoie true.
     */
    configuration(): Configuration<FConf, EtConf>;
    /**
     * Envoie l'erreur du serveur au client.
     * @param e erreur à envoyer.
     */
    envoyerMessageErreur(e: ErreurRedhibitoire<FErr, EtErr>): void;
}


/**
 * Canal entre le client et le serveur implémenté par Web Socket.
 * @param FErr type décrivant les erreurs en JSON.
 * @param EtErr étiquettes pertinentes pour décrire les erreurs.
 * @param FConf type décrivant les configurations en JSON.
 * @param EtConf étiquettes pertinentes pour décrire les configurations.
 * @param FMsg type décrivant les messages en JSON.
 * @param EtMsg étiquettes pertinentes pour décrire les messages.
 */
export abstract class CanalServeurClientWebSocket<
    FErr extends FormatErreurRedhibitoire, EtErr extends string,
    FConf extends FormatConfigurationInitiale, EtConf extends string,
    FMsg extends FormatMessage, EtMsg extends string,
    CFG extends Configuration<FConf, EtConf>>
    implements CanalServeurClient<websocket.connection, FErr, EtErr, FConf, EtConf, FMsg, EtMsg> {

    /**
     * Configuration associée au canal.
     */
    private _config: CFG;
    /**
     * Constructeur d'un canal à partir :
     * - d'un chemin,
     * - d'une connexion par Web Socket,
     * - d'une adresse IP client.
     * @param chemin
     * @param connexion
     * @param adresseIPClient
     */
    constructor(
        private chemin: string,
        private connexion: websocket.connection,
        private adresseIPClient: string) {
    }
    /**
     * Connexion réellement utilisée.
     */
    connexionReelle(): websocket.connection {
        return this.connexion;
    }
    /**
     * Accesseur en lecture à l'adresse IP du client.
     */
    adresseClient(): string {
        return this.adresseIPClient;
    }
    /**
     * Accesseur en lecture au chemin sur l'hôte associé au canal.
     */
    cheminServeur(): string {
        return this.chemin;
    }
    /**
     * A implémenter.
     */
    abstract traiterConnexion(): boolean;
    /**
     * A implémenter.
     * @param m message à envoyer.
     */
    abstract traiterMessage(m: FMsg): void;

    /**
     * Enregistre le traitement des messages pour la connexion associée
     * par Web Socket.
     */
    enregistrerTraitementMessages(): void {
        this.connexionReelle().on('message', (message: websocket.IMessage) => {
            let m = message.utf8Data;
            if (typeof m === "undefined") {
                throw new Error("[Erreur : contenu du message non défini.]");
            } else {
                let msg: FMsg = JSON.parse(m);
                this.traiterMessage(msg);
            }
        });
        console.log("- Enregistrement du traitement des messages.")
    }
    /**
     * A implémenter.
     * @param r code de fermeture (normalement : 1001).
     * @param desc description textuelle expliquant la fermeture (normalement :
     * Remote peer is going away).
     */
    abstract traiterFermeture(raison: number, description: string): void;

    /**
     * Enregistre le traitement de la fermeture pour la connexion associée
     * par Web Socket.
     */
    enregistrerTraitementFermeture(): void {
        this.connexionReelle().on('close', (raison: number, description: string) => {
            this.traiterFermeture(raison, description);
        });
        console.log("- Enregistrement du traitement de la fermeture de la connexion par Web socket.")
    }
    /**
     * Envoie au client le message brut en JSON, au format UTF8, en utilisant
     * la Web Socket associée.
     * @param m message à envoyer.
     */
    envoyerAuClient(m: Message<FMsg, EtMsg>) {
        this.connexionReelle().sendUTF(m.brut());
    }
    /**
     * Envoie au client la configuration brute en JSON, au format UTF8,
     * en utilisant la Web Socket associée et initialise la configuration
     * et sauvegarde la configuration.
     * @param c configuration à envoyer.
     */
    envoyerConfiguration(c: CFG) {
        this.connexionReelle().sendUTF(c.brut());
        this._config = c;
    }
    /**
     * Teste si la configuration est initialisée.
     */
    estConfigure(): boolean {
        return this._config !== undefined;
    }
    /**
     * Accesseur en lecture à la configuration.
     * Précondition : estConfigure() renvoie true.
     */
    configuration(): CFG {
        return this._config;
    }
    /**
     * Envoie au client l'erreur brute en JSON, au format UTF8,
     * en utilisant la Web Socket associée.
     * @param e erreur à envoyer.
     */
    envoyerMessageErreur(e: ErreurRedhibitoire<FErr, EtErr>) {
        this.connexionReelle().sendUTF(e.brut());
    }

}

/**
 * Interface décrivant un serveur de canaux paramétré par un type de connexions
 * (typiquement des Web Sockets). Un serveur de canaux est lié à un chemin, et
 * donc à l'application associée à ce chemin.
 * @param TC type de connexions
 */
export interface ServeurCanaux<TC> {
    /**
     * Crée un canal à partir d'un chemin, d'une connexion concrète
     * et de l'adresse IP du client.
     * @param chemin
     * @param connexion
     * @param adresseIPClient
     */
    creerCanal(
        chemin: string,
        connexion: TC,
        adresseIPClient: string
    ): ConfigurateurCanalClientServeur;
    /**
     * Initialise le canal.
     */
    initialiser() : void;
    preInit(
        chemin: string,
        nombreUtilisateurs: number,
        prefixeIdDom: string
    ) : void;
}

export abstract class ServeurAbstraitCanaux<S extends ServeurApplications, TC>
    implements ServeurCanaux<TC> {
    constructor(
        protected chemin: string,
        private aiguilleur: Aiguilleur<S, TC>
    ){
        aiguilleur.enregistrerServeurCanaux(chemin, this);
    }
    abstract creerCanal(
        chemin: string,
        connexion: TC,
        adresseIPClient: string
    ): ConfigurateurCanalClientServeur;
    /**
     * Initialise le canal.
     */
    abstract initialiser() : void;
    abstract preInit(
        chemin: string,
        nombreUtilisateurs: number,
        prefixeIdDom: string
    ) : void;
}

/**
 * Interface décrivant un aiguilleur, paramétrée par
 * - le type du serveur d'applications,
 * - le type de connexions (typiquement des Web Sockets),
 * - le type des canaux,
 * - les types associés aux erreurs, aux configurations et aux messages.
 * Un aiguilleur associe à un chemin un serveur de canaux, qui produira
 * les canaux de communication utilisés entre le serveur et les clients
 * s'adressant au serveur par ce chemin.
 * @param S serveur d'applications.
 * @param TC type des connexions.
 */
export interface Aiguilleur<S extends ServeurApplications, TC> {
    /**
     * Enregistre un aiguillage particulier, déterminé par les arguments,
     * un chemin et un serveur de canaux.
     * @param chemin
     * @param serveurCanaux
     */
    enregistrerServeurCanaux(
        chemin: string,
        serveurCanaux: ServeurCanaux<TC>
    ): void;
    /**
     * Démarre l'aiguilleur.
     */
    demarrer(serveurAppli: S): void;

    /**
     * Traite la requête initiale du client, donnant lieu à la création du canal.
     */
    traiterRequeteInitiale(
        chemin: string,
        connexion: TC,
        adresseIPClient: string,
        nombreUtilisateurs: number
    ): void
}

/**
 * Aiguilleur abstrait implémenté en utilisant des Web Sockets. Il est
 * paramétré par le serveur d'applications et le type des canaux,
 * associés à des Web Sockets. Il reste à implémenter la méthode "aiguiller".
 */
export class AiguilleurWebSocket<S extends ServeurApplications>
    implements Aiguilleur<S, websocket.connection>
{
    /**
     * Table réalisant l'aiguillage, associant à un chemin un serveur de canaux.
     */
    private aiguillageServeursCanaux
        : TableMutable<ServeurCanaux<websocket.connection>,
        ServeurCanaux<websocket.connection>>;

    /**
     * Constructeur de l'aiguilleur à partir d'un serveur d'applications,
     * initialisant l'aiguillage par une table vide.
     * @param serveurAppli serveur d'applications associé.
     */
    constructor(
        private serveurAppli: S
    ) {
        this.aiguillageServeursCanaux = creerTableMutableVide((x) => x);
    }

    /**
     * enregistre dans la table d'aiguillage l'association
     * ("chemin", "serveurCanaux").
     * @param chemin chemin sur l'hôte.
     * @param serveurCanaux serveur de canaux.
     */
    enregistrerServeurCanaux(
        chemin: string,
        serveurCanaux: ServeurCanaux<websocket.connection>): void {
        this.aiguillageServeursCanaux.ajouter(chemin, serveurCanaux);
    }

    /**
     * Démarre l'aiguilleur par les actions suivantes :
     * - récupération du serveur Http associé au serveur d'applications,
     * - création d'un serveur pour Web Socket, attaché au serveur Http,
     * - configuration de ce serveur pour traiter les événements "request" en
     *   définissant une fonction de traitement des requêtes :
     *   - détermination du chemin et de l'adresse IP du client
     *     à partir de la requête,
     *   - acceptation de la requête ou rejet si au chemin n'est associé aucun
     *     serveur de canaux,
     *   - récupération dans la table d'aiguillage du serveur de canaux associé
     *     à ce chemin, pour traiter la requête initiale.
     */
    demarrer(): void {
        let serveurHttp: http.Server = this.serveurAppli.serveurHttp();
        let cetAiguilleur = this;
        let serveurWS = new websocket.server({
            httpServer: serveurHttp
        });
        serveurWS.on('request', (req: websocket.request) => {
            let c = req.resourceURL.pathname;
            let chemin = "";
            if (typeof c === "string") {
                chemin = c;
            } else {
                chemin = "";
            }

            // Verification du code d'accès
            let nombreUtilisateurs: number;
            if (verifierCodedAcces(req.resourceURL.query)) {
                // Obtenir les configurations (nombre d'utilisateurs)
                // @ts-ignore
                nombreUtilisateurs = obtenirConfig(req.resourceURL.query.code);
            } else {
                req.reject(401, "Code d'accès invalide.");
                return;
            }

            if (!cetAiguilleur.aiguillageServeursCanaux.contient(chemin)) {
                req.reject(404, "Web Socket - requête rejetée : chemin non valide.");
            } else {
                let connexion = req.accept('echo-protocol', req.origin);
                let adresseIPClient = req.remoteAddress;
                this.traiterRequeteInitiale(chemin, connexion, adresseIPClient, nombreUtilisateurs);
            }
        });

    }

    /**
     * Traite la requête initiale du client par les actions suivantes :
     * - création du canal,
     * - traitement de la connexion par le canal,
     * - enregistrement du traitement des messages par le canal,
     * - enregistrement du traitement de la fermeture par le canal.
     * @param chemin chemin sur l'hôte.
     * @param connexion connexion sous-jacente par Web Socket.
     * @param adresseIPClient adresse IP du client.
     */
    traiterRequeteInitiale(
        chemin: string,
        connexion: websocket.connection,
        adresseIPClient: string,
        nombreUtilisateurs: number): void {
        // Pour le jeu1 (distribution), il faut pré initialiser
        if (chemin.indexOf("jeu1") >= 0) {
            console.log("jeu1");
            const cheminJeu1 = "/jeu1/distribution0";
            const prefixeDom = "DOM0-";
            this.aiguillageServeursCanaux.valeur(chemin).preInit(cheminJeu1, nombreUtilisateurs, prefixeDom);
        }

        // Initialiser, créer le canal et traiter la connexion
        this.aiguillageServeursCanaux.valeur(chemin).initialiser();
        let l = this.aiguillageServeursCanaux.valeur(chemin).creerCanal(
            chemin, connexion, adresseIPClient);
        let estConnecte = l.traiterConnexion();
        if (!estConnecte) {
            return;
        }

        // Enregistre le traitement des messages
        l.enregistrerTraitementMessages();
        // Enregistre le traitement de la fermeture de la connexion
        l.enregistrerTraitementFermeture();
    }
}

