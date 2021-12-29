export let validations = {
    isNumeric(value) {
        return /^\d+$/.test(value);
    },
    isLetter(value) {
        return /[A-Z]|[a-z]+/.test(value);
    },
    isValidEmail(email) {
        const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(email);
    },
};
//# sourceMappingURL=validations.js.map