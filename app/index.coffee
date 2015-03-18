$ ->
  $.material.init()

  tracktime = new Tracktime()
  tracktimeView = new Tracktime.AppView {model: tracktime}

  tracktime.populateRecords()
  tracktimeView.renderRecords()


  $("#app-content").append tracktimeView.el

  return
