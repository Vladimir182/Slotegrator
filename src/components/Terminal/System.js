import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { fetchSystemInfo } from '../../ducks/testing';
import { connect } from 'react-redux';
import ReactJson from 'react-json-view';
import ErrorTerminal from './ErrorTerminal';
import LinearProgress from '@material-ui/core/LinearProgress';
import SaveIcon from '@material-ui/icons/Save';
import Update from '@material-ui/icons/RestorePage';
import Tooltip from '@material-ui/core/Tooltip';
import { compose } from 'redux';

const styles = theme => {
	return {
		root: {
			// paddingTop: '10px',
			'& .MuiButton-textSecondary': {
				minWidth: '48px',
				height: '48px',
				marginLeft: '10px',
				border: theme.palette.button.borderColor,
				borderRadius: theme.palette.button.radius,
				'&:hover':{
					backgroundColor: theme.palette.button.hover,
			}
		}
		},
		loading: {
			height: '5px',
			width: '100%'
		},
		label: {
			textAlign: 'center',
			marginBottom: '20px'
		},
		bold: {
			fontWeight: '700',
			paddingLeft: '10px',
			marginRight: '10px'
		},
		card: {
			margin: '16px'
		},
		caption: {
			marginLeft: '15px'
		},
		toolBar: {
			display: 'flex',
			borderBottom: '1px solid rgba(0,0,0,0.1)!important',
			borderTop: '1px solid rgba(0,0,0,0.1)!important',
			padding: '5pt 10pt',
			marginBottom: '2vh',
		},
	};
};
class System extends Component {
	onWindowOpen = () => {
		const { systemInfo } = this.props;
		var wnd = window.open(``, 'systemInfo', '');

		wnd.document.write(systemInfo.lshw.body);
	};
	componentDidMount() {
		const toUpdate = this.demandToUpdate();
		
		if (toUpdate) {
			this.updateData();
		}
	}
	updateData() {
		const { selected, fetchSystemInfo } = this.props;
		
		if (selected.nodeType === 'terminal') {
			fetchSystemInfo(selected.terminal.id);
		}
	}
	demandToUpdate = () => {
		const { systemInfo } = this.props;
		const res = !Object.keys(systemInfo).length || !systemInfo.system_datetime ? true : false;
		
		return res;
	}
	render() {
		let { selected, systemInfo, classes, error, errorTerminals, loading, loadingTerminals, theme } = this.props;

		loading = loading || loadingTerminals;

		const isTerminalConnected = selected.terminal.is_connected;

		const jsonViewTheme = theme.palette.type === 'light' ? 'bright:inverted' : 'harmonic';
		
		let ReactJsonStyle =theme.palette.type === 'dark' ? {backgroundColor: '#242742'} : null;
		
		return (
			<div className={classes.root}>
				<div className={classes.loading}>
					{loading ? <LinearProgress /> : null}
				</div>
				<div className={classes.toolBar}>
					<Tooltip title="Update" aria-label="Update" onClick={this.updateData.bind(this)}>
						<Button color="secondary">
							<Update />
						</Button>
					</Tooltip>
					{ (isTerminalConnected === false && systemInfo.pdf) && 
						<Button 
							color="secondary"
							download="systeminfo.pdf"
							href={`data:application/pdf;base64,${
								systemInfo.pdf.body
							}`}
					>
						<SaveIcon />
					</Button>
					 } 
				</div>
				{ (isTerminalConnected === false || errorTerminals.isError) ? (
					<ErrorTerminal message={'Terminal is not connected'} />
				) : (
					<React.Fragment>
						<Typography
							className={classes.caption}
							variant="h3"
							component="h2"
							color="textSecondary"
							gutterBottom>
							{`Terminal ${selected.terminal.id}`}
						</Typography>
						<Card className={classes.card}>
							<CardContent>
								{/* {systemInfo.pdf && (
									<Button
										variant="contained"
										color="primary"
										component="a"
										download="systeminfo.pdf"
										href={`data:application/pdf;base64,${
											systemInfo.pdf.body
										}`}>
										<SaveIcon />
										Save
									</Button>
								)} */}
								{/* <a
									download="systeminfo.pdf"
									href={`data:application/pdf;base64,${systemInfo.pdf.body}`}>
									<SaveIcon />
									Save
								</a> */}
	
								<Typography variant="p" component="p">
									<pre>
										{'System date '}
										{systemInfo.system_datetime}
									</pre>
									<pre>
										{'System Timestamp '}
										{systemInfo.system_timestamp}
									</pre>
									<Button
										onClick={this.onWindowOpen}
										variant="contained"
										color="secondary">
										Command "lshw"
									</Button>
								</Typography>
							</CardContent>
						</Card>

						{systemInfo.dmidecode && (
							<Card className={classes.card}>
								<CardContent>
									<Typography variant="h4" component="h2">
										Dmidecode
									</Typography>
									<Typography variant="h5" component="p">
										{systemInfo.dmidecode.description}
									</Typography>
									<Typography variant="p" component="p">
										<pre>
											{
												systemInfo.dmidecode.body
													.baseboard
											}
										</pre>
										<pre>
											{systemInfo.dmidecode.body.bios}
										</pre>
										<pre>
											{systemInfo.dmidecode.body.memory}
										</pre>
										<pre>
											{
												systemInfo.dmidecode.body
													.processor
											}
										</pre>
									</Typography>
								</CardContent>
							</Card>
						)}
						{systemInfo.lsusb && (
							<Card className={classes.card}>
								<CardContent>
									<Typography variant="h4" component="h2">
										Lsusb
									</Typography>
									<Typography variant="h5" component="p">
										{systemInfo.lsusb.description}
									</Typography>
									<Typography variant="p" component="p">
										<pre>{systemInfo.lsusb.body}</pre>
									</Typography>
								</CardContent>
							</Card>
						)}
						{systemInfo.no_root_info && (
							<Card className={classes.card}>
								<CardContent>
									<Typography variant="h4" component="h2">
										No root info
									</Typography>
									<Typography variant="h5" component="p">
										{systemInfo.no_root_info.description}
									</Typography>
									<Typography variant="p" component="p">
										<pre>
											{
												systemInfo.no_root_info.body
													.baseboard
											}
										</pre>
										<pre>
											{systemInfo.no_root_info.body.bios}
										</pre>
										<pre>
											{
												systemInfo.no_root_info.body
													.memory
											}
										</pre>
										<pre>
											{
												systemInfo.no_root_info.body
													.processor
											}
										</pre>
									</Typography>
								</CardContent>
							</Card>
						)}
						{systemInfo.serial_port && (
							<Card className={classes.card}>
								<CardContent>
									<Typography variant="h4" component="h2">
										Serial port
									</Typography>
									<Typography variant="h5" component="p">
										{systemInfo.serial_port.description}
									</Typography>
									<Typography variant="p" component="p">
										<ReactJson
											style={ReactJsonStyle}
											theme={jsonViewTheme}
											enableClipboard={false}
											displayDataTypes={false}
											src={systemInfo.serial_port.body}
										/>
									</Typography>
								</CardContent>
							</Card>
						)}
						{systemInfo.xrandr && (
							<Card className={classes.card}>
								<CardContent>
									<Typography variant="h4" component="h2">
										Xrandr
									</Typography>
									<Typography variant="h5" component="p">
										{systemInfo.xrandr.description}
									</Typography>
									<Typography variant="p" component="p">
										<ReactJson
											style={ReactJsonStyle}
											theme={jsonViewTheme}
											enableClipboard={false}
											displayDataTypes={false}
											src={systemInfo.xrandr.body}
										/>
									</Typography>
								</CardContent>
							</Card>
						)}
						{systemInfo.screenshot && (
							<Card className={classes.card}>
								<CardContent>
									<Typography variant="h4" component="h2">
										Screenshot
									</Typography>
									<Typography variant="h5" component="p">
										{systemInfo.screenshot.description}
									</Typography>
									<Typography variant="p" component="p">
										<img
											alt="Screen"
											src={`data:image/png;base64, ${
												systemInfo.screenshot.body
											}`}
											title="Screenshot"
										/>
									</Typography>
								</CardContent>
							</Card>
						)}
					</React.Fragment>
				)}
			</div>
		);
	}
}
System.defaultProps = {
	systemInfo: {
		pdf: { body: '', description: '' },
		dmidecode: {
			body: {
				baseboard: '',
				bios: '',
				memory: '',
				processor: ''
			},
			description: ''
		},
		lshw: {
			body: '',
			description: ''
		},
		lsusb: {
			body: '',
			description: ''
		},
		no_root_info: {
			body: {
				baseboard: '',
				bios: '',
				memory: '',
				processor: ''
			},
			description: ''
		},
		screenshot: {
			body: '',
			description: ''
		},
		serial_port: {
			body: [
				{
					description: '',
					isNull: false,
					location: '',
					manufacturer: '',
					port: '',
					product_identifier: '',
					serial_number: '',
					vendor_identifier: ''
				}
			],
			description: ''
		},
		system_datetime: '',
		system_timestamp: 0,
		xrandr: {
			body: [
				{
					id: 0,
					info: '',
					model: ''
				}
			],
			description: ''
		}
	}
};
const mapStateToProps = state => ({
	systemInfo: state.testing.systemInfo.message,
	error: state.testing.errorSystemInfo,
	errorTerminals: state.widgets.terminals.error,
	loading: state.testing.loading,
	selected: state.selected,
	loadingTerminals: state.widgets.terminals.loading,
});
const mapDispatchToProps = {
	fetchSystemInfo,
};
System = withStyles(styles)(System);

export default compose(
	connect(mapStateToProps, mapDispatchToProps),
	withTheme,
	withStyles(styles),
)(System);
