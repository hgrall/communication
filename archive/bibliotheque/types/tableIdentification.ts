import { Enveloppe, TypeEnveloppe } from './enveloppe';
import { FormatTableMutable, FormatTable, MODULE_TABLE, EtiquetteTable, conversionFormatTable, FABRIQUE_TABLE } from './table';
import { Identifiant, identifiant } from './identifiant';
import { jamais, Mutable, Unite } from './typesAtomiques';
import { Option } from './option';


/**
 * Format JSON pour les tables d'identification mutables.
 * Structure :
 * - identification
 *   - mutable : marqueur de mutabilité
 *   - taille : taille de la table
 *   - table : type indexé associant à la valeur d'un identifiant (une chaîne)
 *     une valeur dans T
 * - sorte : sorte des identifiants (une chaîne)
 * @param Sorte sorte des identifiants
 * @param T type des images
*/
export interface FormatTableIdentificationMutable<Sorte extends string, T> {
    readonly mutable: Unite,
    identification: FormatTableMutable<T>,
    readonly sorte: Sorte
}

export function creerTableIdentificationMutableEnJSON<Sorte extends string, T>(
    t: FormatTableMutable<T>, s: Sorte):
    FormatTableIdentificationMutable<Sorte, T> {
    return {
        "mutable": Unite.ZERO,
        "identification": t,
        "sorte": s
    };
}

/**
 * Format JSON pour les tables d'identifications.
 * Structure :
 * - identification
 *   - taille : taille de la table
 *   - table : type indexé associant à la valeur d'un identifiant (une chaîne)
 *     une valeur dans T
 * - sorte : sorte des identifiants (une chaîne)
 * @param Sorte sorte des identifiants (information pour le typage)
 * @param T type des images
*/
export interface FormatTableIdentification<Sorte extends string, T> {
    readonly identification: FormatTable<T>,
    readonly sorte: Sorte
}

/**
 * Fabrique d'une table d'identification en JSON à partir d'une table en JSON.
 * Précondition : les clés de la table doivent être des valeurs d'identifiants
 * de la sorte passée en argument.
 * @param t table en JSON.
 * @param s sorte des identifiants.
 */
export function tableIdentificationEnJSON<Sorte extends string, T>(
    t: FormatTable<T>, s: Sorte):
    FormatTableIdentification<Sorte, T> {
    return {
        "identification": t,
        "sorte": s
    };
}


/**
 * Conversion fonctorielle d'une table d'identification mutable
 * en une table d'identification.
 * @param conv fonction de conversion des éléments.
 * @returns fonction de conversion transformant une table d'identification
 *          mutable en une nouvelle table d'identification
 *          après composition avec conv.
 */
export function conversionFormatTableIdentification<
    Sorte extends string, TIN, TEX
    >(conv: (x: TIN) => TEX, s: Sorte)
    : (t: FormatTableIdentificationMutable<Sorte, TIN>)
        => FormatTableIdentification<Sorte, TEX> {
    return (
        (t: FormatTableIdentificationMutable<Sorte, TIN>) => {
            return tableIdentificationEnJSON(
                MODULE_TABLE.applicationFonctorielle(t.identification, conv),
                s
            );
        });
}

export interface TableIdentification<Sorte extends string, TEX>
    extends TypeEnveloppe<FormatTableIdentification<Sorte, TEX>, EtiquetteTable> {
    iterer(
        f: (ID_sorte: Identifiant<Sorte>, val: TEX, tab?: { [cle: string]: TEX }, taille?: number) => void
    ): void;
    valeur(ID_sorte: Identifiant<Sorte>): TEX;
    contient(ID_sorte: Identifiant<Sorte>): boolean;
    image(): ReadonlyArray<TEX>;
    domaine(): ReadonlyArray<Identifiant<Sorte>>;
    selectionCle(): Identifiant<Sorte>;
    selectionCleSuivantCritere(prop: (x: TEX) => boolean): Identifiant<Sorte>;
    taille(): number;
    estVide(): boolean;
}


/**
 * Table d'identification mutable utilisant la valeur d'identificateurs
 * comme clé.
 */
