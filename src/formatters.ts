import { converters } from './converters';
import { others } from './others';
import { validations } from './validations';





export let formatters = {   
	removeMask(value: string): string {
		if(!value) {
			return value;
		}
		let chars = [".", ",", "-", "/", "\\","(",")", " "];
		chars.forEach((element) => {
			value = value.replaceAll(element,"");
		});
		return value;
	},
	removeNonNumbers(value: string): string {
		if(!value)
			return "";
		return value.replace(/\D+/g, '');
	},
	formatDatetime(dateTime: string): string {
		let value = dateTime.toString().split("T");
		return formatters.beaultyDate(value[0]) + " " + formatters.beaultyTime(value[1]);
	},
    beaultyDate(date: string): string {
        let value = date.split("-");
        return value[2] + "/" + value[1] + "/" + value[0];
    },
    beaultyTime(time: string): string {
        let value = time.split(":");
        return value[0] + ":" + value[1] + ":" + converters.getNumbers(value[2]);
    }, 

	//rever
	convertNumber(value: string): number
	{
		if(value === undefined || value == "0")
			return 0;
		return Number(value.toString().replaceAll(".","").replaceAll(",", "."));
	},
	formatDecimalNumber(value: number): string {
		return value.toLocaleString("pt-br", {minimumFractionDigits: 2, maximumFractionDigits: 2 });
	},

	cpfCnpjMask(value: string): string {
        let valueNumber = converters.getNumbers(value);
		if(valueNumber.length > 11) { 
            return formatters.cnpjMask(value);
		}
		else {
            return formatters.cpfMask(value);
		}
	},
    cnpjMask(value: string): string {
        let valueNumber = converters.getNumbers(value);
        let valueMasked = "";
        let part = [];
        part.push(valueNumber.substring(0,2));
        part.push(valueNumber.substring(2,5));
        part.push(valueNumber.substring(5,8));
        part.push(valueNumber.substring(8,12));
        part.push(valueNumber.substring(12,14));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "/" + part[3] + "-" + part[4];
        valueMasked = valueMasked.slice(0, others.getLastNumberIndex(valueMasked)+1);
        if(valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
            return "";
        }
        return valueMasked;
    },
    cpfMask(value: string): string {
        let valueNumber = converters.getNumbers(value);
        let valueMasked = "";
        let part = [];
        part.push(valueNumber.substring(0,3));
        part.push(valueNumber.substring(3,6));
        part.push(valueNumber.substring(6,9));
        part.push(valueNumber.substring(9));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "-" + part[3];
        if(valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
            return "";
        }
        return valueMasked;
    },
    chassiMask(value) {
        if(!value)
            return value;
        value = value.replaceAll(" ","");
        let parts = [];
        parts.push(value.substring(0,1).toUpperCase());
        parts.push(value.substring(1,3).toUpperCase());
        parts.push(value.substring(3,9).toUpperCase());
        parts.push(value.substring(9,10).toUpperCase());
        parts.push(value.substring(10,17).toUpperCase());
        return parts.filter(p => p != null && p != undefined && p.length > 0).join(" ");
    },
}


export function getIERGMask(text) {
    let allowerLetters = ["x", "X"];
    let currentValue = text;
    let valueNumber = currentValue.replace(/[^0-9xX]/g, '');
    let valueMasked = "";
    let part = [];
    if(valueNumber.length > 9)
    {
        part.push(valueNumber.substring(0,3));
        part.push(valueNumber.substring(3,6));
        part.push(valueNumber.substring(6,9));
        part.push(valueNumber.substring(9,12));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "." + part[3];
    }
    else
    {
        part.push(valueNumber.substring(0,2));
        part.push(valueNumber.substring(2,5));
        part.push(valueNumber.substring(5,8));
        part.push(valueNumber.substring(8,9));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "-" + part[3];
    }
    valueMasked = valueMasked.slice(0, getLatestNumberIERG(valueMasked)+1);
    if(valueMasked.length == 1 && !validations.isNumeric(valueMasked) && !allowerLetters.includes(valueMasked)) {
        return "";
    } 
    return valueMasked;
}
function getLatestNumberIERG(txt){
    let allowerLetters = ["x", "X"];
    let lastElement = 0;
    [...txt].forEach((element, index) => {
        if(validations.isNumeric(element) || allowerLetters.includes(element)) {
            lastElement = index;
        }
    }); 
    return lastElement;
}


export function getTelefoneMask(text) {
    let valueNumber = converters.getNumbers(text);
    let valueMasked = "";
    let part = [];
    let diferenca = 6 + (valueNumber.length >= 11 ? 1 : 0);
    part.push(valueNumber.substring(0,2));
    part.push(valueNumber.substring(2, diferenca));
    part.push(valueNumber.substring(diferenca));
    valueMasked = "(" + part[0] + ")" + part[1] + "-" + part[2];
    valueMasked = valueMasked.slice(0, others.getLastNumberIndex(valueMasked)+1);
    if(valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
        return "";
    } 
    return valueMasked;
}

export function getCepMask(text) {
    let valueNumber = converters.getNumbers(text);
    let valueMasked = "";
    let part = [];
    part.push(valueNumber.substring(0,5));
    part.push(valueNumber.substring(5,8));
    valueMasked = part[0] + "-" + part[1];
    valueMasked = valueMasked.slice(0,others.getLastNumberIndex(valueMasked)+1);
    if(valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
        return "";
    } 
    return valueMasked;
}
export function getPlacaMask(text) {
    if(!text)
        return text;
    text = formatters.removeMask(text);
    let letters = text.substring(0,3);
    let firstDigit = text.substring(3,4);
    let secondDigit = text.substring(4,5);
    let remainDigits = text.substring(5,7);
    if(!validations.isLetter(letters[0])) {
        return text.substring(0,0).toUpperCase();
    }
    if(!validations.isLetter(letters[1])) {
        return text.substring(0,1).toUpperCase();
    }
    if(!validations.isLetter(letters[2])) {
        return text.substring(0,2).toUpperCase();
    }
    if(!validations.isNumeric(firstDigit)) {
        return letters.toUpperCase();
    }
    if(!validations.isLetter(secondDigit) && !validations.isNumeric(secondDigit)) {
        return (letters + "-" + firstDigit).toUpperCase();
    }
    
    if(!validations.isNumeric(remainDigits[0])) {
        return (letters + "-" + firstDigit + secondDigit).toUpperCase();
    } else if(!validations.isNumeric(remainDigits[1])) {
        return (letters + "-" + firstDigit + secondDigit + remainDigits[0].toString()).toUpperCase();
    } else {
        return (letters + "-" + firstDigit + secondDigit + remainDigits).toUpperCase();
    }
}

export function getLicensePlateMask(plate) {
	if(!plate)
  	    return "";
    plate = plate.replace("-","");
    plate = plate.replace(/[^a-zA-Z0-9]+$/,'');
    
    let part = [];
    part.push(plate.substring(0,3));
    if(part[0].length >= 3) {
        part.push("-");
    }
    part.push(plate.substring(3,7));
    return part.join('');
}

export function getChassiMask(text) {
    if(!text)
        return text;
    text = text.replaceAll(" ","");
    let part = [];
    part.push(text.substring(0,1).toUpperCase());
    part.push(text.substring(1,3).toUpperCase());
    part.push(text.substring(3,9).toUpperCase());
    part.push(text.substring(9,10).toUpperCase());
    part.push(text.substring(10,17).toUpperCase());
    return part.filter(p => p != null && p != undefined && p.length > 0).join(" ");
}