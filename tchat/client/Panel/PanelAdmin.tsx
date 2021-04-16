import * as React from "react";

import styled from "styled-components"

import {FOND, CADRE, TEXTE_PALE} from "../../../bibliotheque/interface/couleur";

import { Individu } from "../typesInterface";

import { Pastille } from "../Pastille/Pastille";

import { Pseudo } from "../Label/Pseudo";

import { ButtonDestinataire } from "../Button/ButtonDestinataire";

import { TexteInformation } from "../Text/TexteInformation"

import Scrollbars from "react-custom-scrollbars";

interface ProprietesAdmin {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    sujet: Individu;
    objets: ReadonlyArray<Individu>;
    tous: Individu;
    selection: Individu;
    modifSelection: (i: Individu) => void;
    nombreConnexions : string
}

const Cachet = styled.div`
    font-size: x-small;
    color: ${TEXTE_PALE};
    text-align: right;
`;

export const SujetAdmin = styled.div`
  background: ${FOND};
  flex: auto;
  align-self: center;
  min-width: calc(24vw);

  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-start;
`;

export const SujetAdminContainer = styled.div`
    flex: auto;
    margin: 0;
    background: ${CADRE};
    height: 7ex;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;




class ContenuPanelAdmin extends React.Component<ProprietesAdmin, {}> {
    render() {
        return (
            <div className={this.props.className}>
                <Scrollbars style={{ width: "24vw", height: "100vh" }}>
                <SujetAdmin>
                    <SujetAdminContainer>
                        <Pastille fond={this.props.sujet.fond} />
                        <Pseudo>
                            {this.props.sujet.nom}
                        </Pseudo>
                    </SujetAdminContainer>
                </SujetAdmin>
                        <TexteInformation> Choisissez un destinataire : </TexteInformation>
                        {this.props.objets.map(i =>
                            <ButtonDestinataire choix={this.props.selection.nom === i.nom}
                                onClick={() => this.props.modifSelection(i)}
                                fond={i.fond}
                                nom={i.nom} />
                        )}
                        <TexteInformation> Ou tous les destinataires :</TexteInformation>
                        <ButtonDestinataire choix={this.props.selection.nom === this.props.tous.nom}
                            onClick={() => this.props.modifSelection(this.props.tous)}
                            fond={this.props.tous.fond}
                            nom={this.props.tous.nom}
                        />
                        <TexteInformation> Nombre de connexions: {this.props.nombreConnexions }/5 </TexteInformation>
                </Scrollbars>
            </div>
        );
    }
}

export const PanelAdmin = styled(ContenuPanelAdmin)`
    background: ${FOND};
    position: absolute;
    top: 0;
    left: 0;
    /* important / overflow : deux sens haut vers bas et gauche vers droite pour le dépassement */
    min-width: calc(24vw);
    min-height: calc(100vh);
    /* occupe au moins la place du container */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;


