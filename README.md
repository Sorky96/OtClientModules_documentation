# Complete(WIP) Guide to Creating OTClient Modules

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

Every module must include a .otmod file which defines its metadata:

```
Module
  name: "Your Module"
  description: "Does something cool."
  author: "Your Name"
  sandboxed: true
  dependencies: [ ]
  scripts: ["your_module.lua"]
  @onLoad: init()
  @onUnload: terminate()
```

## Lua Logic File (your_module.lua)

```
function init()
  g_ui.loadUI("your_module.otui")
  myWindow = g_ui.createWidget("MainWindow", rootWidget)
end

function terminate()
  if myWindow then
    myWindow:destroy()
    myWindow = nil
  end
end
```

This is the typical structure. g_ui.loadUI loads the visual design from your .otui file, and g_ui.createWidget instantiates the root widget.

## OTUI Files and Attributes

OTUI files define the visual layout and styling using a custom markup.

```
MainWindow
  id: myWindow
  size: 300 200
  text: "My Example"
  @onClick: function() g_logger.info("Clicked window") end

  Button
    id: closeButton
    text: "Close"
    anchors.bottom: parent.bottom
    @onClick: function() myWindow:destroy() end
```

### Attribute Reference

Detailed information on each supported OTUI attribute:

#### Common Attributes

- id: Unique identifier used in Lua scripts to access the widget.

- size: Specifies width and height (e.g. size: 100 20).

- position: Relative position inside parent (e.g. position: 20 30).

- anchors: Determines how the widget is anchored to parent/sibling widgets. Can use top, bottom, left, right, or fill.

- margin: Adds spacing around the widget (top, right, bottom, left).

- padding: Adds inner spacing inside the widget's content box.

- visible: Boolean value determining if the widget is shown initially (e.g. visible: false).

- enabled: Boolean value that determines whether the widget can be interacted with.

- opacity: Value between 0 and 1 for transparency (e.g. opacity: 0.5).

#### Text Attributes

- text: Sets the displayed string inside the widget.

- text-align: Aligns text: left, center, right.

- text-offset: Offsets the text inside the widget box (e.g. text-offset: 2 2).

- text-auto-resize: If true, resizes the widget based on the text.

- font: Font style to use (e.g. verdana-11px-rounded).

- color: Text color (hex value or named color).

#### Image Attributes

- image-source: Path to an image file (relative to /images).

- image-rect: Clipping region for the image (x y width height).

- image-smooth: Boolean flag for smoothing image scale.

- icon: Path to a preset icon image.

#### Layout & Container Attributes

- layout: Defines how children are arranged (e.g. verticalBox, horizontalBox, grid).

- fit-children: Automatically resize parent to fit children (true/false).

- spacing: Spacing between child widgets in layout containers.

- auto-resize: Makes widget resize based on content changes.

#### Style & Border

- background-color: Sets widget background color.

- border: Defines border width and color (e.g. 1 #FFFFFF).

- border-width: Individual control over each side.

- border-color: Color for each side of the border.

#### Event Handlers

- @onClick: Function called on click.

- @onHoverChange: Function when mouse hovers over/out.

- @onTextChange: Function when text inside widget changes.

- @onEnter: Function triggered when mouse enters the widget.

- @onLeave: Function triggered when mouse leaves the widget.

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

Extended opcodes are a way to send and receive custom client-server messages that go beyond standard Tibia communication.

### Server-Side (Lua - TFS)

```
function onExtendedOpcode(player, opcode, buffer)
  if opcode == 42 then
    print("Received from client:", buffer)
    player:sendExtendedOpcode(42, "response from server")
  end
  return true
end
```

### Client-Side (Lua - OTClient)

```
function init()
  ProtocolGame.registerExtendedOpcode(42, onOpcode42)
end

function onOpcode42(protocol, opcode, buffer)
  g_logger.info("Received: " .. buffer)
end

function sendMyOpcode()
  if g_game.isOnline() then
    g_game.sendExtendedOpcode(42, "hello from client")
  end
end
```

This is useful for features like:

- Sending UI-triggered data to the server

- Fetching JSON or structured responses from server

- Triggering events like task updates, achievements, trackers
