export let converters = {
    getNumbers(text) {
        if (!text)
            return "";
        return text.replace(/\D+/g, '');
    }
};
//# sourceMappingURL=converters.js.map