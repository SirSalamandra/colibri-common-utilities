export let others = {
    duplicateList: function (list) {
        return [...list];
    },
    duplicateObject(obj) {
        return JSON.parse(JSON.stringify(obj));
    },
    reverseString(value) {
        return [...value].reverse().join('');
    },
    getLastCharacterIndex(value, char) {
        let lastElement = 0;
        [...others.reverseString(value)].forEach((element, index) => {
            if (char == element) {
                lastElement = index;
            }
        });
        return lastElement;
    }
};
//# sourceMappingURL=others.js.map