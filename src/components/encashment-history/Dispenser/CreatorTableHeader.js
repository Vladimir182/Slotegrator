import React, { Component } from 'react';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import _ from 'lodash';
import { TableRow } from '@material-ui/core';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import { compose } from 'redux';

const styles = theme => ({
	root: {
		padding: '',
	},
	nonUnderline: {
		borderBottom: 0,
	},
	headerTopTitle: {
		width: '100%',
		display: 'inline-block'
	},
	titleRow: { 
		width: '100%',
		display: 'inline-block', 
		height: '25px',
	},
	titleCell: {
		display: 'inline-block', 
		height: '25px',
		width: '50%'
	},
	tableCellTypohraphy: {
		color: theme.palette.tableHeaderColor,
		fontSize: '0.75rem',
		fontWeight: 'bold',
	}
});

class CreatorTableHeader extends Component {
	render() {
		const { rows, sortBy, handleSort, asc, classes } = this.props;
		return (
			<React.Fragment>
				{_.map(rows, row => {
					let align = 'left';
					// let align = row.numeric ? 'right' : row.double ? 'center' : 'left';
					// if (row.center) align = 'center';
					return (
					<>
						{
							row.double 
							? <TableCell
								className={classes.tableCellTypohraphy}
								// key={row.id}
								padding={row.disablePadding ? 'none' : 'default'}
								sortDirection={
									sortBy === row.id
										? asc
											? 'asc'
											: 'desc'
										: false
								}>
								<TableRow className={classes.titleRow}>
								{/* colSpan={2}  */}
									<TableCell align={"left"} className={classNames(classes.nonUnderline, classes.headerTopTitle, classes.tableCellTypohraphy)}>
										{row.id}
									</TableCell>
								</TableRow>
								<TableRow className={classes.titleRow}>
									<TableCell align={align} className={classNames(classes.nonUnderline, classes.tableCellTypohraphy)}>Collector</TableCell>
									<TableCell align={align} className={classNames(classes.nonUnderline, classes.tableCellTypohraphy)}>Expected</TableCell>
								</TableRow>
							</TableCell>
							: <TableCell
								key={row.id}
								className={classes.tableCellTypohraphy}
								align={align}
								padding={row.disablePadding ? 'none' : 'default'}
								sortDirection={
									sortBy === row.id
										? asc
											? 'asc'
											: 'desc'
										: false
								}>
								{row.disableSort ? (
									row.label
								) : (
									<Tooltip
										title="Sort"
										placement={
											row.numeric
												? 'bottom-end'
												: 'bottom-start'
										}
										enterDelay={300}>
										<TableSortLabel
											active={sortBy === row.id}
											direction={asc ? 'asc' : 'desc'}
											onClick={() => handleSort(row.id)}>
											{row.label}
										</TableSortLabel>
									</Tooltip>
								)}
							</TableCell>
						}
					</>
					);
				})}
			</React.Fragment>
		);
	}
}
CreatorTableHeader.defaultProps = {
	handleSort: () => {},
	sortBy: 'id',
	asc: false,
	rows: []
};
export default compose(
	withStyles(styles)
)(CreatorTableHeader);
