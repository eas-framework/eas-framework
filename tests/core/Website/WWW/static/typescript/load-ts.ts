type CoolArray = {
    char: string,
    random: number
}[]

function coolPrint(text: string){
    const arr: CoolArray = []
    for(const i of text){
        arr.push({
            char: i,
            random: Number(Math.random().toFixed(5))
        })
    }

    return arr
}

const build = coolPrint(prompt('Enter text'));
console.log(build);

debugger
alert(JSON.stringify(build));