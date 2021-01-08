import * as React from "react";

import styled from "styled-components";

import Scrollbars from "react-custom-scrollbars";

import { ContainerAdmin } from "./containerAdmin";
import { Individu } from "./typesInterface";

interface ProprietesAdmin {
  // see https://github.com/Microsoft/TypeScript/issues/8588
  className?: string;
  sujet: Individu;
  objets: ReadonlyArray<Individu>;
  tous: Individu;
  selection: Individu;
  modifSelection: (i: Individu) => void;
}

class ContenuAdmin extends React.Component<ProprietesAdmin, {}> {
  render() {
    return (
      <div className={this.props.className}>
        <Scrollbars style={{ width: "24vw", height: "100vh" }}>
          <ContainerAdmin
            sujet={this.props.sujet}
            objets={this.props.objets}
            tous={this.props.tous}
            selection={this.props.selection}
            modifSelection={this.props.modifSelection} />
        </Scrollbars>
      </div>
    );
  }
}

export const Admin = styled(ContenuAdmin)`
    background: rgb(170, 170, 170);
    position: fixed;
    top: 0;
    left: 0;
`;

