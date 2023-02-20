import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import _ from 'lodash';

const styles = theme => ({
	root: {
		color: theme.palette.tableHeaderColor,
		fontSize: '0.75rem',
		fontWeight: '500',
		padding: '18px 10px',
		fontWeight: 'bold'
	}
})

class CreatorTableHeader extends Component {
	render() {
		const { classes, rows, sortBy, handleSort, asc } = this.props;
		return (
			<React.Fragment>
				{_.map(rows, row => {
					let align = row.numeric ? 'right' : row.alignCenter ? 'center' : 'left';
					if (row.center) align = 'center';
					return (
						<TableCell
							classes={{
								root: classes.root
							}}
							// style={{ paddingLeft: row.disableSort ? '16px' : 'initial' }}
							variant="head"
							key={row.id}
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
								<>
									<span style={{marginLeft: !rows.filter(item => !item.disableSort).length ? '0px' : '27px'}}></span>
									<span>{row.label}</span>
								</>
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
										onClick={() => handleSort(row.id)}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							)}
						</TableCell>
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
export default withStyles(styles)(CreatorTableHeader);
