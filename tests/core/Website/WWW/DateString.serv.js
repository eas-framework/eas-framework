import thisPackage from '../../../../package.json'
export default () => console.log(thisPackage) || new Date().toLocaleTimeString() + 'poop';