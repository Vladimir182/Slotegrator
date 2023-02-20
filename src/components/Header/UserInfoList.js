import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import  classNames from 'classnames';
import VersionApp from './VesrionApp';

const StyledMenuButton = theme => ({
    menuButton: {
        display: 'flex',
        height: '100%',
        position: 'relative', 
        minWidth: '72px',
        '& > span': {
            display: 'flex',
            lineHeight: '25px'
        },
        '&:hover':{
          background: theme.palette.buttonHover
        }
    },
    iconUsername: { 
        position: 'absolute',
        bottom: '-2px', 
        fontSize: '10px', 
        textTransform: 'none!important', 
    },
    buttonText: {
        display: 'inline-block',
        verticalAlign: 'bottom',
        lineHeight: 'normal',
        paddingBottom: '1px'
    },
    versionApp: {
        height: '25px',
        padding: '0',
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none'
    },
    logoutListItem: {
        display: 'flex',
        justifyContent: 'center',
    },
    userData: {
        pointerEvents: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        marginTop: '-8px',
        '&:focus': {
            backgroundColor: 'rgba(0, 0, 0, 0)',
        },
        '& > div': {
            display: 'flex',
            flexDirection: 'column',
        },
        '& > div > p': {
            display: 'inline',
            lineHeight: '1',
            margin: '0px',
            color: 'gray', 
            fontSize: '12px' 
        }
    },
	lightedHeaderButton: {
		backgroundColor: 'rgba(250,250,250, 0.8)',
		color: 'rgba(0,0,0, 1)'
	},
	liteUserIcon: {
		color: 'rgba(255,255,255, 1)'
	},
	darkUserIcon: {
		color: 'rgba(0,0,0, 1)'
	}
});

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
    transform: 'none!important'
  },
})(props => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles(theme => ({
  root: {
      textAlign: 'middle',
    '&:focus': {
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

class UserInfoList extends Component {
    state = {
        anchorEl: null,
	     showBg: false,
    };

    handleClick = event => {
        this.setAnchorEl(event.currentTarget);
        this.setState({
	        showBg: true
        })
    };
    
    handleClose = () => {
        this.setAnchorEl(null);
	    this.setState({
		    showBg: false
	    })
    };

    setAnchorEl = (value) => {
        this.setState({
            anchorEl: value
        });
    }
    render() {
        const { anchorEl } = this.state;
        const { handlerLogOut, userData, classes } = this.props;
        let shortUsername = userData.username.length > 10 ? userData.username.slice(0, 8) + '...' : userData.username;
        return (
          <div>
	          {/*{ this.state.showBg ?*/}
		          <Button
			          className={classNames(classes.menuButton, { [classes.lightedHeaderButton]: this.state.showBg })}
			          aria-controls="customized-menu"
			          aria-haspopup="true"
			          // variant="contained"
			          color="inherit"
			          onClick={this.handleClick}
		          >
			          <AccountBoxIcon className={classNames({
				          [classes.liteUserIcon]: !this.state.showBg,
				          [classes.darkUserIcon]: this.state.showBg
			          })}/>
			          <span className={classes.iconUsername} style={{textTransform: 'none'}}>{shortUsername}</span>
		          </Button>
            <StyledMenu
	            style={{marginTop: '5px', marginLeft:'13px'}}
              id="customized-menu"
              anchorEl={anchorEl}
              anchorOrigin={{
	              vertical: 'bottom',
	              horizontal: 'left',
              }}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={this.handleClose}
            >
              <StyledMenuItem className={classes.userData}>
                <div>
                  <p>Signed in as:</p>
                  <span className={classes.buttonText}>{userData.username}</span>
                </div>
              </StyledMenuItem>
              <StyledMenuItem 
                onClick={handlerLogOut} 
                className={classes.logoutListItem} 
              >
                Logout
              </StyledMenuItem>
              <StyledMenuItem className={classes.versionApp}>
                <VersionApp />
              </StyledMenuItem>
            </StyledMenu>
          </div>
        );
      }
}

export default withStyles(StyledMenuButton)(UserInfoList);