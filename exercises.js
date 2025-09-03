

var editors = [];
var exercises = document.getElementsByClassName("exercise");
for (var i = 0; i < exercises.length; i++) {
    const ta = exercises[i].getElementsByTagName('textarea')[0];
    
    // Turn the textarea into a Python editor
    const editor = CodeMirror.fromTextArea(ta, {
    mode: "python",
    theme: "default",
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
    lineWrapping: false
    });
    
    if (exercises[i].hasAttribute("example")) {
        editor.setOption("readOnly", "true");
        const lineCount = editor.lineCount();
        editor.setSize(null, lineCount * 20+ 5);
    } else {
        if (ta.hasAttribute("linecount")) {
            editor.setSize(null, ta.getAttribute("linecount") * 20+ 5);
        } else {
            editor.setSize(null, 16 * 20+ 5);
        }
    }
   
    editors.push(editor);
}

var solutions = document.getElementsByClassName("solution");
for (var i = 0; i < solutions.length; i++) {
    // Turn the textarea into a Python editor
    const sol = CodeMirror.fromTextArea(solutions[0], {
    mode: "python",
    theme: "default",
    lineNumbers: true,
    indentUnit: 4,
    matchBrackets: true,
    lineWrapping: false
    });
    sol.setOption("readOnly", "true");
    const lineCount = sol.lineCount();
    sol.setSize(null, lineCount * 20+ 5);
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
    const code = editor.getValue().trim();
    
    // If empty, just clear output and return
    if (!code) {
        output.textContent = "";
        return;
    }
    
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
    

