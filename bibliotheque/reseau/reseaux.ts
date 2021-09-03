/*
- réseau ::= noeud*

- Réseau mutable vs réseau
- Fonctions d'assemblage de réseaux utilisant un réseau mutable
  et produisant un réseau mutable.
  - Remarque : une
- Un réseau mutable peut être converti en un réseau.
*/
import {
    FormatIdentifiable, Identifiant
} from "../types/identifiant";

import {
    FABRIQUE_TABLE
} from "../types/table";

import {
    TableIdentificationMutable,
    tableIdentification,
    FormatTableIdentification,
    creerTableIdentificationMutableEnJSON,
    FormatTableIdentificationMutable,
    TableIdentificationMutableParEnveloppe
} from "../types/tableIdentification";

import {
    TableauMutable, Tableau, tableau, TableauMutableParEnveloppe
} from "../types/tableau";

import {
    FormatNoeud, FormatNoeudMutable, NoeudMutable
} from "./noeuds";

import {
    Unite
} from "../types/typesAtomiques";

import {
    TypeEnveloppe
} from "../types/enveloppe";

import {
    EtiquetteTable
} from "../types/table";

/**
 * Description JSON d'un réseau comme table d'identification associant
 * à un identifiant de sommet un noeud paramétré par le type des sommets.
 */
export interface FormatReseau<S extends FormatIdentifiable<'sommet'>>
    extends FormatTableIdentification<'sommet', FormatNoeud<S>> { }

/**
 * Interface pour un réseau, paramétrée par le type des sommets.
 * Un réseau est vu comme une table d'identification formée de noeuds.
 * @param S type décrivant les sommets en JSON.
 */
export interface Reseau<S extends FormatIdentifiable<'sommet'>>
    extends TypeEnveloppe<
    FormatReseau<S>,
    EtiquetteTable> {
    /**
     * Détermine si le réseau possède le noeud identifié par l'argument.
     * @param ID_sommet identité du sommet au centre du noeud.
     * @returns true si le réseau possède ce noeud, false sinon.
     */
    possedeNoeud(ID_sommet: Identifiant<'sommet'>): boolean;
    /**
     * Détermine si les deux noeuds identifiés par les arguments sont voisins.
     * Précondition : les noeuds appartiennent au réseau.
     * @param ID_sommet1 identité du sommet au centre du premier noeud.
     * @param ID_sommet2 identité du sommet au centre du second noeud.
     */
    sontVoisins(ID_sommet1: Identifiant<'sommet'>,
        ID_sommet2: Identifiant<'sommet'>): boolean;
    /**
     * Itère une procédure sur chaque association (identifiant, noeud)
     * du réseau.
     * @param f procédure appelée à chaque itération.
     */
    iterer(f: (id: Identifiant<'sommet'>, n: FormatNoeud<S>) => void): void;
    /**
     * Noeud associé au sommet identifié par l'argument.
     * Précondition : le noeud appartient au réseau.
     * @param ID_sommet identité du sommet au centre du noeud.
     * @returns description en JSON du noeud.
     */
    noeud(ID_sommet: Identifiant<'sommet'>): FormatNoeud<S>;
    /**
     * Tableau des identifiants des noeuds faisant partie du réseau.
     */
    identifiantsNoeuds(): ReadonlyArray<Identifiant<'sommet'>>;
    /**
     * Sélection d'un noeud appartenant au réseau.
     * Précondition : le réseau n'est pas vide. Si ce n'est pas le cas,
     * une exception est levée.
     * @returns l'identité du noeud sélectionné.
     */
    selectionNoeud(): Identifiant<'sommet'>;
    /**
     * Nombre de noeuds dans le réseau.
     */
    taille(): number;
}

/**
 * Interface pour un réseau mutable, paramétrée par le type des sommets.
 * @param S type décrivant les sommets en JSON
 *
 * Remarque : le réseau ne modifie ni les sommets ni les noeuds.
 * Conséquence : un seul format est utilisé,,
 *   pour les sommets et pour les noeuds respectivement.
 */
