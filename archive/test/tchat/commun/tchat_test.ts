import * as chai from 'chai';
import * as mocha from 'mocha';

import { Identifiant } from "../../../bibliotheque/types/identifiant";

import {
    creerReseauTchatEnAnneau,
    creerReseauTchatEnEtoile,
    ReseauTchatMutable
} from "../../../tchat/serveur/generationReseaux";

import {
    noeudTchat
} from "../../../tchat/commun/echangesTchat";

const noms = ["titi", "toto", "coco", "sissi"];
const anneauA: ReseauTchatMutable = creerReseauTchatEnAnneau(noms, "A-");
const anneauE: ReseauTchatMutable = creerReseauTchatEnEtoile(noms, "E-");

let IDs_noeudsA = anneauA.identifiantsNoeuds();
let IDs_noeudsE = anneauE.identifiantsNoeuds();

for (let j in IDs_noeudsA) {
    describe('fonction creerAnneauTchat', () => {
        describe('méthode TableIdentification.possedeNoeud ', () => {
            it('renvoie true', () => {
                let resA = anneauA.possedeNoeud(IDs_noeudsA[j]);
                let resE = anneauE.possedeNoeud(IDs_noeudsE[j]);
                chai.expect(resA && resE).to.equal(true);
            });
        })
    });
}

describe('fonction creerAnneauTchat', () => {
    let ID_n: Identifiant<'sommet'> = { val: "mauvaise", sorte: 'sommet' }
    describe('méthode TableIdentification.possedeNoeud ', () => {
        it('renvoie false', () => {
            let resA = anneauA.possedeNoeud(ID_n);
            let resE = anneauE.possedeNoeud(ID_n);
            chai.expect(resA || resE).to.equal(false);
        });
    })
});

for (let j in IDs_noeudsA) {
    describe('fonction creerAnneauTchat', () => {
        describe('méthode TableIdentification.valeur', () => {
            console.log("noeud " + j);
            console.log("* Anneau");
            console.log(JSON.stringify(anneauA.noeud(IDs_noeudsA[j])));
            console.log(noeudTchat(anneauA.noeud(IDs_noeudsA[j])).representation());
            console.log("* Etoile");
            console.log(JSON.stringify(anneauE.noeud(IDs_noeudsE[j])));
            console.log(noeudTchat(anneauE.noeud(IDs_noeudsE[j])).representation());

            let ID_resA = anneauA.noeud(IDs_noeudsA[j]).centre.ID;
            let ID_resE = anneauE.noeud(IDs_noeudsE[j]).centre.ID;
            it('renvoie ' + ID_resA.val + " / " + ID_resE.val, () => {
                chai.expect(ID_resA.val).to.equal(IDs_noeudsA[j].val);
                chai.expect(ID_resE.val).to.equal(IDs_noeudsE[j].val);
            });
        })
    });
}
