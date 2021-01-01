import * as chai from 'chai';

import {
    creerConfigurationServeur, ConfigurationServeurJeu1Distribution
} from "../../../distribution/serveur/generationReseauJeu1Distribution";

testerConsignesAttendus(4, [2, 1, 3, 2]);
testerConsignesAttendus(5, [2, 1, 3, 2, 3]);

function testerConsignesAttendus(nombreDomaines: number, effectifs: ReadonlyArray<number>) {
    const config: ConfigurationServeurJeu1Distribution = creerConfigurationServeur(
        nombreDomaines, "DOM"
    );
    config.engendrerPopulations(effectifs);
    config.engendrerConsignes();
    console.log(config.representation());

    let consignes = config.consignesEmission();
    let attendus = config.attendusReception();

    describe("méthodes ConfigurationServeurJeu1Distribution.consignesEmission et attendusReception",
        () => {
            consignes.iterer((idE, c) => {
                describe("itération testant la cohérence des consignes et attendus",
                    () => {
                        let idR = c.utilisateur.ID;
                        let idRE = attendus.valeur(idR).utilisateur.ID;
                        it('renvoie true', () => {
                            chai.expect(idE.val === idRE.val).to.equal(true);
                        });
                    });
            });
        });

}


/*for (let j in IDs_noeudsA) {
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
*/
/*
let x =
{
    populations : {
        "DOM-0":{"identification":{"table":{
            "@DOM-0:0":{"pseudo":[0],"ID":{"val":"@DOM-0:0","sorte":"utilisateur"}},
            "@DOM-0:1":{"pseudo":[1],"ID":{"val":"@DOM-0:1","sorte":"utilisateur"}},
            "@DOM-0:2":{"pseudo":[1,0],"ID":{"val":"@DOM-0:2","sorte":"utilisateur"}}},
            "taille":3},"sorte":"utilisateur"},
        "DOM-1":{"identification":{"table":{
            "@DOM-1:0":{"pseudo":[0],"ID":{"val":"@DOM-1:0","sorte":"utilisateur"}},
            "@DOM-1:1":{"pseudo":[1],"ID":{"val":"@DOM-1:1","sorte":"utilisateur"}}},
            "taille":2},"sorte":"utilisateur"},
        "DOM-2":{"identification":{"table":{
            "@DOM-2:0":{"pseudo":[0],"ID":{"val":"@DOM-2:0","sorte":"utilisateur"}}},
            "taille":1},"sorte":"utilisateur"}}
};


let c = {
    consignes : {
        "@DOM-1:1":{
            "domaine":{"nom":[1,0],"ID":{"val":"DOM-0","sorte":"sommet"}},
            "utilisateur":{"pseudo":[1,0],"ID":{"val":"@DOM-0:2","sorte":"utilisateur"}},
            "mot":[0,0,1,1,1,1,0]},
        "@DOM-1:0":{
            "domaine":{"nom":[1,0],"ID":{"val":"DOM-0","sorte":"sommet"}},
            "utilisateur":{"pseudo":[1],"ID":{"val":"@DOM-0:1","sorte":"utilisateur"}},
            "mot":[0,0,0,1,0,1,0]},
        "@DOM-2:0":{
            "domaine":{"nom":[1,0],"ID":{"val":"DOM-0","sorte":"sommet"}},
            "utilisateur":{"pseudo":[0],"ID":{"val":"@DOM-0:0","sorte":"utilisateur"}},
            "mot":[0,1,1,0,1,0,0]},
        "@DOM-0:2":{
            "domaine":{"nom":[0],"ID":{"val":"DOM-1","sorte":"sommet"}},
            "utilisateur":{"pseudo":[1],"ID":{"val":"@DOM-1:1","sorte":"utilisateur"}},
            "mot":[0,0,1,1,0,1,0]},
        "@DOM-0:1":{
            "domaine":{"nom":[0],"ID":{"val":"DOM-1","sorte":"sommet"}},
            "utilisateur":{"pseudo":[0],"ID":{"val":"@DOM-1:0","sorte":"utilisateur"}},
            "mot":[0,0,1,1,0,0,0]},
        "@DOM-0:0":{
            "domaine":{"nom":[1],"ID":{"val":"DOM-2","sorte":"sommet"}},
            "utilisateur":{"pseudo":[0],"ID":{"val":"@DOM-2:0","sorte":"utilisateur"}},
            "mot":[0,1,1,0,1,1,0]}
    }
};
*/