export interface ReseauMutable<S extends FormatIdentifiable<'sommet'>> extends
    Reseau<S> {
    /**
     * Ajoute un noeud au réseau.
     * L'état du réseau n'est pas garanti lors des ajouts : seule la
     * cohérence finale est garantie. Voir les assemblages de réseau.
     * @param n description du noeud à ajouter en JSON.
     */
    ajouterNoeud(n: FormatNoeud<S>): void;
    /**
     * Retire un noeud du réseau.
     * L'état du réseau après un retrait n'est pas garantie.
     * @param n description du noeud à retirer en JSON.
     */
    retirerNoeud(n: FormatNoeud<S>): void;
}

/**
 * Réseau abstrait mutable implémenté comme une table mutable d'identification
 * de noeuds. La représentation est abstraite et doit être
 * implémentée dans les classes concrètes dérivées.
 * @param S description des sommets en JSON
 */
export abstract class ReseauMutableParTableDeNoeuds<S extends FormatIdentifiable<'sommet'>>
    extends TableIdentificationMutableParEnveloppe<'sommet', FormatNoeud<S>, FormatNoeud<S>>
    implements ReseauMutable<S> {

    /**
     * Constructeur sans paramètres appelant le constructeur parent
     * en indiquant la sorte des identificateurs (soit "sommet") et
     * la fonction de conversion des images internes et externes (soit l'identité).
     */
    constructor() {
        super('sommet', (x) => x);
    }
    /**
     * Représentation abstraite du réseau.
     */
    abstract representation(): string;

    /**
     * Alias de "contient".
     */
    possedeNoeud(ID_sommet: Identifiant<'sommet'>): boolean {
        return this.contient(ID_sommet);
    }
    /**
     * Détermine si les deux noeuds identifiés par les arguments sont voisins,
     * en vérifiant si le second noeud appartient aux vosins du permier noeud.
     * Précondition : les noeuds appartiennent au réseau.
     * @param ID_sommet1 identité du sommet au centre du premier noeud.
     * @param ID_sommet2 identité du sommet au centre du second noeud.
     */
    sontVoisins(ID_sommet1: Identifiant<'sommet'>,
        ID_sommet2: Identifiant<'sommet'>): boolean {
        return tableIdentification(
            'sommet',
            this.valeurEtat(ID_sommet1).voisins.identification
        ).contient(ID_sommet2);
    }
    /**
     * Alias de la méthode protégée itererEtat.
     * @param f procédure appelée à chaque itération.
     */
    iterer(f: (id: Identifiant<'sommet'>, n: FormatNoeud<S>) => void) {
        this.itererEtat(f);
    }
    /**
     * Alias de "valeurEtat", méthode protégée.
     * Précondition : le noeud appartient au réseau.
     * @param ID_sommet identité du sommet au centre du noeud.
     * @returns description en JSON du noeud.
     */
    noeud(ID_sommet: Identifiant<'sommet'>): FormatNoeud<S> {
        return this.valeurEtat(ID_sommet);
    }
    /**
     * Alias de "domaine", méthode héritée mais absente de l'interface.
     */
    identifiantsNoeuds(): ReadonlyArray<Identifiant<'sommet'>> {
        return this.domaine();
    }
    /**
     * Alias de "domaine", méthode héritée mais absente de l'interface.
     */
    selectionNoeud() {
        return this.selectionCle();
    }
    /**
     * Ajoute à la table sous-jacente l'association (identifiant du noeud, noeud).
     * @param n description du noeud à ajouter en JSON.
     */
    ajouterNoeud(n: FormatNoeud<S>): void {
        this.ajouter(n.centre.ID, n);
    }
    /**
     * Retire de la table sous-jacente l'association déterminée
     * par l'identifiant du noeud.
     * @param n description du noeud à retirer en JSON.
     */
    retirerNoeud(n: FormatNoeud<S>): void {
        this.retirer(n.centre.ID);
    }
    /**
     * Taille de la table d'identification enveloppée.
     */
    taille(): number {
        return this.etat().identification.taille;
    }
}

