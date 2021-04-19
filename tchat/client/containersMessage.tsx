import * as React from "react";

import styled from "styled-components";

import { DateFr, dateMaintenant } from "../../bibliotheque/types/date"

import { Identification, creerIdentificationParCompteur } from "../../bibliotheque/types/identifiant"

import { Individu, Message } from "./typesInterface";

import { Couleur, COUPLE_FOND_ENCRE_SUJET, FOND_TEXTE, TEXTE, FOND_TEXTE_INV, TEXTE_INV, TEXTE_PALE, TEXTE_ERREUR } from "../../bibliotheque/interface/couleur";

import TextareaAutosize from 'react-textarea-autosize';

interface ProprietesMessage {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    message: Message;
}

enum Role { Emetteur, Recepteur };

interface ProprietesInterlocuteur {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    fond: Couleur;
    encre: Couleur;
    nom: string,
    role: Role
}

class InterlocuteurBrut extends React.Component<ProprietesInterlocuteur, {}> {
    render() {
        return (
            <div className={this.props.className}>
                {((this.props.role === Role.Emetteur) ? "De : " : "A : ") + this.props.nom}
            </div>
        );
    }
}

const Interlocuteur = styled(InterlocuteurBrut)`
        flex: none;
        background-color: ${(props: ProprietesInterlocuteur) => props.fond};
        color : ${(props: ProprietesInterlocuteur) => props.encre};
        text-align: center;
        padding: 1ex;

        width: 18ex;
        margin: 1ex;
        border-radius: 1ex;
    `;

const MessageFixe = styled.div`
    flex: auto;
    background: ${FOND_TEXTE};
    color: ${TEXTE};
    text-align: justify;
    padding: 1ex;

    min-width: 24ex;
    max-width: 72ex;
    margin: 1ex;
    white-space: pre-wrap;
    overflow-wrap: break-word;
`;

const Cachet = styled.div`
    font-size: x-small;
    color: ${TEXTE_PALE};
    text-align: right;
`;

interface ProprietesPastille {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    fond: Couleur;
}

class PastilleBrute extends React.Component<ProprietesPastille, {}> {
    render() {
        return (
            <div className={this.props.className}>
            </div>
        );
    }
}

const Pastille = styled(PastilleBrute)`
        display: inline-block;
        width: 2ex;
        height: 2ex;
        border-radius: 100%;
        background-color: ${(props: ProprietesPastille) => props.fond};
        margin: 0 1ex 0 1ex;
    `;


class ContainerMessageBrut extends React.Component<ProprietesMessage, {}> {
    render() {
        return (
            <div className={this.props.className}>
                <Interlocuteur fond={this.props.message.emetteur.fond}
                               encre={this.props.message.emetteur.encre}
                               nom={this.props.message.emetteur.nom}
                               role={Role.Emetteur} />

                <MessageFixe style={{ color: (this.props.message.ID.val.includes('ERR')) ? TEXTE_ERREUR : TEXTE }}>
                    {this.props.message.contenu}
                    <Cachet>
                        {
                            this.props.message.accuses.map((c: Couleur) =>
                                <Pastille fond={c} />
                            )
                        }
                        {this.props.message.cachet}
                    </Cachet>
                </MessageFixe>

                <Interlocuteur fond={this.props.message.destinataire.fond}
                               encre={this.props.message.destinataire.encre}
                               nom={this.props.message.destinataire.nom}
                               role={Role.Recepteur} />
            </div>
        );
    }
}

export const ContainerMessageRecu = styled(ContainerMessageBrut)`
    flex: initial;
    background: ${FOND_TEXTE};
    box-shadow: -1ex 1ex 3ex -1ex ${(props) => props.message.emetteur.fond};
    border-radius: 1ex;
    margin: 1ex 1em 1ex 1ex;
    align-self: flex-end;
    /* Contrainte : marge plus grande que la largeur des ascenseurs. */
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    min-width: 80ex;
`;

export const ContainerMessageEmis = styled(ContainerMessageBrut)`
    flex: initial;
    background: ${FOND_TEXTE};
    box-shadow: 1ex 1ex 3ex -1ex ${COUPLE_FOND_ENCRE_SUJET.fond};
    border-radius: 1ex;
    margin: 1ex 1ex 1ex 1em;
    align-self: flex-start;
    /* Contrainte : marge plus grande que la largeur des ascenseurs. */
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    min-width: 80ex;
`;

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
        background-color: ${(props: ProprietesInterlocuteur) => props.fond};
        color : ${(props: ProprietesInterlocuteur) => props.encre};
        text-align: center;
        padding: 1ex;
        height: 4ex;
        width: 18ex;
        margin: 1ex;
        border-radius: 1ex;
    `;

class EntreeMessageBrut extends React.Component<ProprietesEntreeMessage, EtatEntreeMessage> {

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

                <Interlocuteur fond={this.props.sujet.fond}
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

export const EntreeMessage = styled(EntreeMessageBrut)`
    flex: initial;
    background: ${FOND_TEXTE};
    box-shadow: 1ex 1ex 3ex -1ex ${COUPLE_FOND_ENCRE_SUJET.fond};
    border-radius: 1ex;
    margin: 1ex 1ex 1ex 1em;
    align-self: flex-start;
    /* Contrainte : marge plus grande que la largeur des ascenseurs. */
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    min-width: 80ex;
    max-width: calc(50vw);
`;
