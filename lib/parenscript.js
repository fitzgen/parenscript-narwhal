var FILE = require("file");
var OS = require("os");
var readline = require("readline").readline;

// Return true if the number of opening parens matches the number of closing
// parens.
var matchingParens = function (str) {
    return str.split("(").length === str.split(")").length;
};

exports.run = function(args) {
    args = args || [];
    args.shift();
    
    if (args.length) {
        require(FILE.absolute(args[0]));
        return;
    }
    
    // Begin REPL.
    while (true) {
        try {
            var prompt = "ps> ";

            // Keep collecting input until the parens are matching and an empty
            // line has been passed.
            var collectInput = function(source, first) {
                if (matchingParens(source) && !first) {
                    return source;
                } else {
                    system.stdout.write(prompt).flush();
                    prompt = "... ";

                    var thisLine = readline();

                    return collectInput(source + thisLine, false);
                }
            };

            var source = collectInput("", true);

            var result = exports.ps_eval(source); 
            print(result);
        } catch (e) {            
            print(e);
        }
    }
};
 
var parenscript_compile_path = FILE.path(module.path).dirname().dirname().join("bin", "parenscript-compile.lisp");

var parenscript_compile = function() {
    return OS.popen(Array.prototype.concat.apply(["sbcl", "--script", parenscript_compile_path], arguments));
}

exports.compileFile = function(filePath) {
    var ps = parenscript_compile("--file", filePath);
    if (ps.wait() !== 0)
        throw new Error("Error compiling ParenScript source:\n" + ps.stderr.read());
    return ps.stdout.read();
};

exports.compile = function(source) {
    var ps = parenscript_compile("--stdin");
    ps.stdin.write(source).flush().close();
    if (ps.wait() !== 0)
        throw new Error("Error compiling ParenScript source:\n" + ps.stderr.read());
    return ps.stdout.read();
};

exports.ps_eval = function(source) {
    init();
    var code = exports.compile(source);
    return eval(code);
};

exports.make_narwhal_factory = function(path) {
    init();
 
    var code = exports.compileFile(path);
    var factoryText = "function(require,exports,module,system,print){" + code + "/**/\n}";

    if (system.engine === "rhino")
        return Packages.org.mozilla.javascript.Context.getCurrentContext().compileFunction(global, factoryText, path, 0, null);
 
    // eval requires parenthesis, but parenthesis break compileFunction.
    else
        return eval("(" + factoryText + ")");
}
 
 
var init = function() {   
    // make sure it's only done once
    init = function(){};
};