export interface TableIdentificationMutable<Sorte extends string, TIN, TEX>
    extends TableIdentification<Sorte, TEX> {
    itererEtat(
        f: (ID_sorte: Identifiant<Sorte>, val: TIN, tab?: { [cle: string]: TIN }, taille?: number) => void
    ): void;
    valeurEtat(ID_sorte: Identifiant<Sorte>): TIN;
    imageEtat(): ReadonlyArray<TIN>;
    selectionCleSuivantCritereEtat(prop: (x: TIN) => boolean): Identifiant<Sorte>;
    ajouter(ID_sorte: Identifiant<Sorte>, x: TIN): Option<TIN>;
    retirer(ID_sorte: Identifiant<Sorte>): Option<TIN>;
}

/**
 * Table d'identification mutable utilisant la valeur d'identificateurs
 * comme clé.
 */
export class TableIdentificationMutableParEnveloppe<Sorte extends string, TIN, TEX>
    extends Enveloppe<
    FormatTableIdentificationMutable<Sorte, TIN>,
    FormatTableIdentification<Sorte, TEX>, EtiquetteTable>
    implements TableIdentificationMutable<Sorte, TIN, TEX> {
    protected sorte: Sorte; // la sorte des clés
    protected etatVersVal: (x: TIN) => TEX;
    constructor(
        sorte: Sorte,
        etatVersVal: (x: TIN) => TEX,
        table: FormatTableIdentificationMutable<Sorte, TIN> =
            creerTableIdentificationMutableEnJSON(FABRIQUE_TABLE.creerVideMutable(), sorte)
    ) {
        super(conversionFormatTableIdentification(etatVersVal, sorte), table);
        this.sorte = sorte;
        this.etatVersVal = etatVersVal;
    }

    net(e: EtiquetteTable): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map((v, i, t) => JSON.stringify(v)).toString();
            case 'image': return this.image().map((v, i, t) => JSON.stringify(v)).toString();
            case 'graphe': return JSON.stringify(this.val().identification.table);
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('graphe');
    }

    itererEtat(
        f: (ID_sorte: Identifiant<Sorte>, val: TIN, tab?: { [cle: string]: TIN }, taille?: number) => void
    ): void {
        MODULE_TABLE.iterer((id, v, tab, taille) =>
            f(identifiant(this.sorte, id), v, tab, taille), this.etat().identification);
    }
    iterer(
        f: (ID_sorte: Identifiant<Sorte>, val: TEX) => void
    ): void {
        this.itererEtat((c, v) => f(c, this.etatVersVal(v)))
        // moins efficace (deux parcours) : MODULE_TABLE.iterer(f, this.ex());
    }

    valeurEtat(ID_sorte: Identifiant<Sorte>): TIN {
        return MODULE_TABLE.valeur(this.etat().identification, ID_sorte.val);
    }

    valeur(ID_sorte: Identifiant<Sorte>): TEX {
        return this.etatVersVal(this.valeurEtat(ID_sorte));
    }
    contient(ID_sorte: Identifiant<Sorte>): boolean {
        return MODULE_TABLE.contient(this.etat().identification, ID_sorte.val);
    }
    imageEtat(): ReadonlyArray<TIN> {
        return MODULE_TABLE.image(this.etat().identification);
    }
    image(): ReadonlyArray<TEX> {
        return MODULE_TABLE.transformationFonctorielleEnTableau(this.etat().identification, (c, v) => this.etatVersVal(v));
        // moins efficace : MODULE_TABLE.image(this.val());
    }

    domaine(): ReadonlyArray<Identifiant<Sorte>> {
        return MODULE_TABLE.transformationFonctorielleEnTableau(this.etat().identification, (c, v) => identifiant(this.sorte, c));
        // moins efficace : return MODULE_TABLE.domaine(this.etat()).
        //    map((s) => { return { val: s, sorte: this.sorte } });
    }
    selectionCle(): Identifiant<Sorte> {
        return identifiant(this.sorte, MODULE_TABLE.selectionCle(this.etat().identification), );
    }
    selectionCleSuivantCritereEtat(prop: (x: TIN) => boolean): Identifiant<Sorte> {
        return identifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.etat().identification, prop));
    }

    selectionCleSuivantCritere(prop: (x: TEX) => boolean): Identifiant<Sorte> {
        return this.selectionCleSuivantCritereEtat(x => prop(this.etatVersVal(x)));
        // moins efficace : MODULE_TABLE.selectionCleSuivantCritere(this.ex(), prop);
    }

    taille(): number {
        return MODULE_TABLE.taille(this.etat().identification);
    }
    estVide(): boolean {
        return this.taille() === 0;
    }

    ajouter(ID_sorte: Identifiant<Sorte>, x: TIN): Option<TIN> {
        return MODULE_TABLE.ajouter(this.etat().identification, ID_sorte.val, x);
    }

    retirer(ID_sorte: Identifiant<Sorte>): Option<TIN> {
        return MODULE_TABLE.retirer(this.etat().identification, ID_sorte.val);
    }
}
export function creerTableIdentificationMutableVide<Sorte extends string, TIN, TEX>(
    sorte: Sorte,
    etatVersVal: (x: TIN) => TEX
) {
    return new TableIdentificationMutableParEnveloppe<Sorte, TIN, TEX>(sorte, etatVersVal);
}
/*
* Création par copie de la table.
*/
export function creerTableIdentificationMutableParCopie<Sorte extends string, TIN, TEX>(
    sorte: Sorte, etatVersVal: (x: TIN) => TEX,
    table: FormatTableIdentification<Sorte, TIN>
) {
    let r = creerTableIdentificationMutableVide(sorte, etatVersVal);
    MODULE_TABLE.iterer((c, v) => r.ajouter(identifiant(sorte, c), v), table.identification);
    return r;
}

