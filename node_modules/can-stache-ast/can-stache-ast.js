var controls = require("./controls");
var parser = require('can-view-parser');

exports.parse = function(filename, source){
	if (arguments.length === 1) {
		source = arguments[0];
		filename = undefined;
	}

	var template = source;
	template = controls.cleanWhitespaceControl(template);
	template = controls.cleanLineEndings(template);

	var imports = [],
		dynamicImports = [],
		importDeclarations = [],
		ases = {},
		inImport = false,
		inFrom = false,
		inAs = false,
		isUnary = false,
		importIsDynamic = false,
		currentAs = "",
		currentFrom = "";

	function processImport(line) {
		if(currentAs) {
			ases[currentAs] = currentFrom;
			currentAs = "";
		}
		if(importIsDynamic) {
			dynamicImports.push(currentFrom);
		} else {
			imports.push(currentFrom);
		}
		importDeclarations.push({
			specifier: currentFrom,
			loc: {
				line: line
			}
		});
	}

	var program = parser(template, {
		filename: filename,
		start: function( tagName, unary ){
			if(tagName === "can-import") {
				isUnary = unary;
				importIsDynamic = false; // assume static import unless there is content (chars/tags/special).
				inImport = true;
			} else if(tagName === "can-dynamic-import") {
				isUnary = unary;
				importIsDynamic = true;
				inImport = true;
			} else if(inImport) {
				importIsDynamic = true;  // found content inside can-import tag.
				inImport = false;
			}
		},
		attrStart: function( attrName ){
			if(attrName === "from") {
				inFrom = true;
			} else if(attrName === "as" || attrName === "export-as") {
				inAs = true;
			}
		},
		attrEnd: function( attrName ){
			if(attrName === "from") {
				inFrom = false;
			} else if(attrName === "as" || attrName === "export-as") {
				inAs = false;
			}
		},
		attrValue: function( value ){
			if(inFrom && inImport) {
				currentFrom = value;
			} else if(inAs && inImport) {
				currentAs = value;
			}
		},
		end: function(tagName, unary, line){
			if((tagName === "can-import" || tagName === "can-dynamic-import") && isUnary) {
				processImport(line);
			}
		},
		close: function(tagName, unary, line){
			if((tagName === "can-import" || tagName === "can-dynamic-import")) {
				processImport(line);
			}
		},
		chars: function(text) {
			if(text.trim().length > 0) {
				importIsDynamic = true;
			}
		},
		special: function() {
			importIsDynamic = true;
		}
	}, true);

	return {
		intermediate: program,
		program: program,
		imports: imports,
		dynamicImports: dynamicImports,
		importDeclarations: importDeclarations,
		ases: ases,
		exports: ases
	};
};
