/**
 * Vérifie si le code d'accès es valide
 * @param code code d'accès
 * */
export function codeAccesEstValide(code: string): boolean {
    let codesValides = ["IMTA_5", "IMTA_10", "IMTA_15", "IMTA_20"]; // provisoire
    if (process.env.CODES != null)
        codesValides = process.env.CODES.split(",");
    return (codesValides.includes(code));
}

/**
 * Nombre d'utilisateurs à partir du code d'accès.
 * @param code le code d'accès déjà validé
 * */
export function calculNombreUtilisateurs(code: string): number {
    let n : string = code.split("_")[1]; 
    let nombreUtilisateurs = parseInt(n, 10);
    console.log("- nombre d'utilisateurs : " + nombreUtilisateurs);
    return nombreUtilisateurs;
}

