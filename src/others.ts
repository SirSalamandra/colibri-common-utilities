import { validations } from './validations';

function updateList(list: Array<any>): Array<any> {
    return [...list];
}
function reverseString(value: string): string {
    return [...value].reverse().join('');
}

export let others = {
    updateList: function (list: Array<any>): Array<any> {
        return updateList(list);
    },
    updateObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    getLastNumberIndex(value: string): number {
        let lastElement = 0;
        [...reverseString(value)].forEach((element, index) => {
            if (validations.isNumeric(element)) {
                lastElement = index;
            }
        });
        return lastElement;
    },
    getLastCharacterIndex(value: string, char: string): number {
        let lastElement = 0;
        [...reverseString(value)].forEach((element, index) => {
            if (char == element) {
                lastElement = index;
            }
        });
        return lastElement;
    }
}