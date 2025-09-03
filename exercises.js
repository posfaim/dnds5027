

var editors = [];
var exercises = document.getElementsByClassName("exercise");
for (var i = 0; i < exercises.length; i++) {
    const ta  = exercises[i].getElementsByTagName('textarea')[0];
    
    // Turn the textarea into a Python editor
    const editor = CodeMirror.fromTextArea(ta, {
    mode: "python",
    theme: "default",
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
    lineWrapping: false
    });
    editors.push(editor);

}

let pyodide = null;

  async function loadPyodideAndPackages() {
    pyodide = await loadPyodide();
    document.getElementById("loading").textContent = "✅";
    await pyodide.loadPackage("numpy");
    pyodide.runPython(`
    import builtins
    from js import prompt
    builtins.input = lambda msg="": prompt(msg)
    `)
  
    for (var i = 0; i < exercises.length; i++) {
        var but = exercises[i].getElementsByTagName('button')[0];
        if (but) but.disabled = false;
    }
    
  }


  async function runCode(editor, output) {
    const code = editor.getValue();
    const wrappedCode = `
import sys
import io
sys.stdout = io.StringIO()
sys.stderr = sys.stdout

try:
${code.split("\n").map(line => "    " + line).join("\n")}
except Exception as e:
    print("Error:", e)

sys.stdout.getvalue()
    `;

    try {
      const result = await pyodide.runPythonAsync(wrappedCode);
      output.textContent = result;
    } catch (err) {
      output.textContent = "❌:\n" + err;
    }
  }

  
  loadPyodideAndPackages();
 
for (let i = 0; i < exercises.length; i++) {
    const but = exercises[i].getElementsByTagName('button')[0];
    const out = exercises[i].getElementsByClassName('output')[0];

    but.addEventListener("click", () => runCode(editors[i], out));
}
    

