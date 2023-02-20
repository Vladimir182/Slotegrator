import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';
import _ from 'lodash';
import { Collapse, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/Folder';
import PersonIcon from '@material-ui/icons/Person';
import HomeIcon from '@material-ui/icons/Home';
import ComputerIcon from '@material-ui/icons/Computer';
import { setSelectedNode, resetSelectedNode } from '../../../ducks/selected';
import { ExpandLess, ExpandMore } from '@material-ui/icons';
import { connect } from 'react-redux';


const styles = theme => ({
  dropDown: {
    padding: 0,
    '& .MuiListItem-gutters': {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
    },
    '& .MuiListItem-root': {
      padding: 0,
      paddingLeft: theme.spacing(3),
      paddingRight: theme.spacing(6)
    },
    '& .MuiTypography-body1':{
      lineHeight: 1
    },
    '& .MuiListItemText-root': {
      margin: 0
    }	
  },
  nested: {
    paddingLeft: theme.spacing(4),
    '& .MuiListItemIcon-root': {
      display: 'flex',
      alignItems: 'center',
      minWidth: '25px'
    }
  },
  rootIcon: { 
		width: '18px',
		color: theme.palette.breadCrumbs.iconColor
	},
  styleIcon: {
    height: '24px',
    width: '24px'
  }
})

const ExpandButton = (props) => {
 const { item = {}, open, handleSetOpen, classes} = props;

  return (
  <ListItem 
    className={props.classes.nested} 
    button 
    onClick={item.nodeType !== 'root' ? handleSetOpen : () => {}}
  >
    <ListItemIcon
      className={props.classes.styleIcon}>
      {/* <StarBorder /> */}
      {item.nodeType === 'root' ? <FolderIcon className={props.classes.rootIcon}/>: item.nodeType === 'merchant'? <PersonIcon className={props.classes.rootIcon}  /> : item.nodeType ==='room' ? 	<HomeIcon className={props.classes.rootIcon} /> : item.nodeType==='terminals'? <ComputerIcon className={props.classes.rootIcon} /> : <ComputerIcon className={props.classes.rootIcon} />} 
    </ListItemIcon>
    <ListItemText primary={item.nodeType === 'terminal' ? `TERMINAL ${item.id}` : item?.title?.toUpperCase()} />
    { item.nodeType !== 'root' && (open ? <ExpandLess /> : <ExpandMore />)}
  </ListItem>
)};

class MobileBreadcrumbs extends Component{

  state = {
		open: false
	}

  BreadcrumbsListItem = (item, active) => (
    <React.Fragment key={_.uniqueId('bread_crumb')}>
      <ListItem 
        button 
        className={this.props.classes.nested} 
        onClick={ () => this.handleClickItem(item, active)}
      >
        <ListItemIcon
          className={this.props.classes.styleIcon}>
          {item.nodeType === 'root' ? <FolderIcon className={this.props.classes.rootIcon}/>: item.nodeType === 'merchant'? <PersonIcon className={this.props.classes.rootIcon} /> : item.nodeType ==='room' ? 	<HomeIcon className={this.props.classes.rootIcon} /> : item.nodeType==='terminals'? <ComputerIcon className={this.props.classes.rootIcon} /> : <ComputerIcon  className={this.props.classes.rootIcon} />} 
        </ListItemIcon>
        <ListItemText 
          primary={item.nodeType === 'terminal' ? `TERMINAL ${item.id}` : item?.title?.toUpperCase()} 
        />
      </ListItem>
    </React.Fragment>
  );

	handleSetOpen = () => {
		this.setState({
			open: !this.state.open
		})
	};

  handleClickItem = (item) => {
    const { user, setSelectedNode, resetSelectedNode } = this.props;

		if (item.nodeType === 'root') {
			resetSelectedNode()
			
			return;
		}

		setSelectedNode(item.id, item.nodeType, user.resources);
    this.setState({
      open: false
    })
  }

  render(){
    const { classes, data = [], resetSelectedNode, selected } = this.props;
    const {open} = this.state;
    const items = _.map(data, (item, index) => {
      if (index === data.length - 1)
        return;

      return this.BreadcrumbsListItem(item);
    });

    const activeItem = data[data.length - 1];

    return (
      <>
      { selected.merchant !== null
        ?  <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            className={classes.dropDown}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {items}
              </List>
            </Collapse>
            <ExpandButton 
              handleSetOpen={this.handleSetOpen} 
              open={open} 
              item={activeItem} 
              classes={classes}
            />
          </List> 
        : <List style={{'height':'24px'}}></List>
  }
      </>
    )
  }
}

const mapStateToProps = state => ({
  user: state.authorization.userData.user,
	current: state.merchants.current,
	rooms: state.merchants.rooms,
	terminals: state.merchants.terminals,
	merchants: state.merchants.merchants,
	selected: state.selected
})

const mapDispatchToProps = {
	setSelectedNode,
	resetSelectedNode
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  withStyles(styles)
  )(MobileBreadcrumbs)