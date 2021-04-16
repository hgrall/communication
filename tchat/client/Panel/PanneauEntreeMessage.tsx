import * as React from "react";

import styled from "styled-components";

import { DateFr, dateMaintenant } from "../../../bibliotheque/types/date"

import { Identification, creerIdentificationParCompteur } from "../../../bibliotheque/types/identifiant"

import { Individu, Message } from "../typesInterface";

import { Couleur, COUPLE_FOND_ENCRE_SUJET, FOND_TEXTE, FOND_TEXTE_INV, TEXTE_INV } from "../../../bibliotheque/interface/couleur";

import {InterlocuteurMessage, Role} from "../Label/InterlocuteurMessage"

import TextareaAutosize from 'react-textarea-autosize';


interface ProprietesEntreeMessage {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    sujet: Individu;
    destinataire: Individu;
    envoiMessage: (m: Message, d: DateFr) => void;
}

interface EtatEntreeMessage {
    texte: string
}

const styleTexteBrut = {
    alignSelf: "flex-end",
    flex: "auto",
    resize: "vertical",
    overflow: "auto",
    margin: "1ex",
    background: FOND_TEXTE_INV,
    color: TEXTE_INV,
    fontSize: "medium"
};

interface ProprietesEnvoi {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    fond: Couleur;
    encre: Couleur;
    nom: string;
    onClick: () => void;
    role: Role
}

class EnvoiBrut extends React.Component<ProprietesEnvoi> {
    render() {
        return (
            <button className={this.props.className}
                onClick={this.props.onClick} >
                {"A : " + this.props.nom}
            </button>
        );
    }
}

const Envoi = styled(EnvoiBrut)`
        flex: none;
        background-color: ${(props: ProprietesEnvoi) => props.fond};
        color : ${(props: ProprietesEnvoi) => props.encre};
        text-align: center;
        padding: 1ex;
        height: 4ex;
        width: 18ex;
        margin: 1ex;
        border-radius: 1ex;
    `;

class PanneauEntreeMessageBrut extends React.Component<ProprietesEntreeMessage, EtatEntreeMessage> {

    private generateur: Identification<'message'>;
    constructor(props: ProprietesEntreeMessage) {
        super(props);
        this.state = { texte: '' };
        this.generateur = creerIdentificationParCompteur(this.props.sujet.ID.val + "-MSG-");
        this.mettreAJourEntree = this.mettreAJourEntree.bind(this);
    }

    mettreAJourEntree(event: React.ChangeEvent<HTMLTextAreaElement>): void {
        this.setState({ texte: event.target.value });
    }

    reinitialiserEntree(): void {
        this.setState({ texte: "" });
    }
    render() {
        return (
            <div className={this.props.className}>

                <InterlocuteurMessage fond={this.props.sujet.fond}
                    encre={this.props.sujet.encre}
                    nom={this.props.sujet.nom}
                    role={Role.Emetteur} />

                <TextareaAutosize
                    value={this.state.texte}
                    placeholder="Entrez le texte de votre message puis appuyez sur le bouton à droite indiquant le destinataire pour l'envoyer."
                    minRows={3} cols={72}
                    style={styleTexteBrut as React.CSSProperties}
                    onChange={this.mettreAJourEntree}>
                </TextareaAutosize>

                <Envoi fond={this.props.destinataire.fond}
                    encre={this.props.destinataire.encre}
                    nom={this.props.destinataire.nom}
                    role={Role.Recepteur}
                    onClick={() => {
                        let d = dateMaintenant();
                        this.props.envoiMessage({
                            ID: this.generateur.identifier('message'),
                            emetteur: this.props.sujet,
                            destinataire: this.props.destinataire,
                            cachet: d.representation(),
                            contenu: this.state.texte,
                            accuses: []
                        }, d);
                        this.reinitialiserEntree();
                    }}
                />
            </div>
        );
    }
}

export const PanneauEntreeMessage = styled(PanneauEntreeMessageBrut)`
    flex: initial;
    box-shadow: 1ex 1ex 3ex -1ex ${COUPLE_FOND_ENCRE_SUJET.fond};
    border-radius: 1ex;
    margin: 1ex 1ex 1ex 1em;
    align-self: flex-start;
    /* Contrainte : marge plus grande que la largeur des ascenseurs. */
    display: flex;
    position: relative;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    min-width: 80ex;
    max-width: calc(50vw);
`;