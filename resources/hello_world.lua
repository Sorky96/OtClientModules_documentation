local window = nil
local hotkey = nil

function init()
  -- Import base and custom styles
	g_ui.importStyle('hello_world.otui')
	window = g_ui.createWidget('HelloWindow', rootWidget)
    window:hide()
  -- Bind Ctrl+I to show the window
  hotkey = g_keyboard.bindKeyPress('Ctrl+I', function()
    toggleHelloWindow()
  end)
end

function terminate()
  if window then
    window:destroy()
    window = nil
  end
  if hotkey then
    g_keyboard.unbindKeyPress('Ctrl+I')
    hotkey = nil
  end
end

function toggleHelloWindow()
  if window and window:isVisible() then
    window:hide()
  else
    if not window then
      window = g_ui.createWidget('HelloWindow', rootWidget)
      if not window then
        g_logger.error("Failed to create HelloWindow widget!")
        return
      end
    end
    window:show()
    window:raise()
    window:focus()
  end
end
