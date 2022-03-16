const Validations = {

	isNumeric(value: string): boolean {
		return /^\d+$/.test(value);
	},

	isLetter(value: string): boolean {
		return /[A-Z]|[a-z]+/.test(value);
	},

	isValidEmail(email: string): boolean {
		const regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return regex.test(email);
	},
}

export default Validations;