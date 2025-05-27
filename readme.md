# Complete Guide to Creating OTClient Modules

## What Are OTClient Modules?

Modules in OTClient (OTC) are self-contained folders containing Lua logic and UI definition files (.lua and .otui) that extend the game's client functionality. Examples include hotkey bars, health trackers, battle lists, and custom UIs.

## Folder Structure

```
modules/
  your_module/
    your_module.lua
    your_module.otui
    images/
    styles/
    other_scripts.lua
    your_module.otmod
```

## OTMod File (.otmod)

Every module must include a .otmod file which defines its metadata and how it integrates with the client. Below is an example with detailed comments:

```
Module
  name: "Your Module"                -- Display name of the module
  description: "Does something cool." -- Description shown in module manager
  author: "Your Name"                -- Attribution field
  sandboxed: true                    -- Restricts global access for safety
  dependencies: [ ]                  -- List of other modules this one depends on
  scripts: ["your_module.lua"]       -- Lua scripts to load (OTCv8 can skip .lua)
  @onLoad: init()                    -- Lua function to call when module loads
  @onUnload: terminate()             -- Lua function to call on unload
```

Note: Modern forks like OTCv8 allow skipping .lua in script names, but it's recommended to always include it for compatibility.

## Lua Logic File (your_module.lua)

This script contains the core logic that runs when your module is loaded or unloaded. The functions init() and terminate() are defined in your .otmod file and will be executed by the OTClient framework.

```
function init()
  -- Load the UI layout defined in your_module.otui
  g_ui.loadUI("your_module.otui")

  -- Create a MainWindow widget and attach it to the root interface
  myWindow = g_ui.createWidget("MainWindow", rootWidget)
end

function terminate()
  -- Always clean up your widgets when unloading the module
  -- This ensures there are no memory leaks or duplicated windows
  if myWindow then
    myWindow:destroy()  -- Destroy removes the widget from memory
    myWindow = nil      -- Unset the reference to help garbage collection
  end
end
```

Explanation:

- init() is called automatically when the module is loaded (as defined in @onLoad).

- g_ui.loadUI() loads the .otui layout into memory.

- g_ui.createWidget() instantiates the root widget.

- terminate() is executed when unloading — this is where you destroy custom UI to avoid bugs or memory leaks.

- :destroy() ensures the widget is removed from both the screen and memory — always pair this with myWidget = nil.

## OTUI Files and Attributes

OTUI files define the visual layout and styling of widgets using a custom markup format. Below is an example layout with inline comments.

```
MainWindow                             -- Main container window with title bar and close button
  id: myWindow                          -- ID to reference this widget from Lua
  size: 300 200                         -- Width and height
  text: "My Example"                   -- Window title
  @onClick: function()                 -- Click handler using inline Lua
    g_logger.info("Clicked window")
  end

  Button                               -- A child widget (indented under MainWindow)
    id: closeButton                    -- Button's unique ID
    text: "Close"                      -- Label on the button
    anchors.bottom: parent.bottom     -- Anchor this button to bottom of parent
    @onClick: function()               -- On click, close the parent window
      myWindow:destroy()
    end
```

### Attribute Reference

These are the most commonly used attributes across OTUI widget types.

#### Common Attributes

- id: Unique name to reference the widget from Lua.

- size: Format: width height, e.g. size: 100 20.

- position: Manual placement within parent, e.g. position: 20 30.

- anchors: Anchor this widget relative to its parent or siblings. Can use top, bottom, left, right, or fill.

- margin: Outside spacing. Can be single or multiple values: margin: 10 or margin: 5 10 5 10.

- padding: Inner spacing between the border and content.

- visible: Set to false to hide widget by default.

- enabled: Set to false to disable interaction (e.g. greys out buttons).

- opacity: Value from 0 (transparent) to 1 (opaque).

#### Text Attributes

- text: The label or string displayed inside the widget.

- text-align: left, center, right.

- text-offset: Shifts text inside widget, e.g. text-offset: 2 2.

- text-auto-resize: Auto-expand the widget to fit text.