/**
 * Fabrique un noeud mutable en JSON.
 * @param S type décrivant les sommets en JSON.
 * @param centre sommet au centre du noeud.
 */
export function creerEnJSONNoeudMutableSansVoisins<S extends FormatIdentifiable<'sommet'>>(centre: S)
    : FormatNoeudMutable<S> {
    const t: FormatTableIdentificationMutable<'sommet', S>
        = creerTableIdentificationMutableEnJSON(FABRIQUE_TABLE.creerVideMutable(), 'sommet');
    return { centre: centre, voisins: t, mutable: Unite.ZERO };
}

/**
 * Interface pour assembler un réseau à partir de sommets.
 * Une implémentation est produite par topologie de réseau : anneau, étoile, etc..
 * @param S type décrivant les sommets en JSON.
 * @param R sous-type de ReseauMutable<S>
 */
export interface AssembleurReseau<S extends FormatIdentifiable<'sommet'>,
    R extends ReseauMutable<S>> {
    /**
     * Fabrique un réseau mutable vide.
     */
    creerReseauMutableVide(): R;
    /**
     * Ajoute le sommet au réseau en cours d'assemblage.
     * @param sommet en JSON
     */
    ajouterSommet(s: S): void;
    /**
     * Réalise l'assemblage final et produit le réseau mutable
     * formé des sommets ajoutés.
     */
    assembler(): R;
}

/**
 * Assembleur abstrait d'un réseau en anneau implémenté par un tableau mutable
 * de sommetss. Seule la fabrique d'un réseau mutable vide est à
 * implémenter.
 * Dans un réseau en anneau, chaque noeud a deux voisins.
 * @param S type décrivant les sommets en JSON.
 */
export abstract class AssembleurReseauEnAnneau<
    S extends FormatIdentifiable<'sommet'>,
    R extends ReseauMutable<S>>
    extends TableauMutableParEnveloppe<S, S>
    implements AssembleurReseau<S, R> {
    /**
     * Constructeur à deux paramètres, également attributs de l'état.
     * Remarque :
     * @param nombreSommets nombre total de sommets.
     * @param fabriqueNoeudSansVoisins une fabrique de noeuds sans voisins.
     */
    constructor(
        private nombreSommets: number,
        private fabriqueNoeudSansVoisins: (centre: S) => NoeudMutable<S>
    ) {
        super(x => x)
        console.log("* Construction d'un réseau en anneau de " + nombreSommets.toString() + " éléments.");
    }
    /**
     * Fabrique un réseau mutable vide. A implémenter.
     */
    abstract creerReseauMutableVide(): R;
    /**
     * Ajoute le sommet au tableau mutable de sommets,
     * si le nombre total n'est pas atteint, lance une erreur sinon.
     * @param s un sommet décrit en JSON.
     */
    ajouterSommet(s: S): void {
        if (this.taille() < this.nombreSommets) {
            this.ajouterEnFin(s);
        } else {
            console.log("- Impossible d'ajouter un sommet : le réseau en anneau est complet.");
            throw new Error("[Exception : AssemblageReseau.ajouterSommet non défini.]")
        }
    }
    /**
     * Assemble et produit le réseau en anneau, si le nombre attendu de sommets
     * est atteint, lance une exception sinon.
     * Un noeud associé à un sommet a pour voisins
     * le sommet prédécesseur et le sommet successeur dans le tableau de sommets,
     * une fois les extrémités reliées.
     */
    assembler(): R {
        let restant = this.nombreSommets - this.taille();
        if (restant > 0) {
            console.log("- Impossible d'assembler un réseau en anneau de la taille donnée : ajouter " + restant + " sommets.");
            throw new Error("[Exception : AssemblageReseau.assembler non défini.]")
        }
        // Définition du réseau
        let reseau: R = this.creerReseauMutableVide();
        this.iterer((i: number, s: S) => {
            let n: NoeudMutable<S> = this.fabriqueNoeudSansVoisins(s);
            n.ajouterVoisin(this.valeurEtat((i + 1) % this.nombreSommets));
            n.ajouterVoisin(this.valeurEtat((i + (this.nombreSommets - 1)) % this.nombreSommets));
            reseau.ajouterNoeud(n.val());
        });
        console.log("* Fin de la construction d'un réseau en anneau de "
            + this.nombreSommets.toString() + " éléments : "
            + reseau.representation());
        return reseau;
    }

    /* TODO inutile !
    tableauSommets(): Tableau<S> {
        return tableau(this.etat().tableau);
    }*/
}

