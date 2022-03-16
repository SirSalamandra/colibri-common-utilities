const Converters = {
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
export default Converters;
//# sourceMappingURL=converters.js.map