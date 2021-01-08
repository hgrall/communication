import * as chai from 'chai';
import * as mocha from 'mocha';

import { DateFr, dateEnveloppe, dateMaintenant, conversionDate } from "../../bibliotheque/types/date";

describe('dateX', () => {
    let r = dateMaintenant();
    let oracle = dateEnveloppe(r.val());

    it('dateEnveloppe de la valeur de dateMaintenant doit creer la même date que dateMaintenant', () => {
        chai.expect(r.representation()).to.equal(oracle.representation());
    });

    it('doit convertir une date dans le format dateFr', () => {
        let date = new Date(2018, 7, 21, 12, 2, 21, 5);
        let res = conversionDate(date);
        chai.expect(res).to.deep.equal({
            seconde: 21,
            minute: 2,
            mois: 7,
            heure: 12,
            jourSemaine: 1,
            annee: 2018,
            jourMois: 21
        });
    });

    it('doit representer la date sous la forme 12:53:53, le vendredi 02/02/2017', () => {
        let date = new Date(2018, 7, 21, 12, 2, 21, 5);
        let res = conversionDate(date);
        let oracle = dateEnveloppe(res);
        chai.expect(oracle.representation()).to.equal("12:02:21, le 21/08/2018");
    });

    it('doit representer la date sous la forme 12:53:53, le 02 fevrier 2017', () => {
        let date = new Date(2018, 7, 21, 12, 2, 21, 5);
        let res = conversionDate(date);
        let oracle = dateEnveloppe(res);
        chai.expect(oracle.representationLongue()).to.equal("12:02:21, le mardi 21 aout 2018");
    });

    it('doit representer la date sous la forme 12:53:53 02/02/2017', () => {
        let date = new Date(2018, 7, 21, 12, 2, 21, 5);
        let res = conversionDate(date);
        let oracle = dateEnveloppe(res);
        chai.expect(oracle.representationLog()).to.equal("12:02:21 21/08/2018");
    });
});

