import * as chai from 'chai';
import * as mocha from 'mocha';

import { Identification, FormatIdentifiableMutable, creerIdentificationParCompteur } from "../../bibliotheque/types/identifiant";
import { Unite } from "../../bibliotheque/types/typesAtomiques";

describe('classe IdentificationParCompteur', () => {
    let identification: Identification<'test'>
        = creerIdentificationParCompteur("pref-");
    let val: FormatIdentifiableMutable<'test'> = {
        ID: identification.identifier('test'), mutable: Unite.ZERO
    };

    let r = JSON.stringify(val);
    let oracle = JSON.stringify({ ID: { val: "pref-0", sorte: 'test' }, mutable: Unite.ZERO });

    it('renvoie ' + r, () => {
        chai.expect(r).to.equal(oracle);
    });
    val = {
        ID: identification.identifier('test'), mutable: Unite.ZERO
    };
    r = JSON.stringify(val);
    oracle = JSON.stringify({ ID: { val: "pref-1", sorte: 'test' }, mutable: Unite.ZERO });
    it('renvoie ' + r, () => {
        chai.expect(r).to.equal(oracle);
    });
});