- font: Font preset, e.g. verdana-11px-rounded.

- color: Color of the text. Can be named or hex: #FFFFFF.

#### Image Attributes

- image-source: Path to image file (e.g. /images/myicon.png).

- image-rect: Region of the image to display: x y width height.

- image-smooth: Smooth image scaling (true/false).

- icon: Named image from a sprite atlas.

#### Layout & Container Attributes

- layout: Controls layout of child widgets. Use verticalBox, horizontalBox, or grid.

- fit-children: Automatically resize parent to match content.

- spacing: Sets spacing between children in layout containers.

- auto-resize: Makes widget resize on content changes.

#### Style & Border

- background-color: Widget background color.

- border: Format: width color, e.g. 1 #FF0000.

- border-width: Set border per side: border-width: 1 2 1 2.

- border-color: Set color per side: border-color: #000 #222 #000 #222.

#### Event Handlers

- @onClick: Executes when widget is clicked.

- @onHoverChange: Triggers when mouse hovers in/out.

- @onTextChange: Triggers when text value changes.

- @onEnter: Mouse enters widget.

- @onLeave: Mouse leaves widget.

## Advanced Tips & Tricks

Note on .lua Extensions in .otmod Files: In classic OTClient, script filenames in the scripts: array must include the .lua extension. However, in modern forks like OTCv8, the client automatically appends .lua if it's missing. Example:

```
scripts: ["example.lua"]     -- always works
scripts: ["example"]         -- works only in OTCv8 and similar forks
```

For maximum compatibility across clients, always include the full filename with the .lua extension.

- Use fit-children: true on layout panels to allow auto-sizing for nested widgets.

- Use anchors.fill: parent to make widgets automatically stretch and fit their container.

- Combine margin and padding for clean spacing without needing nested panels.

- Use focusable: false for labels or non-interactive elements to avoid them intercepting keyboard focus.

- Manage widgets via their id in Lua: myWidget = rootWidget:getChildById("myId")

- Wrap groups of widgets in a Panel to allow toggling their visibility with one call.

- Use g_keyboard.bindKeyPress in Lua to create custom hotkeys inside your modules.

- Leverage UICreature or UIItem for creature/item previews and inventory widgets.

## Using Extended Opcodes

Extended opcodes allow OTClient and the server to exchange custom messages, beyond the default protocol. They're extremely useful for adding features like UI-server communication, achievements, or custom task systems.

### Server-Side (Lua - TFS)

```
function onExtendedOpcode(player, opcode, buffer)
  -- Called automatically when client sends an extended opcode
  if opcode == 42 then
    print("Received from client:", buffer)

    -- Respond back to the client using the same opcode
    player:sendExtendedOpcode(42, "response from server")
  end
  return true
end
```

Explanation: This function should be registered in TFS's creaturescripts.xml. You can define multiple opcodes and use buffer as the custom message content.

### Client-Side (Lua - OTClient)

```
function init()
  -- Register a client-side handler for opcode 42
  ProtocolGame.registerExtendedOpcode(42, onOpcode42)
end

function onOpcode42(protocol, opcode, buffer)
  -- This is called when server sends an extended opcode 42
  g_logger.info("Received from server: " .. buffer)
end

function sendMyOpcode()
  -- Send data to the server only if connected
  if g_game.isOnline() then
    g_game.sendExtendedOpcode(42, "hello from client")
  end
end
```

Key Points:

- ProtocolGame.registerExtendedOpcode: Registers a Lua function to handle server responses.

- g_game.sendExtendedOpcode(opcode, buffer): Sends a custom message to the server.

- buffer can be plain text, JSON, CSV, or any string — it's your protocol.

This is useful for implementing:

- Sending form input (like task progression or preferences) to the server

- Getting structured data back from the server (e.g. JSON tables)

- Triggering backend logic (achievement unlocked, event joined, etc.)

Tips:

- Always verify g_game.isOnline() before sending opcodes

- Use a unique opcode ID (between 1–255) to avoid conflicts

- Consider using JSON.stringify / decode for structured messages
