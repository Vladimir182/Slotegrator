import {
	darken,
	fade,
	lighten
} from '@material-ui/core/styles/colorManipulator';
import cyan from '@material-ui/core/colors/cyan';
import teal from '@material-ui/core/colors/teal';

export default theme => {
	let SHADE = 100;

	if (theme.palette.type == 'dark') {
		SHADE = 400;
	}

	return {
		borderRight: {
			borderRight: `1px solid ${
				theme.palette.type === 'light'
					? lighten(fade(theme.palette.divider, 1), 0.88)
					: darken(fade(theme.palette.divider, 1), 0.68)
			}`
		},
		merchantCaption: {
			fontSize: theme.typography.pxToRem(16)
		},
		roomRow: {
			backgroundColor: cyan[SHADE]
		},
		terminalRow: {
			backgroundColor: teal[SHADE]
		},
		root: {
			marginTop: theme.spacing.unit * 3,
			'& .MuiTableCell-stickyHeader': {
				top: '164px!important',
			},
			[theme.breakpoints.between('xs','sm')]:{
				// overflowX: 'auto'
			},
			'& .MuiButton-textSecondary': {
				minWidth: '52px',
				height: '52px',
				marginLeft: '10px',
				border: theme.palette.button.borderColor,
				borderRadius: theme.palette.button.radius,
				'&:hover':{
					backgroundColor: theme.palette.button.hover,
				}
			},

			'& .MuiTableHead-root': {	

				[theme.breakpoints.down('1200')]:{
					'& > tr > th': {
						top: '0 !important'
					}				
				},
			},

			'& .wrapPageReports': {
				[theme.breakpoints.down('900')]: {
					width: '100%',

					'& > div': {
						paddingTop: theme.spacing(3),
						maxWidth: '210px',
					}					
				},
				[theme.breakpoints.down('700')]: {
					display: 'block'
				}
			}
		},
		table: {
			width: '100%',
			// overflowX: 'auto'
		},
		controls: {
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		styleNoData:{
			padding: '10px 0',
			fontSize: '15px',
			lineHeight: '1.43',
			color: theme.palette.tableHeaderColor
		},

		tableFilterReportsPage: {
			paddingTop: '4px',
			backgroundColor: theme.palette.tableControlPanelBG,	 
			position: 'sticky',
			top: '88px',
			zIndex: '1000',

			[theme.breakpoints.down('1200')]: {
				position: 'static',
				top: '0px!important',
			},
		},

		wrapTableForScroll: {	
			[theme.breakpoints.down('1200')]:{
				overflowX: 'auto',
			},
		},
	};
};
