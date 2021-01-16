import * as React from "react";
import styled, {keyframes} from "styled-components";
import {useState} from "react";

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

const Form = styled.form`
  margin: 0 auto;
  width: 100%;
  max-width: 414px;
  padding: 1.3rem;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Input = styled.input`
  max-width: 100%;
  padding: 11px 13px;
  background: #f9f9fa;
  color: #f03d4e;
  margin-bottom: 0.9rem;
  border-radius: 4px;
  outline: 0;
  border: 1px solid rgba(245, 245, 245, 0.7);
  font-size: 14px;
  transition: all 0.3s ease-out;
  box-shadow: 0 0 3px rgba(0, 0, 0, 0.1), 0 1px 1px rgba(0, 0, 0, 0.1);
  :focus,
  :hover {
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.15), 0 1px 5px rgba(0, 0, 0, 0.1);
  }
`;

const jump = keyframes`
  from{
    transform: translateY(0)
  }
  to{
    transform: translateY(-3px)
  }
`;

const Button = styled.button`
  max-width: 100%;
  padding: 11px 13px;
  color: rgb(253, 249, 243);
  font-weight: 600;
  text-transform: uppercase;
  background: #f03d4e;
  border: none;
  border-radius: 3px;
  outline: 0;
  cursor: pointer;
  margin-top: 0.6rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-out;
  :hover {
    background: rgb(200, 50, 70);
    animation: ${jump} 0.2s ease-out forwards;
  }
`;

const BackButton = styled(Button)`
  background: #050a4d;
  :hover {
    background: #02063b;
  }
`;

const Title = styled.h2`
  font-weight: normal;
  color: #2a2a29;
  // text-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Hr = styled.hr`
  border-top: 1px solid #bbb;
  max-width: 380px;
  margin-top: 10px;
  width: 100%;
`;


interface AccessPageProps {
    onClick: (code: string | undefined) => void | undefined,
}

function AccessPage(props: AccessPageProps) {
    const [code, setCode] = useState<string>();
    return (
        <Wrapper>
            <Title>Code d'accès :</Title>
            <Form>
                <Input type="text" onChange={e => setCode(e.target.value)}/>
                <p>Vous n'avez pas un code ? Contactez l'administrateur.</p>
                <Button type="submit" onClick={() => props.onClick(code)}>Envoyer</Button>
            </Form>
        </Wrapper>
    );
}

interface JeuChoixPageProps {
    goBack: () => void,
    code: string
}

function JeuChoixPage(props: JeuChoixPageProps) {
    const domain = document.location.origin; // local retourne : http://localhost:8081
    const codeQuery = "?code=" + props.code;
    const lienEtoile = domain + "/tchat/etoile0" + codeQuery;
    const lienAnneau = domain + "/tchat/anneau0"+ codeQuery;
    const lienJeu1 = domain + "/jeu1/distribution0"+ codeQuery;

    return (
        <Wrapper>
            <Title>Quel jeu vous voulez jouer ?</Title>
            <Form action={lienEtoile}>
                <Button type="submit">Tchat Etoile</Button>
            </Form>
            <Form action={lienAnneau}>
                <Button type="submit">Tchat Anneau</Button>
            </Form>
            <Form action={lienJeu1}>
                <Button type="submit">Distribution</Button>
            </Form>
            <Hr/>
            <Form>
                <BackButton type="submit" onClick={props.goBack}>Changer le code d'accès</BackButton>
            </Form>
        </Wrapper>
    );
}

interface AccueilState {
    hasCode: boolean,
    code: string,
}

export class Corps extends React.Component<{}, AccueilState> {
    constructor(props: {}) {
        super(props);
        this.state = {
            hasCode: false, //aCode
            code: "",
        };
    }

    handleSubmit(code: string) {
        let codesValides = ["A1", "B2", "C3"]; // provisoire
        if (process.env.CODES != null)
            codesValides = process.env.CODES.split(",");

        if (codesValides.includes(code))
            this.setState({hasCode: true, code: code});
        else
            alert("Ce code n'est pas valide !");
    }

    goBackAccessPage() {
        this.setState({hasCode: false, code: ""});
    }

    render() {
        if (!this.state.hasCode) // demander code d'accès
            return (
                <AccessPage onClick={(code:string) => this.handleSubmit(code)}/>
            );
        else // code valide fourni, afficher les choix des jeux
            return (
                <JeuChoixPage goBack={this.goBackAccessPage} code={this.state.code}/>
            );
    }
}
