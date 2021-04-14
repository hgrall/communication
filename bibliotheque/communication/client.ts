import {
    FormatMessage, Message,
    FormatErreurRedhibitoire, ErreurRedhibitoireParEnveloppe,
    FormatConfigurationInitiale, ConfigurationParEnveloppe, FormatInformation
} from "../reseau/formats";

export interface CanalClientServeur<
    FErr extends FormatErreurRedhibitoire, FConf extends FormatConfigurationInitiale,
    FMsg extends FormatMessage, FInfo extends  FormatInformation,
    EtMsg extends string> {
    envoyerMessage(msg: Message<FMsg, EtMsg>): void;
    enregistrerTraitementMessageRecu(traitement: (m: FMsg) => void): void;
    enregistrerTraitementConfigurationRecue(traitement: (c: FConf) => void): void;
    enregistrerTraitementErreurRecue(traitement: (e: FErr) => void): void
    enregistrerTraitementInformationRecue(traitement: (i: FInfo) => void): void
}

class CanalClientServeurWebSocket<
    FErr extends FormatErreurRedhibitoire, FConf extends FormatConfigurationInitiale,
    FMsg extends FormatMessage, FInfo extends  FormatInformation,
    EtMsg extends string
    > implements CanalClientServeur<FErr, FConf, FMsg, FInfo, EtMsg>
{
    adresse: string;
    lienServeur: WebSocket;
    constructor(adresse: string) {
        this.adresse = adresse;
        this.lienServeur = new WebSocket(this.adresse, 'echo-protocol');
    };

    // Effet : send(String)
    envoyerMessage(msg: Message<FMsg, EtMsg>): void {
        this.lienServeur.send(msg.brut());
    };

    // Effet: enregistrement comme écouteur
    enregistrerTraitementMessageRecu(traitement: (m: FMsg) => void): void {
        this.lienServeur.addEventListener("message", function (e: MessageEvent) {
            let msg = JSON.parse(e.data);
            if (msg.configurationInitiale !== undefined) {
                return;
            }
            if (msg.erreurRedhibitoire !== undefined) {
                return;
            }
            if (msg.information!== undefined) {
                return;
            }
            traitement(<FMsg>msg);
        });
    };
    // Effet: enregistrement comme écouteur
    enregistrerTraitementConfigurationRecue(traitement: (c: FConf) => void): void {
        this.lienServeur.addEventListener("message", function (e: MessageEvent) {
            let contenuJSON = JSON.parse(e.data);
            if (contenuJSON.configurationInitiale === undefined) {
                return;
            }
            traitement(<FConf>contenuJSON);
        });
    };
    // Effet: enregistrement comme écouteur
    enregistrerTraitementErreurRecue(traitement: (e: FErr) => void): void {
        this.lienServeur.addEventListener("message", function (e: MessageEvent) {
            let contenuJSON = JSON.parse(e.data);
            if (contenuJSON.erreurRedhibitoire === undefined) {
                return;
            }
            traitement(<FErr>contenuJSON);
        });
    };

    enregistrerTraitementInformationRecue(traitement: (m: FInfo) => void): void {
        this.lienServeur.addEventListener("message", function (e: MessageEvent) {
            let contenuJSON = JSON.parse(e.data);
            if (contenuJSON.information=== undefined) {
                return;
            }
            traitement(<FInfo>contenuJSON);
        });
    };
};

export function creerCanalClient<
    FErr extends FormatErreurRedhibitoire, FConf extends FormatConfigurationInitiale,
    FMsg extends FormatMessage,  FInfo extends  FormatInformation, EtMsg extends string
    >(adresse: string): CanalClientServeur<FErr, FConf, FMsg,FInfo, EtMsg> {
    return new CanalClientServeurWebSocket<FErr, FConf, FMsg,FInfo, EtMsg >(adresse);
}

