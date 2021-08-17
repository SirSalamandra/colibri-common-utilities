import { converters } from './converters';
import { others } from './others';
import { validations } from './validations';

export let formatters = {

    removeMask(value: string): string {
        if (!value) {
            return value;
        }
        let chars: Array<string> = [".", ",", "-", "/", "\\", "(", ")", " "];
        chars.forEach((element: string) => {
            value = value.replaceAll(element, "");
        });
        return value;
    },

    formatDatetime(dateTime: string): string {
        let value = dateTime.toString().split("T");
        return formatters.formatDate(value[0]) + " " + formatters.formatTime(value[1]);
    },

    formatDate(date: string): string {
        let value: Array<string> = date.split("-");
        return value[2] + "/" + value[1] + "/" + value[0];
    },

    formatTime(time: string): string {
        let value: Array<string> = time.split(":");
        return value[0] + ":" + value[1] + ":" + converters.getNumbers(value[2]);
    },

    formatDecimalNumber(value: number): string {
        return value.toLocaleString("pt-br", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },

    cpfCnpjMask(value: string): string {
        let valueNumber: string = converters.getNumbers(value);
        if (valueNumber.length > 11) {
            return formatters.cnpjMask(value);
        }
        else {
            return formatters.cpfMask(value);
        }
    },

    cnpjMask(value: string): string {
        let valueNumber = converters.getNumbers(value);
        let valueMasked: string = "";
        let part: Array<string> = [];
        part.push(valueNumber.substring(0, 2));
        part.push(valueNumber.substring(2, 5));
        part.push(valueNumber.substring(5, 8));
        part.push(valueNumber.substring(8, 12));
        part.push(valueNumber.substring(12, 14));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "/" + part[3] + "-" + part[4];
        valueMasked = valueMasked.slice(0, getLastNumberIndex(valueMasked) + 1);
        if (valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
            return "";
        }
        return valueMasked;
    },

    cpfMask(value: string): string {
        let valueNumbers: string = converters.getNumbers(value);
        let valueMasked: string = "";
        let part: Array<string> = [];
        part.push(valueNumbers.substring(0, 3));
        part.push(valueNumbers.substring(3, 6));
        part.push(valueNumbers.substring(6, 9));
        part.push(valueNumbers.substring(9));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "-" + part[3];
        valueMasked = valueMasked.slice(0, getLastNumberIndex(valueMasked) + 1);
        if (valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
            return "";
        }
        return valueMasked;
    },

    chassiMask(value: string): string {
        if (!value)
            return value;
        value = value.replaceAll(" ", "");
        let parts: Array<string> = [];
        parts.push(value.substring(0, 1).toUpperCase());
        parts.push(value.substring(1, 3).toUpperCase());
        parts.push(value.substring(3, 9).toUpperCase());
        parts.push(value.substring(9, 10).toUpperCase());
        parts.push(value.substring(10, 17).toUpperCase());
        return parts.filter(p => p != null && p != undefined && p.length > 0).join(" ");
    },

    ieRgMask(value: string): string {
        let valueNumber = value.replace(/[^0-9xX]/g, '');
        if (valueNumber.length > 9) {
            return formatters.ieMask(value);
        }
        else {
            return formatters.rgMask(value);
        }
    },

    ieMask(value: string): string {
        let valueNumbers = value.replace(/[^0-9]/g, '');
        let valueMasked: string = "";
        let part: Array<string> = [];

        part.push(valueNumbers.substring(0, 3));
        part.push(valueNumbers.substring(3, 6));
        part.push(valueNumbers.substring(6, 9));
        part.push(valueNumbers.substring(9, 12));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "." + part[3];

        valueMasked = valueMasked.slice(0, getLatestNumberIERG(valueMasked) + 1);
        if (valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
            return "";
        }
        return valueMasked;
    },

    rgMask(value: string): string {
        let allowerLetters: Array<string> = ["x", "X"];
        let valueNumbers = value.replace(/[^0-9xX]/g, '');
        let valueMasked: string = "";
        let part: Array<string> = [];
        part.push(valueNumbers.substring(0, 2));
        part.push(valueNumbers.substring(2, 5));
        part.push(valueNumbers.substring(5, 8));
        part.push(valueNumbers.substring(8, 9));
        valueMasked = part[0] + "." + part[1] + "." + part[2] + "-" + part[3];
        valueMasked = valueMasked.slice(0, getLatestNumberIERG(valueMasked) + 1);
        if (valueMasked.length == 1 && !validations.isNumeric(valueMasked) && !allowerLetters.includes(valueMasked)) {
            return "";
        }
        return valueMasked;
    },

    phoneMask(value: string): string {
        let valueNumbers: string = converters.getNumbers(value);
        let valueMasked: string = "";
        let part: Array<string> = [];
        let indexToPutSeparator: number = 6 + (valueNumbers.length >= 11 ? 1 : 0);
        part.push(valueNumbers.substring(0, 2));
        part.push(valueNumbers.substring(2, indexToPutSeparator));
        part.push(valueNumbers.substring(indexToPutSeparator));
        valueMasked = "(" + part[0] + ")" + part[1] + "-" + part[2];
        valueMasked = valueMasked.slice(0, getLastNumberIndex(valueMasked) + 1);
        if (valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
            return "";
        }
        return valueMasked;
    },

    cepMask(value: string): string {
        let valueNumbers: string = converters.getNumbers(value);
        let valueMasked: string = "";
        let part: Array<string> = [];

        part.push(valueNumbers.substring(0, 5));
        part.push(valueNumbers.substring(5, 8));
        valueMasked = part[0] + "-" + part[1];
        valueMasked = valueMasked.slice(0, getLastNumberIndex(valueMasked) + 1);
        if (valueMasked.length == 1 && !validations.isNumeric(valueMasked)) {
            return "";
        }
        return valueMasked;
    },

    licensePlateMask(text: string): string {
        if (!text)
            return text;
        text = formatters.removeMask(text);
        let letters: string = text.substring(0, 3);
        let firstDigit: string = text.substring(3, 4);
        let secondDigit: string = text.substring(4, 5);
        let remainDigits: string = text.substring(5, 7);
        if (!validations.isLetter(letters[0])) {
            return text.substring(0, 0).toUpperCase();
        }
        if (!validations.isLetter(letters[1])) {
            return text.substring(0, 1).toUpperCase();
        }
        if (!validations.isLetter(letters[2])) {
            return text.substring(0, 2).toUpperCase();
        }
        if (!validations.isNumeric(firstDigit)) {
            return letters.toUpperCase();
        }
        if (!validations.isLetter(secondDigit) && !validations.isNumeric(secondDigit)) {
            return (letters + "-" + firstDigit).toUpperCase();
        }

        if (!validations.isNumeric(remainDigits[0])) {
            return (letters + "-" + firstDigit + secondDigit).toUpperCase();
        }
        else if (!validations.isNumeric(remainDigits[1])) {
            return (letters + "-" + firstDigit + secondDigit + remainDigits[0].toString()).toUpperCase();
        }
        else {
            return (letters + "-" + firstDigit + secondDigit + remainDigits).toUpperCase();
        }
    },
}

function getLatestNumberIERG(txt) {
    let allowerLetters = ["x", "X"];
    let lastElement: number = 0;
    [...txt].forEach((element, index) => {
        if (validations.isNumeric(element) || allowerLetters.includes(element)) {
            lastElement = index;
        }
    });
    return lastElement;
}

function getLastNumberIndex(value: string): number {
    let lastElement: number = 0;
    for (let i = value.length - 1; i >= 0; i--) {
        if (validations.isNumeric(value[i].toString())) {
            lastElement = i;
            break;
        }
    }
    return lastElement;
};