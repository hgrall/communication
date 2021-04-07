import * as React from "react";

import styled from "styled-components";

import {Individu, Message} from "./typesInterface";
import {Admin} from "./admin";
import {Action} from "./action";

import {
    Couleur, COUPLE_FOND_ENCRE_SUJET, COUPLE_FOND_ENCRE_TOUS, COUPLE_FOND_ENCRE_INCONNU,
    SuiteCouplesFondEncre, FOND, CADRE, SEPARATION_CADRE, TEXTE_ERREUR
} from "../../bibliotheque/interface/couleur";

import {
    Identification, creerIdentificationParCompteur, identifiant, Identifiant
} from "../../bibliotheque/types/identifiant";

import {
    DateFr, dateEnveloppe
} from "../../bibliotheque/types/date";


import {
    TableIdentification, tableIdentification
} from "../../bibliotheque/types/tableIdentification";

import {
    table
} from "../../bibliotheque/types/table";

import {CanalClientServeur, creerCanalClient} from "../../bibliotheque/communication/client";

import {
    NoeudTchat, noeudTchat,
    SommetTchatParEnveloppe, sommetTchat,
    messageCommunication,
    TypeMessageTchat, FormatMessageTchat, EtiquetteMessageTchat, MessageTchat, messageTchat,
    FormatConfigurationTchat,
    configurationTchat,
    FormatErreurTchat, erreurTchat
} from "../commun/echangesTchat";

/**
 * Interface définissant un canal de communication pour le tchat, côté client.
 */
interface CanalTchat extends CanalClientServeur<FormatErreurTchat,
    FormatConfigurationTchat,
    FormatMessageTchat, EtiquetteMessageTchat> {
}

const ApresAdmin = styled.div`
  background: ${CADRE};
  position: fixed;
  top: 0;
  left: 24vw;
  width: calc(1vw);
  height: calc(100vh);
  border-style: solid;
  border-width: 0 0.33vw;
  border-color: ${SEPARATION_CADRE};
`;

const ApresAction = styled.div`
  background: ${CADRE};
  position: fixed;
  top: 0;
  right: 0;
  width: 1vw;
  height: 100vh;
  border-style: solid;
  border-width: 0 0.33vw;
  border-color: ${SEPARATION_CADRE};
`;

interface ProprietesCorps {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
}

enum EtatInterfaceTchat {
    INITIAL,
    NORMAL,
    ERRONE
};

/*
  Etat contenant
  - les attributs susceptibles d'être modifiés par des sous-composants,
    'selection' et 'messages',
  - un indicateur de l'état de l'interface, chaque valeur étant associée
    à des attributs du composant, modifiés uniquement en interne.
*/
interface EtatCorps {
    selection: Individu;
    messages: Message[];
    etatInterface: EtatInterfaceTchat;
    nombreConnexions: string
}

const ID_TOUS: string = "TOUS";
const ID_INCONNU: string = "?";

/*
 * Degré du graphe limité à 4 - Cf. la liste des couples de couleurs.
 */
class CorpsBrut extends React.Component<ProprietesCorps, EtatCorps> {

    private generateur: Identification<'message'>;
    private urlServeur: string; // avec protocole ws
    private canal: CanalTchat;
    private noeud: NoeudTchat;

    private messageErreur: string;

    private individusObjets: TableIdentification<'sommet', Individu>;
    private individuSujet: Individu;
    private toutIndividu: Individu;
    private individuInconnu: Individu;

    constructor(props: ProprietesCorps) {
        super(props);

        this.urlServeur = location.toString()
            .replace(/^http/, 'ws'); // Même url, au protocole près

        this.messageErreur = "Aucune erreur";

        this.toutIndividu = {
            ID: identifiant('sommet', ID_TOUS),
            nom: "tous",
            fond: COUPLE_FOND_ENCRE_TOUS.fond,
            encre: COUPLE_FOND_ENCRE_TOUS.encre
        };

        this.individuInconnu = {
            ID: identifiant('sommet', ID_INCONNU),
            nom: "inconnu",
            fond: COUPLE_FOND_ENCRE_INCONNU.fond,
            encre: COUPLE_FOND_ENCRE_INCONNU.encre
        };

        this.state = {
            selection: this.toutIndividu,
            messages: [],
            etatInterface: EtatInterfaceTchat.INITIAL,
            nombreConnexions: "0"
        };

        this.envoyerMessage = this.envoyerMessage.bind(this);
        this.modifierSelection = this.modifierSelection.bind(this);
    }

