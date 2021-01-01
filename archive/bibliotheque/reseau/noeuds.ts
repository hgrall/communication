/*
- noeud ::= (sommet, sommet*)
*/
import {
    FormatIdentifiable, Identifiant,
} from "../types/identifiant"
import {
    Enveloppe, TypeEnveloppe
} from "../types/enveloppe"
import {
    creerTableIdentificationMutableParEnveloppe,
    tableIdentification,
    tableIdentificationEnJSON,
    creerTableIdentificationMutableEnJSON,
    FormatTableIdentification,
    FormatTableIdentificationMutable,
} from "../types/tableIdentification"
import {
    conversionFormatTable,
} from "../types/table"
import { Mutable } from "../types/typesAtomiques";

/**
 * Interface pour un sommet abstrait d'un réseau,
 * dérivée de TypeEnveloppe.
 * La sorte pour les identifiants de sommets est 'sommet'.
 *
 * @param TEX type de sortie représentant un sommet.
 * @param E étiquettes utiles pour une représentation d'un sommet.
 */
export interface Sommet<
    TEX extends FormatIdentifiable<'sommet'>,
    E extends string
    >
    extends TypeEnveloppe<TEX, E> {
}

/**
 * Sommet abstrait d'un réseau, dérivé d'Enveloppe.
 * La sorte pour les identifiants de sommets est 'sommet'.
 *
 * @param TIN type d'entrée représentant un sommet.
 * @param TEX type de sortie représentant un sommet.
 * @param E étiquettes utiles pour une représentation d'un sommet.
 */
export abstract class SommetParEnveloppe<
    TIN extends FormatIdentifiable<'sommet'>,
    TEX extends FormatIdentifiable<'sommet'>,
    E extends string
    >
    extends Enveloppe<TIN, TEX, E>
    implements Sommet<TEX, E> {
}

/**
 * Format mutable pour les noeuds du réseau de tchat.
 * Structure :
 * - mutable : marqueyr de mutabilité
 * - centre : un sommet
 * - voisins : une table mutable de sommets
 *
 * @param S type représentant les sommets en JSON
 */
export interface FormatNoeudMutable<S extends FormatIdentifiable<'sommet'>>
    extends Mutable {
    readonly centre: S;
    readonly voisins: FormatTableIdentificationMutable<"sommet", S>
}

/**
 * Format pour les noeuds du réseau de tchat.
 * Structure :
 * - centre : un sommet
 * - voisins : une table de sommets
 *
 * @param S type représentant les sommets en JSON.
 */
export interface FormatNoeud<S extends FormatIdentifiable<'sommet'>> {
    readonly centre: S;
    readonly voisins: FormatTableIdentification<'sommet', S>
}

/**
 * Fonction produisant un noeud à partir d'un noeud mutable.
 *
 * @param n noeud mutable au format JSON.
 */
function conversionFormatNoeud<S extends FormatIdentifiable<'sommet'>>(
    n: FormatNoeudMutable<S>): FormatNoeud<S> {
    const v: FormatTableIdentification<'sommet', S>
        = {
        "identification": conversionFormatTable<S, S>((s) => s)(n.voisins.identification),
        "sorte": 'sommet'
    };
    return { centre: n.centre, voisins: v };
}

/**
 * Etiquettes pour les noeuds :
 * - centre,
 * - voisins.
 */
export type EtiquetteNoeud = 'centre' | 'voisins';

/**
 * Interface structurelle définissant un noeud.
 *
 * @param S type représentant un sommet en JSON.
 */
