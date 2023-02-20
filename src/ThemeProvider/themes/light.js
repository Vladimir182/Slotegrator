
const light = {

	breakpoints: {
		values: {
			xs: 0,
			sm: 600,
			md: 960,
			lg: 1280,
			xl: 1920,
		},
	},	
	
	modalWindow: {
		title: {
			color: "#000000"
		}
	},
	custom: {
		Table: {},
	},
	spacing: 4,
	palette: {
		type: 'light',
		primary: {
			main: '#6662D9',
			merchant: '#6662D9',
			merchantActive: '#474497',
			room: '#8481e0',
			roomActive: '#9c9ae6',
			terminal:'#afaeeb',
			terminalActive:'#474497',
			contrastText: '#ffffff',
		},
		secondary: {
			main: '#7672fb',
			contrastText: '#ffffff'
		},
		background: {
			main: '#fafafa',
			default: '#fafafa',
			styleDivider: '#6662D9',
			bgArrowMenu: '#6662D9'
		},
		error: {
			main: '#FF0000',
			dark: '#ef0000',
			contrastText: 'rgba(255, 255, 255, 0.95)'
		},
		mint: {
			main: '#b2ebf2',
			contrastText: '#000000'
		},
		gray: {
			main: 'rgba(0, 0, 0, 0.54)'
		},
		table:{
			selectedTerminalTableRow: 'rgba(118, 114, 251, 0.1)',
			hoverSelectedTerminalTableRow: 'rgba(118, 114, 251, 0.18)',
		},
		button:{
			background: 'rgba(118, 114, 251, 0.18)',
			hover: 'rgba(118, 114, 251, 0.1)',
			menuItem: {
				color: '#ffffff',
				activeItem: '#5955bd'
			},
			borderColor: '2px solid #7672fa',
			border: '#7672fa',
			radius: '50%',
			color: '#7672fa'
		},
		
		tableControl: {
			tableControlColor: '#ffffff',
			tableHeaderColor: '#000000',
		},
		breadCrumbs: {
			// iconColor: 'rgba(0, 0, 0, 0.47)',
			iconColor: '#ffffff',
			breadCrumbBackground: '#6D68E8',
		},
		iconColor: '#716DF2',
		activeLinkColor: "#7672fb",
		// sidebarBackground: 'linear-gradient(to bottom,#fff,#fff, rgba(63, 81, 181, 0.3))',
		sidebarBackground: '#6D68E8',
		preloaderOverlayBackground: 'rgba(255,255,255,0.7)',
		buttonHover: '#5955bd',
		tableControlPanelBG: '#ffffff'
	},
	typography: {
		useNextVariants: true,
		color: '#000000'
	},
	overrides: {
		// START DataPicker and Selects
		MuiOutlinedInput: {
			input: {
				padding: '16px 10px 17px',
			},
			root: {
				"& $notchedOutline": {
					border: '2px solid #7672fa',
					borderRadius: '25px'
				},
				"&:hover $notchedOutline": {
					backgroundColor: 'rgba(118, 114, 251, 0.1)',
					borderColor: '#7672fa'
				},
				"&$focused $notchedOutline": {
					borderColor: '#7672fa'
				},
				'& .MuiSelect-select:focus': {
					backgroundColor: 'transparent',
					borderRadius: '25px'
				},
			
			},
		},
		MuiButton: {
			containedSecondary: {
				'&:hover':{
					backgroundColor: '#6662D9'
				}
			}
		},
		// END DataPicker and Selects
		MuiTableCell: {
			root: {
				'&>div': {
					maxHeight: '350px',
					overflowY: 'auto',
				},
				borderBottom: '1px solid rgb(132, 128, 251, 0.2)',
				padding: '10px',
			}
		},
		MuiTableRow: {
			root: {
				'&:hover': {
					background: 'rgba(118, 114, 251, 0) !important'
				}
			}
		},
		MuiCssBaseline: {
			'@global': {
				html: {
					color: '#000000' 
				},
			},
		},
		MuiLinearProgress: {
			root: {
				backgroundColor: '#6D68E8'
			}
		},
		MuiCircularProgress: {
			colorPrimary: {
				color: '#6D68E8'
			}
		},
		MuiSnackbarContent: {
			root: {
				color: '#ffffff'
			}
		},
		MuiFilledInput: {
			root: {
				'&$underline:after': {
					'border-bottom-color': '#3f51b5'
				},
				backgroundColor: 'rgba(255,255,255, 0)'
			}
		},
		MuiFormLabel: {
			root: {
				color: '#000000',

				// Fix for old brovsers
				paddingLeft: '5px',
				paddingRight: '5px',
				backgroundColor: '#ffffff',
				transform: 'translate(12px, -6px) scale(0.75)',

				"&$focused": {
					color: '#000000',
				},
			}, 
			colorSecondary: {
				"&$focused": {
					color: '#000000',
				}
			}
		}
	}
}

export default light;