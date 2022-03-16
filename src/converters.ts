const Converters = {

	decimalNumberFormattedToNumber(value: string): number {
		if(value === undefined || value == "0")
        	return 0;
    	return Number(value.toString().replaceAll(".","").replaceAll(",", "."));
	},
	
	getNumbers(text: string): string {
		if (!text)
			return "";
		return text.replace(/\D+/g, '');
	},
}

export default Converters;