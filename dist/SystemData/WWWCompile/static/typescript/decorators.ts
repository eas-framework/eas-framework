function _applyDecoratedDescriptor(target,property,decorators,descriptor,context){var desc={};Object.keys(descriptor).forEach(function(key){desc[key]=descriptor[key]});desc.enumerable=!!desc.enumerable;desc.configurable=!!desc.configurable;if("value"in desc||desc.initializer){desc.writable=true}desc=decorators.slice().reverse().reduce(function(desc,decorator){return decorator?decorator(target,property,desc)||desc:desc},desc);var hasAccessor=Object.prototype.hasOwnProperty.call(desc,"get")||Object.prototype.hasOwnProperty.call(desc,"set");if(context&&desc.initializer!==void 0&&!hasAccessor){desc.value=desc.initializer?desc.initializer.call(context):void 0;desc.initializer=undefined}if(hasAccessor){delete desc.writable;delete desc.initializer;delete desc.value}if(desc.initializer===void 0){Object.defineProperty(target,property,desc);desc=null}return desc}var _class,_dec,_dec1,_dec2,_dec3;import"reflect-metadata";class Point{constructor(x,y){this.x=x;this.y=y}}let Line=((_class=class Line{set start(value){this._start=value}get start(){return this._start}set end(value){this._end=value}get end(){return this._end}})||_class,_dec=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:type",Function),_dec1=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:paramtypes",[typeof Point==="undefined"?Object:Point]),_applyDecoratedDescriptor(_class.prototype,"start",[validate,_dec,_dec1],Object.getOwnPropertyDescriptor(_class.prototype,"start"),_class.prototype),_dec2=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:type",Function),_dec3=typeof Reflect!=="undefined"&& typeof Reflect.metadata==="function"&&Reflect.metadata("design:paramtypes",[typeof Point==="undefined"?Object:Point]),_applyDecoratedDescriptor(_class.prototype,"end",[validate,_dec2,_dec3],Object.getOwnPropertyDescriptor(_class.prototype,"end"),_class.prototype),_class);function validate(target,propertyKey,descriptor){let set=descriptor.set;descriptor.set=function(value){let type=Reflect.getMetadata("design:type",target,propertyKey);if(!(value instanceof type)){throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`)}set.call(this,value)}}const line=new Line;line.start=new Point(0,0)