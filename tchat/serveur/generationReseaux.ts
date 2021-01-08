import {
    ReseauMutable, AssembleurReseau, ReseauMutableParTableDeNoeuds, AssembleurReseauEnEtoile, AssembleurReseauEnAnneau,
} from "../../bibliotheque/reseau/reseaux";

import {
    NoeudMutable
} from "../../bibliotheque/reseau/noeuds";


import {
    Identification, creerIdentificationParCompteur, Identifiant
} from "../../bibliotheque/types/identifiant";

import {
    noeudTchat,
    FormatSommetTchat, creerNoeudTchatSansVoisinsMutable
} from "../commun/echangesTchat";

/**
 * Interface définissant le réseau de tchat en paramétrant
 * ReseauMutable par le format des sommets.
 */
export interface ReseauTchatMutable extends ReseauMutable<FormatSommetTchat> { }

/**
 * Implémentation du réseau de tchat en paramétrant
 * ReseauMutableParTableDeNoeuds par le format des sommets et
 * en redéfinissant la représentation.
 */
class ReseauTchatMutableParTableDeNoeuds
    extends ReseauMutableParTableDeNoeuds<FormatSommetTchat>
    implements ReseauTchatMutable {
    /**
     * Représentation du réseau sous la forme :
     * - 'réseau de x noeuds : (centre : nom (ID) ; voisins : {"ID1" : "nom1", ...}) ...'
     */
    representation(): string {
        let detail = "";
        this.iterer((i, n) => { detail = detail + " " + noeudTchat(n).representation(); });
        return "réseau de " + this.net('taille') + " noeuds :"
            + detail;
    }

}

/**
 * Fabrique un réseau de tchat mutable vide.
 */
export function creerReseauTchatMutableVide(): ReseauTchatMutable {
    return new ReseauTchatMutableParTableDeNoeuds();
}

/**
 * Enumération des deux types de réseau : étoile et anneau.
 */
export enum FormeReseau {
    ETOILE,
    ANNEAU
};

/**
 * Implémentation d'un assembleur de réseau de tchat en étoile
 * - en paramétrant AssembleurReseauEnEtoile par le format des sommets,
 * - en implémentant la fabrique d'un réseau de tchat mutable vide,
 * - en étendant AssembleurReseauEnEtoile avec un accesseur en lecture
 *   aux noms des utilisateurs.
 */
export class AssembleurReseauTchatEnEtoile
    extends AssembleurReseauEnEtoile<FormatSommetTchat, ReseauTchatMutable>
    implements AssembleurReseau<FormatSommetTchat, ReseauTchatMutable> {

    /**
    * Constructeur à partir des noms des utilisateurs (qui appartiennent à l'état)
    * et d'une fabrique de noeuds sans voisins.
    * @param noms noms des utilisateurs.
    * @param fabriqueNoeudSansVoisins une fabrique de noeuds sans voisins.
    */
    constructor(
        private noms: ReadonlyArray<string>,
        fabriqueNoeudSansVoisins: (centre: FormatSommetTchat) => NoeudMutable<FormatSommetTchat>
    ) {
        super(noms.length, fabriqueNoeudSansVoisins);
    }
    /**
     * Fabrique un réseau mutable vide. A implémenter.
     */
    creerReseauMutableVide(): ReseauTchatMutable {
        return creerReseauTchatMutableVide();
    }
    /**
     * Accesseur en lecture aux noms des utilisateurs.
     */
    nomsUtilisateurs(): ReadonlyArray<string> {
        return this.noms;
    }

}

/**
 * Fabrique un assembleur de réseau de tchat en étoile,
 * à partir du nom des utilisateurs.
 * @param noms tableau formé des noms d'utilisateurs.
 */
function creerAssembleurReseauTchatEnEtoile(
    noms: ReadonlyArray<string>): AssembleurReseauTchatEnEtoile {
    return new AssembleurReseauTchatEnEtoile(noms, creerNoeudTchatSansVoisinsMutable);
}