/*
 *  Création d'une enveloppe de la table passée en argument (qui est donc partagée).
 */
export function creerTableIdentificationMutableParEnveloppe<Sorte extends string, TIN, TEX>(
    sorte: Sorte, etatVersVal: (x: TIN) => TEX,
    table: FormatTableIdentificationMutable<Sorte, TIN>
) {
    return new TableIdentificationMutableParEnveloppe<Sorte, TIN, TEX>(sorte, etatVersVal, table);
}



// TODO commentaires version immutable.
export class TableIdentificationParEnveloppe<Sorte extends string, TEX>
    extends Enveloppe<
        FormatTableIdentification<Sorte, TEX>,
        FormatTableIdentification<Sorte, TEX>, EtiquetteTable>
    implements TableIdentification<Sorte, TEX> {

    constructor(
        protected sorte: Sorte,
        table: FormatTableIdentification<Sorte, TEX> =
            tableIdentificationEnJSON(FABRIQUE_TABLE.vide(), sorte)
    ) {
        super((x) => x, table);
    }

    net(e: EtiquetteTable): string {
        switch (e) {
            case 'taille': return this.taille().toString();
            case 'domaine': return this.domaine().map((v, i, t) => JSON.stringify(v)).toString();
            case 'image': return this.image().map((v, i, t) => JSON.stringify(v)).toString();
            case 'graphe': return JSON.stringify(this.val().identification.table);
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('graphe');
    }

    val(): FormatTableIdentification<Sorte, TEX> {
        return this.etat();
    }

    iterer(
        f: (ID_sorte: Identifiant<Sorte>, val: TEX, tab?: { [cle: string]: TEX }, taille?: number) => void
    ): void {
        MODULE_TABLE.iterer((id, v, tab, taille) => f(identifiant(this.sorte, id), v, tab, taille), this.etat().identification);
    }

    valeur(ID_sorte: Identifiant<Sorte>): TEX {
        return MODULE_TABLE.valeur(this.etat().identification, ID_sorte.val);
    }

    contient(ID_sorte: Identifiant<Sorte>): boolean {
        return MODULE_TABLE.contient(this.etat().identification, ID_sorte.val);
    }
    image(): ReadonlyArray<TEX> {
        return MODULE_TABLE.image(this.etat().identification);
    }
    domaine(): ReadonlyArray<Identifiant<Sorte>> {
        return MODULE_TABLE.transformationFonctorielleEnTableau(this.etat().identification, (c, v) => identifiant(this.sorte, c));
    }
    selectionCle(): Identifiant<Sorte> {
        return identifiant(this.sorte, MODULE_TABLE.selectionCle(this.etat().identification));
    }
    selectionCleSuivantCritere(prop: (x: TEX) => boolean): Identifiant<Sorte> {
        return identifiant(this.sorte, MODULE_TABLE.selectionCleSuivantCritere(this.etat().identification, prop));
    }

    taille(): number {
        return MODULE_TABLE.taille(this.etat().identification);
    }
    estVide(): boolean {
        return this.taille() === 0;
    }

}

export function tableIdentification<Sorte extends string, TEX>(
    sorte: Sorte,
    table: FormatTable<TEX>)
    : TableIdentification<Sorte, TEX> {
    return new TableIdentificationParEnveloppe<Sorte, TEX>(
        sorte,
        tableIdentificationEnJSON(table, sorte)
    );
}

