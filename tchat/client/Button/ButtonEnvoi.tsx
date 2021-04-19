import {Couleur} from "../../../bibliotheque/interface/couleur";
import * as React from "react";
import styled from "styled-components";
import {ProprietesInterlocuteur} from "../Label/InterlocuteurMessage";

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