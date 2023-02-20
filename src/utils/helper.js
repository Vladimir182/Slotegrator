import _ from 'lodash';

export const normalizeAll = normalizers => {
	return function(value, previousValue, allValues, previousAllValues) {
		//note that these arguments are passed by default from redux form
		var i = 0;
		var normalizersLength = normalizers.length;
		var currentValue = value;
		while (i < normalizersLength) {
			var currentNormalizer = normalizers[i];
			if (typeof currentNormalizer == 'function') {
				currentValue = currentNormalizer(
					currentValue,
					previousValue,
					allValues,
					previousAllValues
				);
			}
			i++;
		}

		return currentValue;
	};
};

export const rRender = (resources, code, access) => {
	let item = _.find(resources, { resource_code: code });
	return item && item[access];
};

export const positiveNumber = (value, previousValue) => {
	if (!value) {
		// return previousValue ? previousValue : 1;
		return null;
	}

	let reg = /^-?\d*\.?\d*$/;
	if (reg.test(value)) {
		let num = Number.parseInt(value);
		if (num > 0) return num;
		else return previousValue ? previousValue : 0;
	} else return previousValue ? previousValue : 0;
};
export const ToInt = value => Math.floor(value);
export const statusTerminal = (
	{ is_no_error = false, is_exist = false, is_on = false, stageData },
	stage = 0
) => {
	try {
		if (stage === 0) {
			if (is_no_error) {
				if (is_exist) {
					return is_on ? 'done' : 'off';
				} else {
					return 'unknown';
				}
			} else {
				return is_on ? 'danger' : 'error';
			}
		} else if (stage === 1) {
			return stageData ? 'on' : 'off';
		} else if (stage === 2) {
			return stageData ? 'done' : 'unknown';
		}	else if (stage === 3) {
			return stageData ? 'connectOn': 'connectOff'
		} else if (stage === 4) {
			if (stageData.is_no_error || stageData.is_exist === false) { 
				return stageData.is_on ? 'done' : 'error';
			} else {
				return 'error';
			}
		}
	} catch (e) {
	}
};

export const TIME_APPLY_SETTINGS = 15000;

export const sideBarState = state => {
	if (state === undefined) {
		const val = localStorage.getItem('sidebar_state');
		return val === 'true';
	} else localStorage.setItem('sidebar_state', state);
};

export function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function decimalAdjust(type, value, exp) {
    // Если степень не определена, либо равна нулю...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // Если значение не является числом, либо степень не является целым числом...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Сдвиг разрядов
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Обратный сдвиг
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
}

// Десятичное округление к ближайшему

export const round10 = function(value, exp) {
	return decimalAdjust('round', value, exp);
};

// Десятичное округление вниз

export const floor10 = function(value, exp) {
	return decimalAdjust('floor', value, exp);
};

// Десятичное округление вверх

export const ceil10 = function(value, exp) {
	return decimalAdjust('ceil', value, exp);
};
