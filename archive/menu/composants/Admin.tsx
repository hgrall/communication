import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router-dom';
const styles = {
    margin: {
        margin: '10px'
    }
};
export class Admin extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return (
            <div>
                <RaisedButton
                    style={styles.margin}
                    label={'Administrateur'}
                    secondary={true}
                    containerElement={<Link to={'/admin/'} />}
                >
                </RaisedButton>
            </div>
        );
    }
}