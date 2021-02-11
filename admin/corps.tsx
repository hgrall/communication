import * as React from "react";
import styled from "styled-components";
import {
    CADRE,
    Couleur,
    FOND, FOND_GAIN,
    FOND_TEXTE_INV,
    SELECTION,
    SEPARATION_CADRE,
    TEXTE_INV
} from "../bibliotheque/interface/couleur";
import Scrollbars from "react-custom-scrollbars";

const styleTexteBrut = {
    margin: "1ex",
    marginRight:"1ex",
    marginBottom:"1ex",
    background: FOND_TEXTE_INV,
    color: TEXTE_INV,
    fontSize: "medium",
    display: "flex",
    flexDirection: "column",
    whiteSpace:"pre-wrap",
    height: "97%",
};

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

const Action = styled.div`
    background: ${FOND};
    position: fixed;
    top: 0;
    right: 1vw;
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

const Pseudo = styled.div`
    flex: initial;
    background: ${CADRE};
    color: ${TEXTE_INV};
    text-align: center;
    padding: 1ex;
    height: 4ex;
    //width: 10ex;
    font-size: x-large;
`;

interface AccueilState {
    hasCode: boolean,
    code: string,
    selection: string,
    logFiltre: string,
}

export class Corps extends React.Component<{}, AccueilState> {
    private options: {[net:string]:string} = {"Étoile 0":"E00", "Étoile 1":"E01", "Étoile 2":"E02",
        "Étoile 3":"E03", "Étoile 4":"E04", "Anneau 0":"A00", "Anneau 1":"A01", "Anneau 2":"A02",
        "Anneau 3":"A03", "Anneau 4":"A04", "Distribution": "DOM"};
    private logBrut: string;

    constructor(props: {}) {
        super(props);
        this.state = {
            hasCode: false, //aCode
            code: "",
            selection: "Étoile 0",
            logFiltre: " Impossible d'obtenir les logs du système"
        };
        this.modifierSelection = this.modifierSelection.bind(this)
    }

    componentWillMount() {
        this.obtenirLogBrut();
    }

    render() {
            return (
                <div>
                    <Admin
                        objets={Object.keys(this.options)}
                        selection={this.state.selection}
                        modifSelection={this.modifierSelection} />
                    <ApresAdmin />
                    <Action>
                        <Scrollbars style={{ width: "74vw", height: "100vh" }}>
                            <div
                                style={styleTexteBrut as React.CSSProperties}>
                                {this.state.logFiltre}
                            </div>
                        </Scrollbars>
                    </Action>
                    <ApresAction />
                </div>
            );
    }

    /**
     * Obtient le log brut avec des infos sur tous les réseaux
     * à partir d'une requête GET HTTP à /admin/logs
     * */
    obtenirLogBrut() {
        const domain = document.location.origin; // en local : http://localhost:8081
        var xhr = new XMLHttpRequest(); // créer une XMLHttpRequest

        // configure une callback pour quand le serveur répond
        xhr.addEventListener('load', () => {
            // filtrer le log et sauvegarder l'état
            this.logBrut = xhr.responseText.replace(/info:/g,'');
            let log = this.filtrerLog(this.state.selection);
            this.setState({ logFiltre: log });
        })

        // preparer et envoyer la rêquete
        xhr.open('GET', domain+'/admin/logs')
        xhr.send()
    }

    /**
     * Filtre le log brut d'après le réseau choisi pour l'affichage
     * à partir du code associé au réseau dans la variable options
     * @param selection le réseau choisi pour afficher
     * */
    filtrerLog(selection: string):string {
        // séparer le log brut par ligne
        const lines = this.logBrut.split('\n');
        let nouveauLog = "";
        // vérifier si la ligne correspond au réseau choisi avec options
        for (let line of lines) {
            if (line.includes(this.options[selection])) {
                nouveauLog += line + '\n';
            }
        }
        // en cas d'absence de log
        if (nouveauLog.length <= 0) {
            nouveauLog = ' Pas de log disponible pour ce réseau';
        }
        return nouveauLog;
    }

    /**
     * Nouveau réseau choisi : filtre le log pour montrer les infos sur ce réseau
     * et sauvegarde le nouveau état
     * */
    modifierSelection(i: string) {
        let nouveauLog = this.filtrerLog(i);
        this.setState({ selection: i, logFiltre: nouveauLog });
    }

}

/**
 * ContenuAdmin : interface, class et style (CSS)
 * */
interface ProprietesAdmin {
    className?: string;
    objets: ReadonlyArray<string>;
    selection: string;
    modifSelection: (i: string) => void;
}
class ContenuAdmin extends React.Component<ProprietesAdmin, {}> {
    render() {
        return (
            <div className={this.props.className}>
                <Scrollbars style={{ width: "24vw", height: "100vh" }}>
                    <ContainerAdmin
                        objets={this.props.objets}
                        selection={this.props.selection}
                        modifSelection={this.props.modifSelection} />
                </Scrollbars>
            </div>
        );
    }
}
const Admin = styled(ContenuAdmin)`
    background: rgb(170, 170, 170);
    position: fixed;
    top: 0;
    left: 0;
`;

/**
 * ContenuContainerAdmin : class et style (CSS)
 * */
class ContenuContainerAdmin extends React.Component<ProprietesAdmin, {}> {
    render() {
        return (
            <div className={this.props.className}>
                Choisissez un réseau :
                {this.props.objets.map(i =>
                    <ObjetAdmin choix={this.props.selection === i}
                                onClick={() => this.props.modifSelection(i)}
                                fond={FOND_GAIN}
                                nom={i} />
                )}
            </div>
        );
    }
}
const ContainerAdmin = styled(ContenuContainerAdmin)`
    background: ${FOND};
    position: absolute;
    top: 0;
    left: 0;
    min-width: calc(24vw);
    min-height: calc(100vh);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
`;

/**
 * Pastille : interface, class et style (CSS)
 * */
interface ProprietesPastille {
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
        flex: none;
        width: 4ex;
        height: 4ex;
        border-radius: 100%;
        background-color: ${(props: ProprietesPastille) => props.fond};
    `;

/**
 * ObjetAdminBrut : interface, class et style (CSS)
 * */
interface ProprietesObjetAdmin {
    className?: string;
    choix: boolean;
    onClick: () => void;
    fond: Couleur;
    nom: string;
}
class ObjetAdminBrut extends React.Component<ProprietesObjetAdmin, {}> {

    render() {
        return <button className={this.props.className} onClick={this.props.onClick}>
            <Pastille fond={this.props.fond} />
            <Pseudo>{this.props.nom}</Pseudo>
        </button>;
    }
}
const ObjetAdmin = styled(ObjetAdminBrut)`
    flex: initial;
    background: ${CADRE};
    border-radius: 1ex;

    border-style: solid;
    border-width: ${props => props.choix ? "0.5ex" : "0"};
    border-color: ${SELECTION};

    padding: ${props => props.choix ? "0.5ex" : "1ex"};
    margin: 1em 0 1em 0;
    max-width: 20vw;
    width: 20em;
    min-width: 20em;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;
