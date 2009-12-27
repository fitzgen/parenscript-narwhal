var parenscript = null;
 
function ParenScriptLoader() {    
    var loader = {};
    var factories = {};
    
    loader.reload = function(topId, path) {
        if (!parenscript) {
            parenscript = require("parenscript");
        }
        
        factories[topId] = parenscript.make_narwhal_factory(path);
    };
    
    loader.load = function(topId, path) {
        if (!factories.hasOwnProperty(topId))
            loader.reload(topId, path);
        return factories[topId];
    };
    
    return loader;
};
 
require.loader.loaders.unshift([".ps", ParenScriptLoader()]);