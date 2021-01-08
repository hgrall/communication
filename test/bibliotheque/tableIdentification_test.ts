import * as chai from 'chai';
import * as mocha from 'mocha';

import { TableIdentificationMutable, creerTableIdentificationMutableVide } from "../../bibliotheque/types/tableIdentification";


interface IN {
    a: number;
    b: string;
}

interface OUT {
    a: number;
}



describe('classe TableIdentification', () => {
    let table: TableIdentificationMutable<'test', IN, OUT>
        = creerTableIdentificationMutableVide('test', (x) => x);
    table.ajouter({ val: "id1", sorte: 'test' }, { a: 1, b: "coco1" });
    table.ajouter({ val: "id2", sorte: 'test' }, { a: 2, b: "coco2" });
    let oracle = 2;
    let r = table.taille();
    it('renvoie ' + r.toString(), () => {
        chai.expect(r).to.equal(oracle);
    });
    console.log("dom : " + table.domaine().map((v, i, t) => v.val).toString());
    console.log("image : " + table.image().map((v, i, t) => JSON.stringify(v)).toString());
    console.log("net : " + table.net('taille'));
    console.log("net : " + table.net('image'));
    console.log("net : " + table.net('domaine'));
    console.log("net : " + table.net('graphe'));
    console.log("sélect : " + JSON.stringify(table.selectionCle()));
    let v = JSON.stringify(table.valeur({ val: "id1", sorte: 'test' }));
    it('renvoie ' + v, () => {
        chai.expect(v).to.equal(JSON.stringify({ a: 1, b: "coco1" }));
    });
    it('renvoie ' + table.estVide(), () => {
        chai.expect(table.estVide()).to.equal(false);
    });
    table.retirer({ val: "id1", sorte: 'test' });
    console.log("image : " + table.image().map((v, i, t) => JSON.stringify(v)).toString());
    console.log("sélect : " + JSON.stringify(table.selectionCle()));
});

