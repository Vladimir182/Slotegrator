import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
const FieldCheckBox = ({ input, label, ...other }) => {
	return (
		<FormControlLabel
			control={
				<Checkbox
					{...input}
					checked={input.value ? true : false}
					onCheck={input.onChange}
					{...other}
				/>
			}
			label={label}
		/>
	);
};
export default FieldCheckBox;
