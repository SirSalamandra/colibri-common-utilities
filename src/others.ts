const Others = {

    addDependencies: (libPath: string, scriptId: string) => {
        if (libPath && scriptId) {
            const nirvanaScript = window.document.getElementById(scriptId);
            if (nirvanaScript != null) return;
      
            const document = window.document;
            const head = document.getElementsByTagName('head')[0];
      
            const script = document.createElement('script');
            script.id = scriptId;
            script.type = 'text/javascript';
            script.src = libPath;
      
            head.appendChild(script);
        }
        else console.log('addDependencies: libPath or scriptId is null');
    },

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