import React from 'react';
import style from './index.module.css';
import classNames from 'classnames';
import Done from '@material-ui/icons/Done';
import Clear from '@material-ui/icons/Clear';
import Default from '@material-ui/icons/Block';
import WorkedButError from '@material-ui/icons/ReportProblem';
import PowerOff from '@material-ui/icons/PowerOff';
import PowerOn from '@material-ui/icons/Power';

import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import CloseIcon from '@material-ui/icons/Close';

export default function StatusLabel({ status, message = '', className }) {
	return (
		<React.Fragment>
			{ status === 'done' && <Done className={classNames(style.ok, className)} /> }
			{ status === 'error' && <Clear className={classNames(style.error, className)} /> }
			{ status === 'unknown' && <CloseIcon className={classNames(style.error, className)} /> }
			{ status === 'danger' && <WorkedButError className={classNames(style.danger, className)} /> }
			{ status === 'connectOn' && <Done className={classNames(style.ok, className)} /> }
			{ status === 'connectOff' && <CloseIcon className={classNames(style.error, className)} /> }
			{ status === 'off' && <PowerSettingsNewIcon className={classNames(style.error, className)} /> }
			{ status === 'on' && <PowerSettingsNewIcon className={classNames(style.ok, className)} /> }
		</React.Fragment>
	);
}

// Error , good, no exist ,
