/**
 * Type de cardinal un contenant ZERO (valant 0).
 * Remarque : Les enum sont des sous-types de number.
 */
export enum Unite { ZERO }
/**
 * Type de cardinal deux contenant ZERO et UN (valant 0 et 1 respectivement).
 * Remarque : Les enum sont des sous-types de number.
 */
export enum Deux {
    ZERO,
    UN
}

// Problème / readonly properties
// Cf. https://github.com/Microsoft/TypeScript/issues/13347
// Interface with readonly property is assignable to interface with mutable property.
// Remède : par défaut, les champs sont en lecture seulement. Lorsque ce n'est pas le cas, on rajoute
//   un champ (mutable : Unite). Lorsqu'il s'agit de champs indexés, on introduit un champ table contenant
//   la structure. Voir FormatTableMutable ci-dessous.
// On manipule ces structures indirectement via des modules
//   pour limiter les conversions non sûres à ces modules. Voir les modules ci-dessous.
/**
 * Marqueur utilisé systématiquement pour les types JSON mutables.
 */
export interface Mutable {
    readonly mutable: Unite
}

/**
 * Interface exprimant la propriété d'être mesurable et mutable.
 * Attributs :
 * - mutable : étiquette
 * - taille : entier naturel
 */
export interface MesurableMutable extends Mutable {
    taille: number
}

/**
 * Interface exprimant la propriété d'être mesurable et.
 * Attribut :
 * - taille : entier naturel
 */
export interface Mesurable {
    readonly taille: number
}

/*
*/

/**
 * Fonction renvoyant une erreur exprimant l'impossibilité d'une exécution.
 * Le système de types attribue le type "never" à une expression
 * lorsqu'il s'agit de code inaccessible.
 * Exemple : code inaccessible après un filtrage exhaustif.
 *
 * Documentation :
 * - never is a subtype of and assignable to every type.
 * - No type is a subtype of or assignable to never (except never itself).
 * - In a function expression or arrow function with no return type annotation,
 *   if the function has no return statements, or only return statements with expressions of type never,
 *   and if the end point of the function is not reachable (as determined by control flow analysis),
 *   the inferred return type for the function is never.
 * - In a function with an explicit never return type annotation,
 *   all return statements (if any) must have expressions of type never and the end point of the function must not be reachable.
 *
 * @param x expression inaccessible
 */
export function jamais(x: never): never {
    throw new Error("* Erreur impossible : " + x);
}