/**
 * Assembleur d'un réseau en étoile implémenté par un tableau mutable
 * de sommetss. Seule la fabrique d'un réseau mutable vide est à
 * implémenter.
 * Le réseau forme un graphe complet : chaque noeud est relié à tous les autres noeuds.
 * Il est dit en étoile car un tel réseau est souvent réalisé à partir d'un centre relié
 * à tous les noeuds du réseau, toute communication passant par le centre.
 * @param S type décrivant les sommets en JSON.
 */

export abstract class AssembleurReseauEnEtoile<
    S extends FormatIdentifiable<'sommet'>,
    R extends ReseauMutable<S>>
    extends TableauMutableParEnveloppe<S, S>
    implements AssembleurReseau<S, R> {

    /**
     * Constructeur à deux paramètres, également attributs de l'état.
     * Remarque :
     * @param nombreSommets nombre total de sommets.
     * @param fabriqueNoeudSansVoisins une fabrique de noeuds sans voisins.
     */
    constructor(
        private nombreSommets: number,
        private fabriqueNoeudSansVoisins: (centre: S) => NoeudMutable<S>
    ) {
        super(x => x)
        console.log("* Construction d'un réseau complet en étoile de " + nombreSommets.toString() + " éléments.");
    }
    /**
     * Fabrique un réseau mutable vide. A implémenter.
     */
    abstract creerReseauMutableVide(): R;
    /**
     * Ajoute le sommet au tableau mutable de sommets,
     * si le nombre total n'est pas atteint, lance une erreur sinon.
     * @param s un sommet décrit en JSON.
     */
    ajouterSommet(s: S): void {
        if (this.taille() < this.nombreSommets) {
            this.ajouterEnFin(s);
        } else {
            console.log("- Impossible d'ajouter un sommet : le réseau en étoile est complet.");
        }
    }
    /**
     * Assemble et produit le réseau en étoile, si le nombre attendu de sommets
     * est atteint, lance une exception sinon.
     * Un noeud associé à un sommet a pour voisins tous les autres sommets.
     */
    assembler(): R {
        let restant = this.nombreSommets - this.taille();
        if (restant > 0) {
            console.log("- Impossible d'assembler un réseau en étoile de la taille donnée : ajouter "
                + restant + " sommets.");
            throw new Error("[Exception : AssemblageReseau.assembler non défini.]")
        }
        // Définition du réseau
        let reseau: R = this.creerReseauMutableVide();
        this.iterer((i: number, s: S) => {
            let n: NoeudMutable<S> = this.fabriqueNoeudSansVoisins(s);
            this.itererEtat((j: number, sa: S) => {
                if (i != j) {
                    n.ajouterVoisin(sa);
                }
            });
            reseau.ajouterNoeud(n.val());
        });
        console.log("* Fin de la construction d'un réseau complet en étoile de "
            + this.nombreSommets.toString() + " éléments : "
            + reseau.representation());
        return reseau;
    }

}


