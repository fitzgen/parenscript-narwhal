var FILE = require("file");
var OS = require("os");
var readline = require("readline").readline;

// Return true if the number of opening parens matches the number of closing
// parens.
var matchingParens = function (str) {
    return str.split("(").length === str.split(")").length;
};

// Filter out the comments from the output parenscript returns.
var cleanParenScriptOutput = function (lines) {
    var result = [];
                
    for (var i = 0, len = lines.length; i < len; i++) {
        var line = lines[i];
        
        // Ignore all lines starting with ";" because they are parenscript's
        // comments.
        if ((/^; Error: /).test(line)) {
            throw new Error("ParenScript compiler error");
        } else if (line.charAt(0) !== ";") {
            result.push(line);
        }
    }
    
    return result.join("");
};

exports.run = function(args) {
    // TODO: non-REPL    
    args.shift();
    
    if (args.length) {
        require(FILE.absolute(args[0]));
        return;
    }
    
    // Begin REPL.
    while (true) {
        try {
            system.stdout.write("ps> ").flush();
            
            // Keep collecting input until the parens are matching and two empty
            // lines have been passed.
            var collectInput = function(source, linesEmpty) {
                if (linesEmpty === 2) {
                    return source;
                } else {
                    system.stdout.write("... ").flush();
                    var thisLine = readline();

                    if (thisLine === "") {
                        return collectInput(source, linesEmpty + 1);
                    } else {
                        return collectInput(source + thisLine, 0);
                    }
                }
            };

            var source = readline();

            source = collectInput(source, 0);

            var result = exports.ps_eval(source); 
            print(result);
        } catch (e) {            
            print(e);
        }
    }
};
 
var psPath = FILE.path(module.path).dirname().dirname().join("bin", "parenscript-compile");
var psLispFilePath = FILE.path(module.path).dirname().dirname().join("bin", "parenscript-compile.lisp");

// Call the parenscript compiler script.
var callParenScript = function (flag, arg) {
    var ps = OS.popen([psPath, psLispFilePath, flag, arg]);

    if (ps.wait() !== 0) {
        throw new Error("Error compiling ParenScript source:\n" + ps.stderr.read());
    }
 
    return cleanParenScriptOutput(ps.stdout.readLines());    
};

exports.compileFile = function(filePath) {
    return callParenScript("--file", filePath);
};
 
exports.compile = function(source) {
    return callParenScript("--eval", source);
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