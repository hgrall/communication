// import * as crypto from "crypto-browserify";

const CONFIG = require('../../config.json');

/**
 * Vérifie si le code d'accès es valide
 * @param code code d'accès
 * */
export function codeAccesEstValide(code: string): boolean {
    let codesValides = ["A1", "B2", "C3"]; // provisoire
    if (process.env.CODES != null)
        codesValides = process.env.CODES.split(",");
    return (codesValides.includes(code));
}

/**
 * Obtenir les configurations à partir du code d'accès.
 * Identifiant dans config.json : la somme des codes ASCII de chaque char du code d'accès.
 * @param code le code d'accès déjà validé
 * */
export function obtenirConfig(code: string): number {
    let nombreUtilisateurs = 15; // default

    // obtenir la somme des codes ascii de chaque char du code
    let sumAscii = code.split("").reduce((acc: number, val: string) => {
        return acc + val.charCodeAt(0);
    }, 0);

    // la somme ascii est l'identifiant de la configuration correspondante
    if (CONFIG[sumAscii.toString()])
        nombreUtilisateurs = CONFIG[sumAscii.toString()].nombreUtilisateurs;

    console.log("# nombreUtilisateurs : " + nombreUtilisateurs);
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
