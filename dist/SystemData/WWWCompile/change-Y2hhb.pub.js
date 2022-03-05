function sendMessageServer(...args){return connector("sendMessageServer", args)}
    const $ = x => document.querySelector(x);

    async function sendMessage(){
        alert(await sendMessageServer($('#userId').value, $('#message').value))
    }

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9XV1cvY29uZC5wYWdlLnNvdXJjZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUE2Q0E7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY2hhbmdlLnBhZ2UifQ==