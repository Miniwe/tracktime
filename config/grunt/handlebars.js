module.exports = function (grunt, options) {
  var processFilepath = function(filePath) {
    var pieces = filePath.split("/");
    var name = pieces.pop();
    pieces.shift(); pieces.shift();
    name = name.substring(name, name.length-4);
    pieces.push(name);
    return pieces.join('/');
  };
  return {
    compile: {
      options : {
        _namespace: "Tracktime.Templates",
        processName: processFilepath,
        processPartialName: processFilepath,
      },
      compilerOptions: {
        knownHelpersOnly: false
      },
      files: {
        ".tmp/templates.js" : ["app/templates/**/*.hbs"]
      }
    }
  };
}