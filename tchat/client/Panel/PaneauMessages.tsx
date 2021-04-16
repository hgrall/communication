import * as React from "react";

import styled from "styled-components";

import { DateFr } from "../../../bibliotheque/types/date"


import { FOND } from "../../../bibliotheque/interface/couleur";

import { Individu, Message } from "../typesInterface";

import { PanneauEntreeMessage } from "./PanneauEntreeMessage";

import { ContainerMessageEmis, ContainerMessageRecu } from "../Message/Message";
import Scrollbars from "react-custom-scrollbars";

interface ProprietesAction {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    sujet: Individu;
    messages: Message[];
    selection: Individu;
    envoiMessage: (m: Message, d: DateFr) => void;
}

class PanneauMessagesBrut extends React.Component<ProprietesAction, {}> {
    render() {
        return (
            <div className={this.props.className}>
                <Scrollbars style={{ width: "74vw", height: "100vh" }}>
                {
                    this.props.messages.map((m: Message) =>
                        ((m.emetteur.nom === this.props.sujet.nom) ?
                            <ContainerMessageEmis message={m} /> :
                            <ContainerMessageRecu message={m} />
                        )
                    )
                }
                </Scrollbars>
            </div>
        );
    }
}

export const PanneauMessages = styled(PanneauMessagesBrut)`
    position: absolute;
    top: 0;
    left: 0;
    /* important / overflow : deux sens haut vers bas et gauche vers droite pour le dépassement */
    min-width: calc(74vw);
    min-height: calc(100vh);
    /* occupe au moins la place du container */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
`;

