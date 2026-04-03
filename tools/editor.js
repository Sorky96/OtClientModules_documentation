const cm = CodeMirror.fromTextArea(document.getElementById("editor"), {
  mode: "toml",
  theme: "default",
  lineNumbers: true
});

const initialCode = `MainWindow
  id: "main"
  size: [320, 180]

  Label
    id: "title"
    text: "Pseudo-OTUI preview"
    margin-top: 8
    margin-left: 12

  Button
    id: "okButton"
    text: "OK"
    margin-top: 16
    margin-left: 12`;

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
