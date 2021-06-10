import React from 'react';
import { KeyboardTimePicker } from '@material-ui/pickers';
import { withFormsy } from 'formsy-react';
import _ from '@lodash';

function TimePickerFormsy(props) {
	const importedProps = _.pick(props, [
		'autoComplete',
		'autoFocus',
		'children',
		'className',
		'defaultValue',
		'disabled',
		'FormHelperTextProps',
		'fullWidth',
		'id',
		'InputLabelProps',
		'inputProps',
		'InputProps',
		'inputRef',
		'label',
		'multiline',
		'name',
		'onBlur',
		'onChange',
		'onFocus',
		'placeholder',
		'required',
		'rows',
		'rowsMax',
		'select',
		'type',
		'variant',
		'inputVariant',
		'format',
		'minDate',
		'clearable',
	]);

	const { errorMessage } = props;

	function changeValue(value) {
		props.setValue(value);
		if (props.onChange) {
			props.onChange(value);
		}
	}

	return (
		<KeyboardTimePicker
			{...importedProps}
			value={props.value}
			onChange={changeValue}
			error={Boolean((!props.isPristine && props.showRequired) || errorMessage)}
			helperText={errorMessage}
		/>
	);
}

export default React.memo(withFormsy(TimePickerFormsy));
