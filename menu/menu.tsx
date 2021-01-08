import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {BoutonJeu} from "./composants/BoutonJeu";
import { Admin } from "./composants/Admin";
import {MuiThemeProvider} from 'material-ui/styles';


const styles = {
  margin: {
    margin: '30px',
    display: "flex" as 'flex',
    alignItems: "center" as 'center',
    flexDirection: 'column' as 'column'
  }
};

export class Menu extends React.Component<any, any> {
  constructor(props: any){
      super(props);
  }

  public render() {
    const jeux = [
      {
        nom: "Adressage et Routage",
        disabled: false,
        link: "/routage/"
      },
      {
        nom: "Jeu 2",
        disabled: true,
        link: ""
      },
      {
        nom: "Jeu 3",
        disabled: true,
        link: ""
      },
      {
        nom: "Jeu 4",
        disabled: true,
        link: ""
      }
    ];

    return (
      <div style={styles.margin}>
        {jeux.map((jeu) =>
          <BoutonJeu nom={jeu.nom} disabled={jeu.disabled} link={jeu.link}/>
        )}
        <Admin />
      </div>
    );
  }
}