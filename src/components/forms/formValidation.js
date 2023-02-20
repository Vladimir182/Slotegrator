export const validationRegs = {
    default: {
      reg: new RegExp("^[a-zA-Z0-9_.-]*$"),
      message: "Latin letters and numbers only."
    },
    lettersOnly: {
      reg: new RegExp("^[a-zA-Z]*$"),
      message: "Only letters only (latin only)."
    },
    encashmentLettersOnly: {
      reg: new RegExp("^[a-zA-Z0-9\-\'\`\_]*$"),
      message: "Only letters only (latin only)."
    },
    usersNumbersLettersOnly: {
      reg: new RegExp("^[^0-9!@#$%^&*()~`?><\\\/\|]{1}[a-zA-Z0-9\_\-]*$"),
      message: "Latin letters and numbers only, '_', '-' "
    },
    title: {
      reg: new RegExp("^[a-zA-Z0-9_ #]*$"),
      message: "Latin letters, numbers, space _ #"
    },
    numbersOnly: {
      reg: new RegExp("^[0-9]*$"),
      message: "Numbers only."
    },
    url: {
      reg: new RegExp("^(http|ftp|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?"),
      message: "Invalid URL"
    },
    password: {
      reg: new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d~!@#$%^&*_ ]{0,}$"),
      message: "Must contain numbers and symbols, upper and lower case. Latin only."
    },
    timezone: {
      reg: new RegExp("^[a-zA-Z_]*/[a-zA-Z_]*$"),
      message: "Error format. Right format is like 'Europe/Kiev'"
    },
    bool: {
      reg: new RegExp("^false$|^true$"),
      message: "Boolean only"
    },
    all: {
      reg: new RegExp(".*"),
      message: "How did you do it???"
    },
    // version: {
    //   reg: new RegExp("^[0-9]{1,4}\\.[0-9]{1,4}\\.[0-9]{1,4}\\.[0-9]{1,4}$"),
    //   message: "It should look something like this. 2.1.2.0 or like 2.12.2.1200"
    // },
    version: {
      reg: new RegExp("^[0-9]{1,4}\d*(\\.[0-9]{1,4}\d*){0,3}$"),
      message: "It should look something like this. 2.1 or like 2.12.2.1200"
    },
    updateType: {
      reg: new RegExp("^startup$|^encashment$|^hot_fix$"),
      message: "Must be one of these: startup, encashment, hot_fix,"
    },
    roleName: {
      reg: new RegExp("^[a-zA-Z][0-9a-zA-Z_ -]+$"),
      message: "Role name have to contain first symbol - capital or normal letter, others symbols can be numbers, symbols, spaces, \"_\", \"-\""
    }
};

export const required = value => value == null || value == undefined ? 'Required': undefined;

export const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
    
export const minLength = min => value =>
  value && value.length < min ? `Must be at least ${min} characters` : undefined;

export const maxValue = max => value =>
value && Number(value) > Number(max) ? `Max value ${max}` : undefined;  

export const minValue = min => value =>
value && Number(value) < Number(min) ? `Min value ${min}` : undefined;  
  
export const regExpTest = (regDataObj) => value =>
  value && !regDataObj.reg.test(value) ?
  regDataObj.message : undefined;