/**
 * Fabrique un réseau de tchat en étoile, à partir du nom des utilisateurs et
 * d'un préfixe pour les identifiants de sommets. L'implémentation utilise
 * l'assembleur associé et une identification par compteur.
 * @param noms noms des utilisateurs.
 * @param prefixeIdentifiants préfixe des identifiants de sommets.
 */
export function creerReseauTchatEnEtoile(
    noms: ReadonlyArray<string>, prefixeIdentifiants: string): ReseauTchatMutable {
    let assembleur: AssembleurReseauTchatEnEtoile = creerAssembleurReseauTchatEnEtoile(noms);
    let identification: Identification<'sommet'>
        = creerIdentificationParCompteur(prefixeIdentifiants);
    assembleur.nomsUtilisateurs().forEach((nom: string, i: number, tab: string[]) => {
        let s: FormatSommetTchat
            = { ID: identification.identifier('sommet'), pseudo: tab[i] };
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}

/**
 * Implémentation d'un assembleur de réseau de tchat en anneau
 * - en paramétrant AssembleurReseauEnEtoile par le format des sommets,
 * - en implémentant la fabrique d'un réseau de tchat mutable vide,
 * - en étendant AssembleurReseauEnEtoile avec un accesseur en lecture
 *   aux noms des utilisateurs.
 */
export class AssembleurReseauTchatEnAnneau
    extends AssembleurReseauEnAnneau<FormatSommetTchat, ReseauTchatMutable>
    implements AssembleurReseau<FormatSommetTchat, ReseauTchatMutable> {

    /**
     * Constructeur à partir des noms des utilisateurs (qui appartiennent à l'état)
     * et d'une fabrique de noeuds sans voisins.
     * @param noms noms des utilisateurs.
     * @param fabriqueNoeudSansVoisins une fabrique de noeuds sans voisins.
     */
    constructor(
        private noms: ReadonlyArray<string>,
        fabriqueNoeudSansVoisins: (centre: FormatSommetTchat) => NoeudMutable<FormatSommetTchat>
    ) {
        super(noms.length, fabriqueNoeudSansVoisins);
    }
    /**
     * Fabrique un réseau mutable vide.
     */
    creerReseauMutableVide(): ReseauTchatMutable {
        return creerReseauTchatMutableVide();
    }
    /**
     * Accesseur en lecture aux noms des utilisateurs.
     */
    nomsUtilisateurs(): ReadonlyArray<string> {
        return this.noms;
    }

}

/**
 * Fabrique un assembleur de réseau de tchat en anneau,
 * à partir du nom des utilisateurs.
 * @param noms tableau formé des noms d'utilisateurs.
 */
export function creerAssembleurReseauTchatEnAnneau(
    noms: ReadonlyArray<string>): AssembleurReseauTchatEnAnneau {
    return new AssembleurReseauTchatEnAnneau(noms, creerNoeudTchatSansVoisinsMutable);
}

/**
 * Fabrique un réseau de tchat en anneau, à partir du nom des utilisateurs et
 * d'un préfixe pour les identifiants de sommets. L'implémentation utilise
 * l'assembleur associé et une identification par compteur.
 * @param noms noms des utilisateurs.
 * @param prefixeIdentifiants préfixe des identifiants de sommets.
 */
export function creerReseauTchatEnAnneau(
    noms: ReadonlyArray<string>,
    prefixeIdentifiants: string): ReseauTchatMutable {
    let assembleur: AssembleurReseauTchatEnAnneau =
        creerAssembleurReseauTchatEnAnneau(noms);
    let identification: Identification<'sommet'>
        = creerIdentificationParCompteur(prefixeIdentifiants);
    assembleur.nomsUtilisateurs().forEach((nom: string, i: number, tab: string[]) => {
        let s: FormatSommetTchat
            = { ID: identification.identifier('sommet'), pseudo: tab[i] };
        assembleur.ajouterSommet(s);
    });
    return assembleur.assembler();
}

