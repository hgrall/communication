import * as chai from 'chai';
import * as mocha from 'mocha';

import { mot, binaire, premiersBinaires, Mot, egaliteMots } from "../../bibliotheque/types/binaire";
import { Deux } from "../../bibliotheque/types/typesAtomiques";

describe('fonction binaire', () => {
    let oracle = mot([Deux.ZERO]);
    let arg = 0;
    let r: Mot = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.bit(0)).to.equal(oracle.bit(0));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});

describe('fonction binaire', () => {
    let oracle = mot([Deux.UN]);
    let arg = 1;
    let r = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.bit(0)).to.equal(oracle.bit(0));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});

describe('fonction binaire', () => {
    let oracle = mot([Deux.UN, Deux.ZERO]);
    let arg = 2;
    let r = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.bit(0)).to.equal(oracle.bit(0));
        chai.expect(r.bit(1)).to.equal(oracle.bit(1));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});

describe('fonction binaire', () => {
    let oracle = mot([Deux.UN, Deux.UN]);
    let arg = 3;
    let r = binaire(arg);
    it('renvoie ' + r.representation() + ' pour ' + arg, () => {
        chai.expect(r.bit(0)).to.equal(oracle.bit(0));
        chai.expect(r.bit(1)).to.equal(oracle.bit(1));
        chai.expect(r.taille()).to.equal(oracle.taille());
    });
});


describe('fonction premiersBinaires', () => {
    let oracle = [[Deux.ZERO], [Deux.UN], [Deux.UN, Deux.ZERO]].map(m => mot(m).representation()).toString();
    let arg = 3;
    let r = premiersBinaires(arg).map(m => m.representation()).toString();
    it('renvoie ' + r + ' pour ' + arg, () => {
        chai.expect(r).to.equal(oracle);
    });
});

describe('fonction base2', () => {
    let oracle = "UN.UN.UN";
    let arg = 7;
    let r = binaire(7);
    it('renvoie ' + r.base2Litteral() + ' pour ' + arg, () => {
        chai.expect(r.base2Litteral()).to.equal(oracle);
    });
});

describe('fonction base10', () => {
    let oracle = 7;
    let arg = 7;
    let r = binaire(7);
    it('renvoie ' + r.base10().toString() + ' pour ' + arg, () => {
        chai.expect(r.base10()).to.equal(oracle);
    });
});

describe('fonction égalité / mots égaux', () => {
    let oracle = true;
    let arg1 = mot([0, 0, 0]);
    let arg2 = mot([0, 0, 0])
    it('renvoie ' + egaliteMots(arg1, arg2) + ' pour '
        + arg1.representation() + ' et ' + arg2.representation(), () => {
            chai.expect(egaliteMots(arg1, arg2)).to.equal(oracle);
        });
});

describe('fonction égalité / mots inégaux de même taille', () => {
    let oracle = false;
    let arg1 = mot([0, 0, 1]);
    let arg2 = mot([0, 0, 0])
    it('renvoie ' + egaliteMots(arg1, arg2) + ' pour '
        + arg1.representation() + ' et ' + arg2.representation(), () => {
            chai.expect(egaliteMots(arg1, arg2)).to.equal(oracle);
        });
});

describe('fonction égalité / mots inégaux de taille différente', () => {
    let oracle = false;
    let arg1 = mot([0, 0, 1]);
    let arg2 = mot([0, 0, 0, 0])
    it('renvoie ' + egaliteMots(arg1, arg2) + ' pour '
        + arg1.representation() + ' et ' + arg2.representation(), () => {
            chai.expect(egaliteMots(arg1, arg2)).to.equal(oracle);
        });
});