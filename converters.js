export let converters = {
    decimalNumberFormattedToNumber(value) {
        if (value === undefined || value == "0")
            return 0;
        return Number(value.toString().replaceAll(".", "").replaceAll(",", "."));
    },
    getNumbers(text) {
        if (!text)
            return "";
        return text.replace(/\D+/g, '');
    },
};
//# sourceMappingURL=converters.js.map