    modifierSelection(i: Individu) {
        this.setState({selection: i});
    }

    ajouterMessage(m: Message): void {
        this.setState((etatAvant: EtatCorps) => ({
            messages: [...etatAvant.messages, m]
        }));
    }

    individu(id: Identifiant<'sommet'>): Individu {
        if (id.val === this.individuSujet.ID.val) {
            return this.individuSujet;
        }
        if (this.individusObjets.contient(id)) {
            return this.individusObjets.valeur(id);
        }
        return this.individuInconnu;
    }

    mettreAJourMessageEnvoye(id: Identifiant<'message'>, destinataire: Individu) {
        this.setState((etatAvant: EtatCorps) => ({
            messages: etatAvant.messages.map((v, i, tab) => {
                if (v.ID.val === id.val) {
                    return {
                        ID: v.ID,
                        emetteur: v.emetteur,
                        destinataire: v.destinataire,
                        contenu: v.contenu,
                        cachet: v.cachet,
                        accuses: [...v.accuses, destinataire.fond]
                    };
                } else {
                    return v;
                }
            })
        }));
    }

    envoyerMessage(m: Message, d: DateFr) {
        this.ajouterMessage(m);
        if (m.destinataire.ID.val === ID_TOUS) {
            console.log("* Diffusion du message")
            this.individusObjets.iterer((c, v) => {
                let msg: MessageTchat = messageCommunication(m.ID, m.emetteur.ID, v.ID, m.contenu, d.val());
                console.log("- brut : " + msg.brut());
                console.log("- net : " + msg.representation());
                this.canal.envoyerMessage(msg);
            });
            return;
        }
        let msg: MessageTchat = messageCommunication(m.ID, m.emetteur.ID, m.destinataire.ID, m.contenu, d.val());
        console.log("* Envoi du message");
        console.log("- brut : " + msg.brut());
        console.log("- net : " + msg.representation());
        this.canal.envoyerMessage(msg);
    }

    render(): JSX.Element {
        switch (this.state.etatInterface) {
            case EtatInterfaceTchat.NORMAL:
                return (
                    <div className={this.props.className}>
                        <Admin sujet={this.individuSujet}
                               objets={this.individusObjets.image()}
                               tous={this.toutIndividu}
                               selection={this.state.selection}
                               modifSelection={this.modifierSelection}
                               nombreConnexions={this.state.nombreConnexions}
                        />
                        <ApresAdmin/>
                        <Action sujet={this.individuSujet} messages={this.state.messages}
                                selection={this.state.selection} envoiMessage={this.envoyerMessage}/>
                        <ApresAction/>
                    </div>
                );
            case EtatInterfaceTchat.INITIAL:
                return (
                    <h1>Connexion au serveur pour l'initialisation</h1>
                );
            case EtatInterfaceTchat.ERRONE:
                return (
                    <div>
                        <h1>Fin de l'application après l'erreur suivante : </h1>
                        <div style={{color: TEXTE_ERREUR}}>
                            {this.messageErreur}
                        </div>
                    </div>
                );
        }
    }