export interface Noeud<S extends FormatIdentifiable<'sommet'>>
    extends TypeEnveloppe<FormatNoeud<S>, EtiquetteNoeud> {
    /**
     * Teste si le sommet identifié par l'argument est voisin de ce noeud.
     * @param ID_sommet identifiant du sommet potentiellement voisin.
     * @returns true si le sommet identifié par ID_sommet est voisin, false sinon.
     */
    aPourVoisin(ID_sommet: Identifiant<'sommet'>): boolean;

    /**
     * Itère une procédure sur chaque voisin du noeud.
     *
     * @param proc procédure appelée à chaque itération, prenant en entrée l'identifiant
     *   du sommet et le sommet.
     */
    itererVoisins(proc: (ID_sommet: Identifiant<'sommet'>, v: S) => void): void;

}

/**
 * Interface structurelle définissant un noeud mutable dérivant de celle
 * définissant un noeud.
 *
 * @param S type représentant un sommet en JSON.
 */
export interface NoeudMutable<S extends FormatIdentifiable<'sommet'>>
    extends Noeud<S> {
    /**
     * Ajoute un sommet comme voisin.
     * @param v sommet voisin à ajouter.
     */
    ajouterVoisin(v: S): void;
}



/**
 * Noeud abstrait enveloppe d'une structure JSON
 * représentant un noeud.
 * Il reste à implémenter la méthode "net" de représentation.
 * @param S type représentant un sommet en JSON.
 */
export abstract class NoeudParEnveloppe<S extends FormatIdentifiable<'sommet'>>
    extends Enveloppe<FormatNoeud<S>, FormatNoeud<S>, EtiquetteNoeud>
    implements Noeud<S> {

    constructor(etat: FormatNoeud<S>) {
        super((x) => x, etat);
    }

    /**
     * Méthode abstraite à implémenter.
     * @param e une étiquette.
     */
    abstract net(e: EtiquetteNoeud): string;

    /**
     * Représentation d'un noeud sous la forme :
     * "(centre : ... ; voisins : ...)".
     */
    representation(): string {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    }

    aPourVoisin(ID_sommet: Identifiant<'sommet'>): boolean {
        return tableIdentification(
            'sommet',
            this.etat().voisins.identification
        ).contient(ID_sommet);
    }
    itererVoisins(proc: (ID_sommet: Identifiant<'sommet'>, v: S) => void) {
        tableIdentification(
            'sommet',
            this.etat().voisins.identification
        ).iterer(proc);
    }

    val(): FormatNoeud<S> {
        return this.etat();
    }
}

/**
 * Noeud mutable abstrait enveloppe d'une structure JSON
 * représentant un noeud mutable.
 * Il reste à implémenter la méthode "net" de représentation.
 * @param S type représentant un sommet en JSON.
 */
export abstract class NoeudMutableParEnveloppe<S extends FormatIdentifiable<'sommet'>>
    extends Enveloppe<FormatNoeudMutable<S>, FormatNoeud<S>, EtiquetteNoeud>
    implements NoeudMutable<S> {

    constructor(etat: FormatNoeudMutable<S>) {
        super(conversionFormatNoeud, etat);
    }
    /**
     * Méthode abstraite à implémenter.
     * @param e une étiquette.
     */
    abstract net(e: EtiquetteNoeud): string;
    /**
     * Représentation d'un noeud sous la forme :
     * "(centre : ... ; voisins : ...)".
     */
    representation(): string {
        return "(centre : " + this.net('centre') + " ; voisins : " + this.net('voisins') + ")";
    }
    aPourVoisin(ID_sommet: Identifiant<'sommet'>): boolean {
        return tableIdentification(
            'sommet',
            this.etat().voisins.identification
        ).contient(ID_sommet);
    }
    itererVoisins(proc: (ID_sommet: Identifiant<'sommet'>, v: S) => void) {
        tableIdentification(
            'sommet',
            this.etat().voisins.identification
        ).iterer(proc);
    }

    ajouterVoisin(v: S): void {
        creerTableIdentificationMutableParEnveloppe(
            'sommet',
            (x) => x,
            creerTableIdentificationMutableEnJSON(this.etat().voisins.identification, 'sommet')
        ).ajouter(v.ID, v);
    }

}