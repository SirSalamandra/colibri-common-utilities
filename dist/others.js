const Others = {
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
        [...Others.reverseString(value)].forEach((element, index) => {
            if (char == element) {
                lastElement = index;
            }
        });
        return lastElement;
    }
};
export default Others;
//# sourceMappingURL=others.js.map