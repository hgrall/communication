// import * as crypto from "crypto-browserify";

const CONFIG = require('../../config.json');

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

/**
import {Buffer} from 'buffer/';
/**
 * Obtenir les configurations à partir du code d'accès.
 * Identifiant dans config.json : le code d'accès chiffré avec la clé publique (RSA)
 * @param code le code d'accès déjà validé
 *
export function obtenirConfigCodeChiffre(code: string): number {
    let nombreUtilisateurs = 15; // default

    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey)
        for (let config in CONFIG) {
            // Déchiffrer l'identifiant de chaque configuration, vérifier si correspond au code d'accès
            let buffer = Buffer.from(config, 'base64');
            let plaintext = crypto.privateDecrypt(privateKey, buffer);
            let codeConfig = plaintext.toString('utf8');
            if (code == codeConfig)
                nombreUtilisateurs = CONFIG[config].nombreUtilisateurs;
        }

    console.log("# nombreUtilisateurs : " + nombreUtilisateurs);
    return nombreUtilisateurs;

    // pour chiffrer :
    // const publicKey = "-----BEGIN PUBLIC KEY-----\n" +
    //         "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIYDo5ehgA4OcgR2TL3vmI50jgOVK8ZB\n" +
    //         "dJJ+R6yatsnEqhlIovU/wxZBXfFWGp83OQMtc4mhmpJMs570dKgl1lcCAwEAAQ==\n" +
    //         "-----END PUBLIC KEY-----";
    // let buffer = new Buffer(config);
    // let encrypted = crypto.publicEncrypt(publicKey, buffer);
    // return encrypted.toString('base64');
}
*/
