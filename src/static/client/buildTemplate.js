class buildTemplate {

    constructor(script){
        this.script = script;
        this.setResponse = this.setResponse.bind(this);
        this.write = this.write.bind(this);
        this.safeWrite = this.safeWrite.bind(this);
        this.sendToSelector = this.sendToSelector.bind(this);
    }

    static ToStringInfo(str) {
        if (typeof str == 'object') {
            return JSON.stringify(str);
        } else {
            return String(str);
        }
    }

    setResponse(text) {
        this.script.text = buildTemplate.ToStringInfo(text);
    }

    write(text = '') {
        this.script.text += buildTemplate.ToStringInfo(text);
    };

    safeWrite(str = '') {
        str = buildTemplate.ToStringInfo(str);

        for (const i of str) {
            this.script.text += '&#' + i.charCodeAt(0) + ';';
        }
    }

    sendToSelector(selector){
        const div = document.createElement('div');
        div.innerHTML = this.script.text;

        if(selector){
            document.querySelector(selector).append(...div.children);
        }

        return div.children;
    }
}
