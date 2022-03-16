const Others = {

  duplicateList: function (list: Array<any>): Array<any> {
      return [...list];
  },

  duplicateObject(obj: any): any {
      return JSON.parse(JSON.stringify(obj));
  },

  reverseString(value: string): string {
      return [...value].reverse().join('');
  },
  
  getLastCharacterIndex(value: string, char: string): number {
      let lastElement: number = 0;
      [...Others.reverseString(value)].forEach((element, index) => {
          if (char == element) {
              lastElement = index;
          }
      });
      return lastElement;
  }
}

export default Others;