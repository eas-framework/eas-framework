import RequestWrapper from "./RequestWrapper.js";


function defaultFile(wrapper: RequestWrapper) {
    if (wrapper.path.nested.endsWith('/')) {
        wrapper.path.join('index');
    }
}

function hidePath(wrapper: RequestWrapper) {
    if (wrapper.path.nested.includes('.hide.')) {
        wrapper.makeNotFound();
    }
}

export default function URLHooks(wrapper: RequestWrapper) {
    defaultFile(wrapper);
    hidePath(wrapper);
}