import React from 'react';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import { ColorPicker } from 'material-ui-color';
import { addValidationRule, withFormsy } from 'formsy-react';
import { validateHTMLColorHex, validateHTMLColorName } from 'validate-color';
import _ from '@lodash';

addValidationRule('isColor', (_values, value) => {
	return (
		!value
		|| validateHTMLColorHex(value)
		|| validateHTMLColorName(value)
	);
});

function ColorPickerFormsy(props) {
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
		'SelectProps',
		'type',
		'variant',
		'color'
	]);

	const colorPickerProps = props.ColorPickerProps || {};

	const { errorMessage } = props;
	const value = props.value || '';

	function changeValue(event) {
		props.setValue(event.target.value);
		if (props.onChange) {
			props.onChange(event);
		}
	}

	// Wrap the value so that it can be treated the same as events from the text
	// field
	function changeValueWrap(value) {
		changeValue({ target: { value: `#${value.hex}` } });
	}

	return (
		<TextField
			{...importedProps}
			onChange={changeValue}
			value={value}
			error={Boolean((!props.isPristine && props.showRequired) || errorMessage)}
			helperText={errorMessage}
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<ColorPicker
							{...colorPickerProps}
							disableTextfield
							hideTextfield
							value={value}
							onChange={changeValueWrap}
						/>
					</InputAdornment>
				),
			}}
		/>
	);
}

const WrappedColorPickerFormsy = withFormsy(ColorPickerFormsy);
WrappedColorPickerFormsy.defaultProps = {
	...WrappedColorPickerFormsy.defaultProps,
	validations: 'isColor',
};

export default React.memo(WrappedColorPickerFormsy);
