
window.jtoml = {
  parse: function (text) {
    const lines = text.split('\n');
    const root = {};
    const stack = [{ indent: -1, obj: root }];
    let lastWidgetKey = null;

    for (let line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const indent = line.search(/\S/);

      // If it's a new widget declaration
      if (!trimmed.includes(':')) {
        const newBlock = {};
        while (stack.length > 0 && indent <= stack[stack.length - 1].indent) {
          stack.pop();
        }
        const parent = stack[stack.length - 1].obj;
        if (!parent[trimmed]) {
  parent[trimmed] = newBlock;
} else if (Array.isArray(parent[trimmed])) {
  parent[trimmed].push(newBlock);
} else {
  parent[trimmed] = [parent[trimmed], newBlock];
}
        stack.push({ indent, obj: newBlock });
        lastWidgetKey = trimmed;
        continue;
      }

      // It's a property line
      const parts = trimmed.split(':');
      if (parts.length < 2) continue;

      const key = parts[0].trim();
      const rawValue = parts.slice(1).join(':').trim();

      const target = stack[stack.length - 1].obj;
      if (rawValue.startsWith('[')) {
        try {
          target[key] = JSON.parse(rawValue.replace(/'/g, '"'));
        } catch {
          target[key] = [];
        }
      } else if (rawValue.startsWith('"')) {
        target[key] = rawValue.slice(1, -1);
      } else {
        const n = parseFloat(rawValue);
        target[key] = isNaN(n) ? rawValue : n;
      }
    }

    return root;
  }
};
