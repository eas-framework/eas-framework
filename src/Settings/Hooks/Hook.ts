/**
 * It takes a target object and a key, and then makes the property with that key read-only
 * @param {any} target - The object that the property belongs to.
 * @param {string} key - The name of the property being decorated.
 */

export function readOnly(target: any, key: string) {
    const value = target[key];

    Object.defineProperty(target, key, {
        get: () => value,
    });
}

/**
 * It takes an object and an array of keys, and makes each of those keys read-only
 * @param {any} target - The object that contains the property.
 * @param {string[]} keys - string[] - The array of keys to make read-only.
 */
export function readOnlyArray(target: any, keys: string[]) {
    keys.forEach(key => readOnly(target, key));
}

/**
 * It takes a target object, a key, and a method, and it hooks the setter of the target object's key to
 * the method
 * @param {any} target - The object that you want to hook into.
 * @param {string} key - The name of the property you want to hook.
 * @param {Function} method - The function that will be called when the property is set.
 */
const hookSetterObservers: {obj: any, key: string, funcs: any[]}[] = []
export function hookSet(target: any, key: string, method: Function) {
    const findObserver = hookSetterObservers.find(i => i.obj === target && i.key === key)

    if(findObserver){
        findObserver.funcs.push(method)
        return
    }

    const funcs = [method]
    hookSetterObservers.push({obj: target, key, funcs})
    
    let currentValue = target[key];
    Object.defineProperty(target, key, {
        get: () => currentValue,
        set(value){
            if(value != currentValue){
                currentValue = value
                funcs.forEach(i => i(value))
            }
        }
    });
}

/**
 * It hooks the setter of a property on an object, and calls a method when the property is set
 * @param {any} target - The object to hook.
 * @param {string[]} keys - The keys to hook.
 * @param {Function} method - The method to be called when the property is set.
 */
export function hookSetArray(target: any, keys: string[], method: Function) {
    keys.forEach(key => hookSet(target, key, method));
}

/**
 * It returns a function that sets the value of the property
 * @param {any} target - any - The object that the property is being defined on.
 * @param {string} key - The name of the property being defined or modified.
 * @returns A function that sets the value of the property.
 */
export function onlyISet(target: any, key: string) {
    let value = target[key];

    Object.defineProperty(target, key, {
        get: () => value
    })

    return (data: any) => value = data
}