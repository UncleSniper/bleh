const except = require('node-exceptions');

class MethodNotImplementedException extends except.LogicalException {

	constructor(baseObject, methodName) {
		super('Method ' + baseObject.constructor.name + '.' + methodName + ' is not implemented');
		this.baseObject = baseObject;
		this.methodName = methodName;
	}

}

module.exports = MethodNotImplementedException;
