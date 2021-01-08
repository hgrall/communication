/*
- mots binaires formés de ZERO (valant 0) et UN (valant 1).
*/


import { Tableau, FormatTableau, TableauParEnveloppe, TableauParEnveloppePlate, EtiquetteTableau } from './tableau';
import { Deux } from './typesAtomiques';
import { entierAleatoire } from './nombres';
import { TypeEnveloppe } from './enveloppe';

/**
 * Schéma JSON pour représenter des mots en binaire :
 * - { taille: Naturel, tableau: [(Deux.ZERO | Deux.UN), ...] }.
 * Remaque : Deux.Zero == 0, Deux.UN == 1.
 */
export type FormatMot = FormatTableau<Deux>;

export interface Mot extends TypeEnveloppe<FormatMot, EtiquetteTableau> {
  /**
   * Représentation sous la forme "ZERO | UN.ZERO | UN. etc.".
   * @return une représentation binaire littérale utilisant Zero et UN, et un point pour séparateur.
   */
  base2Litteral(): string;
  /**
   * Représentation sous la forme "(0 | 1)*".
   * @return la représentation binaire utilisant 0 et 1, sans séparateur.
   */
  base2(): string;
  /**
   * Représentation sous la forme d'un entier naturel décimal.
   * @return la valeur (en base 10, comme number).
   */
  base10(): number;
  /**
   * Tableau JSON composé de ZERO et de UN.
   * @return le tableau de {ZERO, UN}.
   */
  tableauBinaire(): ReadonlyArray<Deux>;
  /**
   * Taille du mot binaire.
   */
  taille(): number;
  /**
    * Valeur du bit en position index. Précondition : la position est entre zéro et la
     * longueur moins un.
     * @param index position dans le mot, la position zéro étant à gauche.
     */
  bit(index: number): Deux;
}

/**
 * Classe représentant des mots en binaire par
 * un tableau.
 * - Tableau de {ZERO, UN}.
 */
class MotParTableau extends TableauParEnveloppePlate<Deux> implements Mot {
  /**
   * Constructeur à partir d'une représentation JSON.
   * - Pratique : utiliser la fabrique <a href="file:../modules/_binaire_.html#mot">mot</a>.
   *
   * @param etat représentation du mot sous la forme
   *  { taille: Naturel, tableau: [(0 | Deux.Zero | 1 | Deux.un), ...] }.
   */
  constructor(etat: FormatMot) {
    super(etat);
  }
  /**
   * Utilisation de la représentation nette "valeurs".
   * @return une représentation du tableau de {0 , 1}.
   */
  representation(): string {
    return '[' + this.net('valeurs') + ']';
  }

  /**
   * Application pour convertir en ZERO (0) ou UN (1), puis réduction pour
   * concaténer et séparer par un point et troncature
   * pour enlever le point initial.
   * @return une représentation binaire littérale utilisant Zero et UN,
   * et un point pour séparateur.
   */
  base2Litteral(): string {
    return this.application(v => Deux[v])
      .reduction('', (x, y) => x + '.' + y)
      .slice(1);
  }
  /**
   * Application pour convertir en chaîne puis réduction pour concaténer.
   * @return la représentation binaire utilisant 0 et 1, sans séparateur.
   */
  base2(): string {
    return this.application(v => v.toString())
      .reduction('', (x, y) => x + y);
  }
  /**
   * Représentation sous la forme d'un entier naturel décimal.
   * @return la valeur (en base 10, comme number).
   */
  base10(): number {
    return parseInt(this.base2(), 2);
  }
  /**
   * Alias de l'attribut tableau de l'état.
   * @return le tableau de {ZERO, UN}.
   */
  tableauBinaire(): ReadonlyArray<Deux> {
    return this.etat().tableau;
  }
  /**
   * Alias de valeur.
   * @param index position dans le mot, la position zéro étant à gauche.
   */
  bit(index: number): Deux {
    return this.valeur(index);
  }
}

/**
 * Fabrique d'un mot binaire à partir d'un tableau de {0, 1} ou de {ZERO, UN}.
 * @param mot
 * @returns un mot binaire formé à partir du tableau mot.
 */
