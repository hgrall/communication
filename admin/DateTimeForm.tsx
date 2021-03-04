import {
    DatesRangeInput
} from 'semantic-ui-calendar-react';
import * as React from "react";
import styled from "styled-components";
import {CADRE} from "../bibliotheque/interface/couleur";

const styleText = {
    margin: "0.5em 0.5em 0 0.5em",
};

const StyledDatesInput = styled(DatesRangeInput)`
  margin: 0.5em 0.5em 0 0;
`;

const SubmitButton = styled.button`
    flex: initial;
    background: ${CADRE};
    border-radius: 1ex;
    color: white;

    border-style: solid;
    border-width:  0;

    padding: 1ex;
    margin: 0.5em 0.5em 0 0;
    max-width: 20vw;
    width: 7em;
    min-width: 7em;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`;

const Form = styled.div`
  display: flex; 
  flex-direction: row;
`;

interface DateTimeFormState {
    datesRange: string,
}
interface DateTimeFormProps {
    modifDatesRange: (i: string, string: string) => void,
}
export class DateTimeForm extends React.Component<DateTimeFormProps, DateTimeFormState> {
    constructor(props: DateTimeFormProps) {
        super(props);

        this.state = {
            datesRange: ''
        };
    }

    // tslint:disable-next-line:no-any
    handleChange = (event: any, {name, value}: any) => {
            this.setState({datesRange: value});
    }

    handleSubmit = () => {
        console.log("submit : " + this.state.datesRange);
        if (this.state.datesRange != '') {
            let dates = this.state.datesRange.split(' - '); // debut - fin
            if (dates[1] == "")
                dates[1] = "99-99-9999";
            this.props.modifDatesRange(dates[0], dates[1]);
        } else {
            this.props.modifDatesRange("00-00-0000", "99-99-9999"); // pour retirer le filtre
        }
    }

    render() {
        return (
            <Form>
                <label style={styleText as React.CSSProperties}>
                    Filtrer par date :
                </label>
                <StyledDatesInput
                    name="datesRange"
                    placeholder="Début - Fin"
                    value={this.state.datesRange}
                    iconPosition="left"
                    onChange={this.handleChange}
                />
                <SubmitButton onClick={this.handleSubmit}>
                    Appliquer
                </SubmitButton>
            </Form>
        );
    }
}
