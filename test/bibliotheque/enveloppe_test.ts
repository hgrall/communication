import * as chai from 'chai';
import * as mocha from 'mocha';

import { Enveloppe } from "../../bibliotheque/types/enveloppe";
import { jamais } from "../../bibliotheque/types/typesAtomiques";

interface IN {
    a: number;
    b: string;
}

interface OUT {
    a: number;
}

type Etiquette = 'rep';

class Test extends Enveloppe<IN, OUT, Etiquette> {

    constructor(etat: IN) {
        super((x) => x, etat);
    }

    net(e: Etiquette): string {
        let s = this.etat();
        switch (e) {
            case 'rep': return s.a.toString() + " - " + s.b;
        }
        return jamais(e);
    }
    representation(): string {
        return this.net('rep');
    }
}

describe('fonction Enveloppe.brut', () => {
    let t = new Test({ a: 3, b: "coco" });
    let oracle = JSON.stringify({ a: 3, b: "coco" });
    let r = t.brut();
    it('renvoie ' + r, () => {
        chai.expect(r).to.equal(oracle);
    });
});

describe('fonction Enveloppe.brut', () => {
    let t = new Test({ a: 3, b: "coco" });
    let oracle = JSON.stringify({ a: 3, b: "coco" });
    let r = t.brut();
    it('renvoie ' + r, () => {
        chai.expect(r).to.equal(oracle);
    });
});
