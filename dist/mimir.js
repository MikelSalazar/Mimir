/** The main class of the Mimir framework. */
export class Mimir {

	/** Initializes a new instance of the Mimir class.
	 * @param data The initialization data (or a path to the JSON file). */
	constructor(data) {

		// Create the main element
		this.mainElement = createDomElement("main", "Mimir", null,"Mimir");
		
		// Create the header
		this.headerElement = createDomElement("header", "MimirHeader", 
			this.mainElement, "MimirHeader", null);
		this.titleElement = createDomElement("div", "MimirTitle", 
			this.headerElement, "MimirTitle", null, "Mimir");
		this.menuButton = createDomElement("a", "MimirMenuButton", 
			this.headerElement, "MimirButton");
		this.userButton = createDomElement("a", "MimirUserButton", 
			this.headerElement, "MimirButton");

		this.bodyElement = createDomElement("div", "MimirBody", 
			this.mainElement, "MimirBody");

		// Load the initialization data
		this.load(data);


		// Detect when the location has changed
		function updateTitle() {
			let title = "";
			if (location.hash) {
				let hash = location.hash, firstWord = hash.indexOf('_');
				title = hash.slice(1, (firstWord > 0)? firstWord : undefined);

			}
			this.titleElement.innerText = title;
		}
		window.onhashchange = updateTitle.bind(this);
		(updateTitle.bind(this))();

	}


	/** Initializes a new instance of the Mimir class.
	 * @param data The initialization data (or a path to the JSON file). */
	static init(data) {  return new Mimir(data); }


	/** Loads the initialization data.
	* @param data The initialization data (or a path to the JSON file). */
	async load(data) {
		
		// if no data is provided
		if (!data) throw Error("No data provided");

		// If the data is a string, use it as a path to fetch the JSON file
		if (typeof data == 'string')
			await fetch(data).then(r => r.json()).then(json => data = json);

		// Check the current data
		if (typeof data != 'object') throw Error("Invalid data type");

		let classNames = [ "MimirBody", "MimirSection", "MimirPart", 
			"MimirSubPart"];

		if (data.parts && data.parts.length > 0)
			this.menuButton.setAttribute("href", '#' + data.parts[0].id);

		function readString(data, format) {
			if (!data) return "";
			if (typeof data == 'string') return data;
			if (data.no != undefined && data.en != undefined) return data.no + '(' + data.en + ')';
			return "";
		}

		// Parse each node
		function parseNode(data, parentElement, level = 0) {
			let node = data;
			let id = (level == 1? "" : parentElement.id + '_') + data.id;
			let className = classNames[level];
			let style = data.style;

			if (level == 0) node.element = parentElement;
			else node.element = createDomElement("div", id, parentElement,
					className, style);
			


			if (data.title) {
				createDomElement("h" + level, id + "_Title", node.element,
					className + "Title", null, readString(data.title));
			}
			if (data.description) {
				createDomElement("p", id + "_Description", node.element,
					className + "Description", readString(data.description));
			}

			// Parse the items
			if (data.items) for (let item of data.items) {
				let itemID = item.id || (item.title)? item.title.en || item.title: "";
				let itemText = item.text;
				if (item.title) itemText = '<b>' + readString(item.title) + 
					':</b> ' + itemText;
				if (item.link) itemText = '<a href="' + item.link + '">' +
						itemText + '</a>'
				item.element = createDomElement("p", 
					(itemID? id + '_' + itemID : null), node.element,
					item.classes, item.style, itemText);
			}

			if (data.parts) for (let part of data.parts) 
				parseNode(part, node.element, level+1);
			return node;
		}
		
		// Create the sections
		this.data = parseNode(data, this.bodyElement);
	}
}

/** Creates a DOM element
 * @param type The type of the element (its tag name)
 * @param id The id of the element.
 * @param parent The parent of the element.
 * @param classes The classes of the element.
 * @param style The style of the element.
 * @param content The HTML content of the element.
 * @returns The generated element. */
function createDomElement(type, id, parent, classes, style, content) {

	// Create the element
	let element = document.createElement(type);
	
	// Set the properties of the element
	if (id) element.id = id;
	if (classes) element.className = classes;
	if (style) element.style.cssText = style;
	if (content) element.innerHTML = content;

	// Set the parent of element
	((parent) ? parent : document.body).appendChild(element);

	// Return the generated element
	return element;
}


