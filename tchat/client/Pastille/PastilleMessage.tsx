import {Couleur} from "../../../bibliotheque/interface/couleur";
import * as React from "react";
import styled from "styled-components";

interface ProprietesPastille {
    // see https://github.com/Microsoft/TypeScript/issues/8588
    className?: string;
    fond: Couleur;
}

class PastilleMessageBrute extends React.Component<ProprietesPastille, {}> {
    render() {
        return (
            <div className={this.props.className}>
            </div>
        );
    }
}

export const PastilleMessage = styled(PastilleMessageBrute)`
        display: inline-block;
        width: 2ex;
        height: 2ex;
        border-radius: 100%;
        background-color: ${(props: ProprietesPastille) => props.fond};
        margin: 0 1ex 0 1ex;
    `;