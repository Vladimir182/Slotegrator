import React from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    warnWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#b5830c',
        marginTop: '20px',
        padding: '12px 12px',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 179, 2, 0.3)',
        border: '2px solid rgba(181, 131, 12, 0.7)'
    }
})

const Warning = ({text, classes}) => (
    <div className={classes.warnWrapper}>
        <span>
            {text}
        </span>
    </div>
);

export default withStyles(styles)(Warning);