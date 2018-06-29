var parse = require("./can-stache-ast").parse;
var QUnit = require("steal-qunit");

QUnit.module("can-stache-ast - parse");

QUnit.test("Gets the program", function(assert){
	var ast = parse("<div></div>");
	assert.ok(ast, "got an ast");
	assert.ok(ast.program, "got a program");
});

QUnit.test("Parses out imports", function(assert){
	var ast = parse("<can-import from='foo'/><div></div>");
	assert.equal(ast.imports.length, 1, "one import");
	assert.equal(ast.imports[0], "foo");
});

QUnit.test("importDeclarations provides the import line", function(assert){
	var ast = parse(`<can-import from="one"/>
	<can-import from="two"/>`);
	var f = ast.importDeclarations[1];
	assert.equal(f.specifier, "two", "got the right one");
	assert.equal(f.loc.line, 2, "on line 2");
});