    componentDidMount(): void {
        console.log("* Initialisation après montage du corps");

        console.log("- du canal de communication avec le serveur d'adresse " + this.urlServeur);
        this.canal = creerCanalClient(this.urlServeur);

        console.log("- du traitement des messages");
        this.canal.enregistrerTraitementMessageRecu((m: FormatMessageTchat) => {
            let msg = messageTchat(m);
            console.log("* Réception");
            console.log("- du message brut : " + msg.brut());
            console.log("- du message net : " + msg.representation());

            let contenu: string = m.contenu;

            /* Message en transit */
            if (m.type === TypeMessageTchat.TRANSIT) {
                if (!this.individusObjets.contient(m.ID_emetteur)) {
                    console.log("- message incohérent");
                    return;
                }
                if (m.ID_destinataire.val !== this.individuSujet.ID.val) {
                    console.log("- message incohéent");
                    return;
                }
                let emetteur: Individu = this.individusObjets.valeur(m.ID_emetteur);
                let destinataire: Individu = this.individuSujet;
                this.ajouterMessage({
                    ID: m.ID,
                    emetteur: emetteur,
                    destinataire: destinataire,
                    cachet: dateEnveloppe(m.date).representation(),
                    contenu: contenu,
                    accuses: []
                });
                return;
            }

            /* Message accusant réception */
            if (m.type === TypeMessageTchat.AR) {
                if (!this.individusObjets.contient(m.ID_destinataire)) {
                    console.log("- message incohéent");
                    return;
                }
                if (m.ID_emetteur.val !== this.individuSujet.ID.val) {
                    console.log("- message incohéent");
                    return;
                }
                let destinataire = this.individusObjets.valeur(m.ID_destinataire);
                this.mettreAJourMessageEnvoye(m.ID, destinataire);
                return;
            }
            /* Messages d'erreur */
            let emetteur: Individu;
            let destinataire: Individu;

            this.ajouterMessage({
                ID: this.generateur.identifier('message'),
                emetteur: this.individu(m.ID_emetteur),
                destinataire: this.individu(m.ID_destinataire),
                cachet: dateEnveloppe(m.date).representation(),
                contenu: contenu,
                accuses: []
            });
            /* TODO passer les AR en tableau de couleurs dans les messages*/
        });

        console.log("- du traitement de la configuration");
        this.canal.enregistrerTraitementConfigurationRecue((c: FormatConfigurationTchat) => {
            let config = configurationTchat(c);
            console.log("* Réception");
            console.log("- de la configuration brute : " + config.brut());
            console.log("- de la configuration nette : " + config.representation());
            console.log("* Initialisation du noeud du réseau");
            this.setState({nombreConnexions: config.net('nombreConnexions')})
            this.noeud = config.noeud();
            this.individuSujet = {
                ID: this.noeud.val().centre.ID,
                nom: this.noeud.val().centre.pseudo,
                fond: COUPLE_FOND_ENCRE_SUJET.fond,
                encre: COUPLE_FOND_ENCRE_SUJET.encre
            };
            this.generateur = creerIdentificationParCompteur(this.individuSujet.ID.val + "-ERR-");
            let suite = new SuiteCouplesFondEncre();
            this.individusObjets =
                tableIdentification('sommet',
                    table(this.noeud.val().voisins.identification).application(s => {
                        let c = suite.courant();
                        return {
                            ID: s.ID,
                            nom: s.pseudo,
                            fond: c.fond,
                            encre: c.encre
                        };
                    }).val());
            this.setState({
                etatInterface: EtatInterfaceTchat.NORMAL
            });

        });

        console.log("- du traitement d'une erreur rédhibitoire");
        this.canal.enregistrerTraitementErreurRecue((err: FormatErreurTchat) => {
            let erreur = erreurTchat(err);
            console.log("* Réception");
            console.log("- de l'erreur rédhibitoire brute : " + erreur.brut());
            console.log("- de l'erreur rédhibitoire nette : " + erreur.representation());
            console.log("* Affichage de l'erreur");
            this.messageErreur = erreur.representation();
            let codeErreur = err.erreurRedhibitoire
            if (codeErreur == 0) {
                let typeReseau = "anneau";
                if ((document.URL).includes("etoile")) {
                    typeReseau = "etoile";
                }
                const nombreReseauIndex = (document.URL).indexOf(typeReseau) + 6
                const nombreNouvelReseau = (Number(document.URL[nombreReseauIndex]) + 1)
                if (nombreNouvelReseau < 5) {
                    const url = document.URL.replace(typeReseau + document.URL[nombreReseauIndex], typeReseau + nombreNouvelReseau)
                    window.location.href = url
                } else {
                    this.setState({
                        etatInterface: EtatInterfaceTchat.ERRONE,
                    });
                }
            } else {
                this.setState({
                    etatInterface: EtatInterfaceTchat.ERRONE,
                });
            }
        });

    }

}

export const Corps = styled(CorpsBrut)`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: ${FOND}
`;
