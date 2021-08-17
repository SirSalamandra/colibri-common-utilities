export let converters = {
  getNumbers(text: string) {
    if (!text) return "";
    return text.replace(/\D+/g, '');
  },
  updateObject(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}