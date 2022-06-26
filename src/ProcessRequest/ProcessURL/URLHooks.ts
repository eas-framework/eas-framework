import RequestWarper from "./RequestWarper"


function defaultFile(warper: RequestWarper){
    if(warper.path.nested.endsWith('/')){
        warper.path.join('index')
    }
}

function hidePath(warper: RequestWarper){
    if(warper.path.nested.includes('.hide.')){
        warper.makeNotFound()
    }
}

export default function URLHooks(warper: RequestWarper){
    defaultFile(warper)
    hidePath(warper)
}