import {Message} from "../Helpers/typesInterface";
import styled from "styled-components";
import {
    Couleur,
    COUPLE_FOND_ENCRE_SUJET,
    FOND_TEXTE,
    TEXTE,
    TEXTE_ERREUR,
    TEXTE_PALE
} from "../../../bibliotheque/interface/couleur";
import * as React from "react";
import {InterlocuteurMessage, Role} from "../Label/InterlocuteurMessage";
import {PastilleMessage} from "../Pastille/PastilleMessage";

interface ProprietesMessage {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    message: Message;
}


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

class ContainerMessageBrut extends React.Component<ProprietesMessage, {}> {
    render() {
        return (
            <div className={this.props.className}>
                <InterlocuteurMessage fond={this.props.message.emetteur.fond}
                                      encre={this.props.message.emetteur.encre}
                                      nom={this.props.message.emetteur.nom}
                                      role={ Role.Emetteur } />

                <MessageFixe style={{ color: (this.props.message.ID.val.includes('ERR')) ? TEXTE_ERREUR : TEXTE }}>
                    {this.props.message.contenu}
                    <Cachet>
                        {
                            this.props.message.accuses.map((c: Couleur) =>
                                <PastilleMessage fond={c} />
                            )
                        }
                        {this.props.message.cachet}
                    </Cachet>
                </MessageFixe>

                <InterlocuteurMessage fond={this.props.message.destinataire.fond}
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