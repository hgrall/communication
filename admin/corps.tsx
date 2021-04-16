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
import {DateTimeForm} from "./DateTimeForm";

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
    selection: string,
    logFiltre: string,
}

export class Corps extends React.Component<{}, AccueilState> {
    private options: {[net:string]:string} = {};
    private logBrut: string;
    private filtreDateDebut: Date;
    private filtreDateFin: Date;

    constructor(props: {}) {
        super(props);
        this.state = {
            hasCode: false, //aCode
            selection: "Étoile 0",
            logFiltre: " Impossible d'obtenir les logs du système",
        };
        this.modifierSelection = this.modifierSelection.bind(this)
        this.modifierDatesRange = this.modifierDatesRange.bind(this)
    }

    componentWillMount() {
        this.obtenirLogBrut();
    }

    render() {
        console.log(document.location);
        console.log(document.location.search);
            return (
                <div>
                    <Admin
                        objets={Object.keys(this.options)}
                        selection={this.state.selection}
                        modifSelection={this.modifierSelection} />
                    <ApresAdmin />
                    <Action>
                        <DateTimeForm modifDatesRange={this.modifierDatesRange}/>
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
        const codeAcces = document.location.search.replace("?code=",""); // ?code=XX
        const domain = document.location.origin; // en local : http://localhost:8081
        var xhr = new XMLHttpRequest(); // créer une XMLHttpRequest

        // configure une callback pour quand le serveur répond
        xhr.addEventListener('load', () => {
            // obtenir id école du code d'accès
            let idEcole = xhr.responseText.slice(xhr.responseText.lastIndexOf(codeAcces)+codeAcces.length+1,
                xhr.responseText.indexOf("info:", xhr.responseText.lastIndexOf(codeAcces))-1);

            // les choix des réseaux pour le menu à gauche
            this.ajouterOptions(idEcole);

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
            if (line.includes(this.options[selection]) && this.filtreDate(line)) {
                nouveauLog += line + '\n';
            }
        }

        // en cas d'absence de log
        if (nouveauLog.length <= 0) {
            nouveauLog = ' Pas de log disponible pour ce réseau';
        }
        return nouveauLog;
    }

    filtreDate(line: string):boolean {
        // obtenir la date, deuxième element de la ligne séparé par ,
        let lineSplit = line.split(",");
        let dateStr = lineSplit[1].replace("le ", "").trim();

        // conversion au format Date
        let date = this.strToDate(dateStr, "/");

        // comparaison
        if ((this.filtreDateDebut == undefined) ||
            (date >= this.filtreDateDebut && date <= this.filtreDateFin)) {
            return true
        } else {
            return false
        }
    }

    /**
     * Nouveau réseau choisi : filtre le log pour montrer les infos sur ce réseau
     * et sauvegarde le nouveau état
     * */
    modifierSelection(i: string) {
        let nouveauLog = this.filtrerLog(i);
        if (i == "Distribution")
            nouveauLog = this.ajouterStatistiques(nouveauLog);
        this.setState({ selection: i, logFiltre: nouveauLog });
    }

    /**
     * Nouveau réseau choisi : filtre le log pour montrer les infos sur ce réseau
     * et sauvegarde le nouveau état
     * */
    modifierDatesRange(dateDebut: string, dateFin: string) {
        // conversion des strings au format Date
        this.filtreDateDebut = this.strToDate(dateDebut, "-");
        this.filtreDateFin = this.strToDate(dateFin, "-");

        // filtrer encore le log
        this.modifierSelection(this.state.selection);
    }

    strToDate(date: string, separation: string): Date {
        let parts = date.split(separation);
        return new Date(parseInt(parts[2], 10),
            parseInt(parts[1], 10) - 1,
            parseInt(parts[0], 10));
    }

    /**
     * Ajout des options de réseau à choisir dans le menu à gauche
     * */
    ajouterOptions(idEcole: string) {
        const MAX_ETOILE = 5;
        const MAX_ANNEAU = 5
        let optionEtoileNom = "Étoile "; // Étoile X
        let optionEtoileCode = "E"+idEcole; // EYX
        let optionAnneauNom = "Anneau "; // Anneau X
        let optionAnneauCode = "A"+idEcole; // AYX
        // etoile
        for (let i:number = 0; i < MAX_ETOILE; i++) {
            this.options[optionEtoileNom + i]=optionEtoileCode+i;
        }
        // anneau
        for (let i:number = 0; i < MAX_ANNEAU; i++) {
            this.options[optionAnneauNom + i]=optionAnneauCode+i;
        }
        // distribution
        this.options["Distribution"]="DOM0-"+idEcole;
    }

    /**
     * Ajout des statistiques dans le log affiché sur le jeu distribution
     * */
    ajouterStatistiques(log: string) {
        const lines = log.split('\n');
        let newLines = "";
        let pertes = 0, gains = 0, essais = 0, verrous = 0, echecsVerrou = 0, destructs = 0, transits = 0;
        for (let line of lines) {
            if (line.includes("PERTE"))
                pertes += 1;
            else if (line.includes("GAIN"))
                gains += 1;
            else if (line.includes("ESSAI"))
                essais += 1;
            else if (line.includes("VERROU"))
                verrous += 1;
            else if (line.includes("ECHEC_VERROU"))
                echecsVerrou += 1;
            else if (line.includes("DESTRUCT"))
                destructs += 1;
            else if (line.includes("TRANSIT"))
                transits += 1;
        }

        if (pertes)
            newLines += "PERTES : " + pertes + "\n";
        if (gains)
            newLines += "GAINS : " + gains + "\n";
        if (essais)
            newLines += "ESSAIS : " + essais + "\n";
        if (verrous)
            newLines += "VERROUS : " + verrous + "\n";
        if (echecsVerrou)
            newLines += "ECHECS VERROU : " + echecsVerrou + "\n";
        if (destructs)
            newLines += "DESTRUCTS : " + destructs + "\n";
        if (transits)
            newLines += "TRANSITS : " + transits + "\n";

        if (newLines != "")
            return log + "=== Statistiques ===\n" + newLines;
        else
            return log;
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
 * PastilleAdmin : interface, class et style (CSS)
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
