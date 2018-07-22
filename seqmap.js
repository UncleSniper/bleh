class Node {

	constructor(map, parent, key, value, name) {
		this.map = map;
		this.parent = parent;
		this.key = key;
		this.value = value;
		this.name = name;
		this.children = Object.create(null);
	}

	get keys() {
		return Object.keys(this.children);
	}

	getChild(key) {
		const child = this.children[key];
		return child ? child : null;
	}

	get size() {
		return Object.keys(this.children).length;
	}

	get isLeaf() {
		return Object.keys(this.children).length == 0;
	}

	remove() {
		if(this.value === null || this.value === undefined)
			return;
		this.value = null;
		--this.map.size;
		var collapse = this;
		for(;;) {
			if(!collapse.isLeaf || collapse.value === null || collapse.value === undefined
					|| collapse.parent === null)
				break;
			delete collapse.parent.children[collapse.key];
			collapse = collapse.parent;
		}
	}

	get keyPath() {
		const keys = [];
		var node = this;
		do {
			keys.unshift(node.key);
			node = node.parent;
		} while(node !== null);
		return keys;
	}

}

class SequenceMap {

	constructor() {
		this.root = new Node(this, null, null, null, null);
		this.size = 0;
	}

	put(keys, value) {
		var prev = this.root, i, key, next;
		for(i = 0; i < keys.length; ++i) {
			key = keys[i];
			next = prev.getChild(key);
			if(next === null) {
				if(value === null || value === undefined)
					return null;
				next = new Node(this, prev, key, null, null);
				prev.children[key] = next;
			}
			prev = next;
		}
		if(value === null || value === undefined)
			prev.remove();
		else {
			if(prev.value === null || prev.value === undefined)
				++this.size;
			prev.value = value;
		}
		return prev;
	}

	remove(keys) {
		return this.put(keys, null);
	}

	get(keys) {
		var node = this.root, i, key;
		for(i = 0; i < keys.length; ++i) {
			key = keys[i];
			node = node.getChild(key);
			if(node === null)
				break;
		}
		return node;
	}

	clear() {
		this.root.value = root.name = null;
		this.root.children = Object.create(null);
		this.size = 0;
	}

}

SequenceMap.Node = Node;

module.exports = SequenceMap;
