$ ->
  $.material.init()

  tracktime = new Tracktime()

  # @todo: move view init in controller to default path
  #        set default view and render it
  #        set default element for view body

  tracktimeView = new Tracktime.AppView {model: tracktime}
  $("#app-content").append tracktimeView.el

  return