export function mot(mot: ReadonlyArray<Deux>): Mot {
  return new MotParTableau({
    taille: mot.length,
    tableau: mot
  });
}

/**
 * Taille de l'entier naturel en base deux.
 * @param n entier naturel (précondition : n >= 0).
 * @returns taille de n en base deux.
 */
export function tailleEnBinaire(n: number): number {
  return n.toString(2).length;
}

/**
 * Fabrique d'un mot binaire à partir d'un entier naturel.
 * @param n un entier naturel (précondition : n >= 0).
 * @returns un mot binaire formé à partir de l'entier naturel.
 */
export function binaire(n: number): Mot {
  let s: string[] = Array.from(n.toString(2));
  return mot(
    s.map((v, i, t) => {
      switch (v) {
        case '0':
          return Deux.ZERO;
        case '1':
          return Deux.UN;
        default:
          throw new Error('[Erreur : binaire(' + n.toString + ') non défini.');
      }
    })
  );
}
/**
 * Concaténation de deux mots binaires.
 * - L'ensemble des mots binaires forme un monoïde.
 * @param mot1 premier mot
 * @param mot2 second mot
 * @returns la concaténation mot1.mot2.
 */
export function concatMot(mot1: Mot, mot2: Mot): Mot {
  var tab1 = mot1.val().tableau;
  var tab2 = mot2.val().tableau;
  var total = tab1.concat(tab2);
  return mot(total);
}

/**
 * Fabrique des premiers mots binaires.
 * @param n entier naturel égal au successeur du maximum.
 * @returns tableaux de mots binaires contenant 0, ..., n-1.
 */
export function premiersBinaires(n: number): ReadonlyArray<Mot> {
  let r = [];
  for (let i = 0; i < n; i++) {
    r.push(i);
  }
  return r.map((v, i, tab) => binaire(v));
}

/**
 * Fabrique d'un mot binaire aléatoire de taille fixée.
 * @param taille longueur du mot
 * @returns un mot de longueur taille dont les bits sont calculés aléatoirement.
 */
export function motAleatoire(taille: number): Mot {
  let r = [];
  for (let i = 0; i < taille; i++) {
    r.push(entierAleatoire(2));
  }
  return mot(r);
}

/**
 * Test de l'égalité de deux mots.
 * @param premier mot
 * @param second mot
 * @returns true si les mots sont égaux, faux sinon.
 */
export function egaliteMots(mot1: Mot, mot2: Mot): boolean {
  if (mot1.taille() !== mot2.taille()) {
    return false;
  }
  for (let i = 0; i < mot1.taille(); i++) {
    if (mot1.bit(i) !== mot2.bit(i)) {
      return false;
    }
  }
  return true;
}

/*
// Nombre aleatoire different de actuel - précondition : max >= 0.
export function entierAleatoireFrais(max: number, actuel: number) {
  if ((max == 0) && (actuel == 0)) {
    throw new Error("* Erreur pour entierAleatoireFrais : [0, 0] - 0 = vide");
  }
  if (max == 0)
    return 0;

  var r = entierAleatoire(max - 1);
  if (r >= actuel) {
    r = r + 1;
  }
  return r;
}

// Genere un tableau aléatoire.
// Actuel : element actuel qu'on genere automatique (user ou domaine)
export function tableauBinaireAleatoire(nbMax: number, actuel: number): ReadonlyArray<Deux> {
  var nbAleat = entierAleatoireFrais(nbMax, actuel);
  var tableauAleat = binaire(nbAleat).tableauBinaire();
  var tableauMax = binaire(nbMax).tableauBinaire();
  tableauAleat = completerTableauParZeros(nbMax, tableauAleat);
  return tableauAleat;
}

//complete un tableau Aleatoire par des zeros pour qu'il soit de la taille du nombre max
export function completerTableauParZeros(nb: number, tab: ReadonlyArray<Deux>) {
  var tableauMax = binaire(nb).tableauBinaire();
  let zero = binaire(0).tableauBinaire();
  while (tab.length != tableauMax.length) {
    tab = zero.concat(tab);
  }
  return tab;
}
*/