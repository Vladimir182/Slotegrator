const dark = {

	custom: {
		Table: {}
	},
	modalWindow: {
		title: {
			color: "#ffffff"
		}
	},
	spacing: 4,
	palette: {
		type: 'dark',
		primary: {
			main: '#7672fb',
			merchant: '#6662D9',
			merchantActive: '#474497',
			room: '#8481e0',
			roomActive: '#9c9ae6',
			terminal:'#afaeeb',
			terminalActive:'#474497',
			contrastText: '#ffffff'
		},
		secondary: {
			main: '#7672fb',
			contrastText: '#ffffff'
		},
		background: {
			main: '#1c1c2f',
			default: '#1c1c2f',
			paper: '#242742',
			styleDivider: 'rgb(255 255 255 / 12%)',
			bgArrowMenu: '#242742'
		},
		error: {
			main: '#ff0000',
			dark: '#ef0000',
			contrastText: 'rgba(255, 255, 255, 0.95)'
		},
		mint: {
			main: '#26c6da',
			contrastText: '#ffffff'
		},
		gray: {
			main: 'rgba(255, 255, 255, 0.7)'
		},
		table: {
			selectedTerminalTableRow: '#3a3d55',
			hoverSelectedTerminalTableRow: '#2c2f55',
		},
		button:{
			background: 'rgba(118, 114, 251, 0.18)',
			hover: 'rgba(118, 114, 251, 0.2)',
			menuItem: {
				color: '#ffffff',
				activeItem: '#52556a'
			},
				color: 'rgba(118, 114, 251, 1)',
				borderColor: '2px solid rgba(118, 114, 251, 1)',
				border: 'rgba(118, 114, 251, 1)',
				radius: '50%'
		},
		tableControl: {
			tableControlColor: '#242742',
			tableHeaderColor: '#242742',
		},
		breadCrumbs: {
			// iconColor: 'rgba(0, 0, 0, 0.47)',
			iconColor: '#ffffff',
			breadCrumbBackground: '#3a3d55',
		},
		iconColor: '#7672fb',
		activeLinkColor: "#7672fb",
		sidebarBackground: '#3a3d55',
		preloaderOverlayBackground: 'rgba(0,0,0,0.7)',
		buttonHover: '#52556a',
		tableControlPanelBG: '#242742'
	},
	typography: {
		useNextVariants: true,
		color: '#ffffff'
	},
	overrides: {
		// START DataPicker and Selects
		MuiOutlinedInput: {
			input: {
				padding: '16px 10px 17px',
				// width: '100px'
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
				}
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
				borderBottom: '1px solid #1c1c2f',
				padding: '10px',
			}
		},
		MuiTableRow: {
			root: {
				'&:hover': {
					// background: 'rgba(118, 114, 251, 0.1) !important'
				}
			}
		},
		MuiSvgIcon: {
			colorPrimary: {
				color: 'rgba(118, 114, 251, 1)'
			}
		},
		MuiCssBaseline: {
			'@global *': {
				body: {
					backgroundColor: '#303030',
					color: '#ffffff!important' 
				},
			},
		},
		MuiLinearProgress: {
			root: {
				backgroundColor: 'rgba(118, 114, 251, 1) !important'
			}
		},
		MuiCircularProgress: {
			colorPrimary: {
				color: 'rgba(118, 114, 251, 1)'
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
					'border-bottom-color': '#29b6f6'
				},
				backgroundColor: 'rgba(255,255,255, 0)'
			}
		},
		MuiFormLabel: {
			root: {
				color: '#ffffff',

				// Fix for old brovsers
				paddingLeft: '5px',
				paddingRight: '5px',
				backgroundColor: '#242742',
				transform: 'translate(12px, -6px) scale(0.75)',

			  "&$focused": {
				color: '#ffffff',
			  }
			},
			colorSecondary: {
				"&$focused": {
					color: '#ffffff',
				}
			}
		},
		// START Time Picker styles
		// MuiPickersClockPointer: {
		// 	pointer:{
		// 		backgroundColor: '#6662D9'
		// 	},
		// 	noPoint: {
		// 		backgroundColor: '#6662D9'
		// 	},
		// 	thumb: {
		// 		borderColor: '#6662D9'
		// 	}
		// },
		// MuiPickersClock: {
		// 	pin: {
		// 		backgroundColor: '#6662D9'
		// 	}
		// },
		// //END Time Picker styles
		// MuiPickersDay: {
		// 	current: {
		// 		color: '#ffffff',
		// 		backgroundColor: '#6662D9'
		// 	}
		// }
		// MuiTablePagination: {
		// 	actions: {
		// 		color: 'red'
		// 	}
		// }
		// MuiPickersModal: {
		// 	dialogRoot: {
		// 		'& .MuiButton-label': {
		// 			color: '#29b6f6'
		// 		},
		// 		'& .MuiPickersDay-isSelected': {
		// 			backgroundColor: '#29b6f6'
		// 		},
		// 		'& .MuiPickersDay-current':{
		// 			color: '#29b6f6'
		// 		},
		// 		'& .MuiPickersClockPointer-pointer':{
		// 			color: '#29b6f6'
		// 		},
		// 		'& .MuiPickersClock-pin':{
		// 			backgroundColor: '#29b6f6'
		// 		},
		// 		'& .MuiPickersClockPointer-pointer': {
		// 			backgroundColor: '#29b6f6'
		// 		},
		// 		'& .MuiPickersClockPointer-thumb': {
		// 			border:' 14px solid #29b6f6',
		// 			backgroundColor: '#29b6f6'
		// 		}
		// 	}
		// }
	}
}

export default dark;