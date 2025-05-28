
window.renderOTUI = function(code) {
  const preview = document.getElementById('preview');
  preview.innerHTML = '';
  try {
    console.log("Parsing code:");
    console.log(code);
    const tree = window.jtoml.parse(code, 1.0, '\n');
    console.log("Parsed result:", tree);

    if (!tree || typeof tree !== 'object') throw new Error("Invalid parsed structure");

    const rootKey = Object.keys(tree)[0];
    const root = buildWidget(rootKey, tree[rootKey]);
    preview.appendChild(root);
  } catch (e) {
    console.error("OTUI rendering failed:", e);
    preview.innerHTML = '<pre style="color: red;">' + e.message + '</pre>';
  }
};

function buildWidget(type, props) {
  const el = document.createElement('div');
  el.className = 'widget ' + type;

  if (props.size) {
    const [w, h] = props.size;
    el.style.width = w + 'px';
    el.style.height = h + 'px';
  }

  if (props["margin-top"]) el.style.marginTop = props["margin-top"] + "px";
  if (props["margin-left"]) el.style.marginLeft = props["margin-left"] + "px";
  if (props["margin-bottom"]) el.style.marginBottom = props["margin-bottom"] + "px";
  if (props["margin-right"]) el.style.marginRight = props["margin-right"] + "px";

if (type === 'UIItem') {
  el.style.position = 'absolute';

  if (props["margin-left"]) {
    el.style.left = props["margin-left"] + "px";
  }
  if (props["margin-top"]) {
    el.style.top = props["margin-top"] + "px";
  }
}

  if (type === 'Label' || type === 'Button') {
    el.textContent = props.text || '(empty)';
  } else if (type === 'TextEdit') {
  const textarea = document.createElement('textarea');
  textarea.value = props.text || '';
  el.appendChild(textarea);
  }

  const widgetKeys = ['Label', 'Button', 'TextEdit', 'Panel', 'MiniWindow', 'UICreature', 'UIItem'];
  for (const key in props) {
    if (widgetKeys.includes(key) && typeof props[key] === 'object') {
      const value = props[key];

      if (Array.isArray(value)) {
        value.forEach(childProps => {
          const child = buildWidget(key, childProps);
          el.appendChild(child);
        });
      } else {
        const child = buildWidget(key, value);
        el.appendChild(child);
      }
    }
  }

  return el;
}
