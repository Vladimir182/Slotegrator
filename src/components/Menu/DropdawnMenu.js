import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import _ from 'lodash';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Collapse from '@material-ui/core/Collapse';
import MenuItem from './MenuItem';

const styles = theme => ({
  root: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: '0.9375rem',
    letterSpacing: '0.02857em',
    lineHeight: '26px',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    '& .MuiListItem-button': {
      color: theme.palette.button.menuItem.color,
      '&:hover':{
        background: theme.palette.buttonHover
      }
    }
  },
  menuText: {
  },
  nestedList: {
    padding: 0,
    paddingBottom: 0,
    height: '100%',
    '& > a, & > button': {
      paddingLeft: '1.5rem',
      width: '100%',
      height: '100%',
    },
  },
  MenuItem: {
    fontFamily: 'inherit'
  }
});

class DropdawnMenu extends Component {
  state = {
    open: null
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    const { data, pathname } = nextProps;
    const { open } = prevState;

    if (data && pathname && open === null) {
      const isOpen = data.href !== '/' ? new RegExp(data.href + '/').test(pathname) : false;
      return {
        open: isOpen
      }
    } else return null;
  }

  handleClick = () => {
    this.setState((prevState) => {
      return {
        open: !prevState.open
      }
    });
  };
  
  render() {
    const { classes, data, resources, selected, terminalData, handlerDrawerClose } = this.props;
    let { open } = this.state;

    return (
      <List
        component="nav"
        aria-labelledby="nested-list-subheader"
        className={classes.root}
        disablePadding
      >
        <ListItem button disableGutters={true} className="MuiButton-textSizeLarge" onClick={this.handleClick}>
          <span className={`${classes.menuText} `} >{data.text}</span>
        </ListItem>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
              { _.map(data.children, item => (
                <ListItem
                  disableGutters={true}
                  button 
                  className={`${classes.nestedList} MuiButton-textSizeLarge`}
                  key={_.uniqueId('menu-items')}
                  to={item.href}
                >
                  {(item.checkRender(resources, selected, terminalData)) && <MenuItem
                    className={classes.MenuItem}
                    key={_.uniqueId('menu-items')}
                    to={item.href}
                    text={item.text}
                    target={item.target}
                    handlerDrawerClose={handlerDrawerClose}
                  />}
                </ListItem>
              ))}
          </List>
        </Collapse>
      </List>
    );
  };
}

export default withStyles(styles)(DropdawnMenu);