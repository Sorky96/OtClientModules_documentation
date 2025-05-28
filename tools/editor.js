
const cm = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "toml",
  theme: "default",
  lineNumbers: true
});

const initialCode = `MainWindow
  id: "main"
  size: [300, 100]

  Label
    id: "label"
    text: "Hello"
    margin-top: 10
    margin-left: 20`;

cm.setValue(initialCode);
window._initialOTUI = initialCode;

let timeout;
cm.on("change", () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    const code = cm.getValue();
    window._initialOTUI = code;
    if (window.jtoml && window.jtoml.parse) {
      window.renderOTUI(code);
    }
  }, 300);
});

window.addEventListener("load", () => {
  if (window.jtoml && window.jtoml.parse) {
    window.renderOTUI(window._initialOTUI);
  }
});
