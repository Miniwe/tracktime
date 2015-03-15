
$ ->
  console.log 'app run'
  $.material.init()

  loki = new Lokitest

  socket = io('http://localhost:3000')

  socket.on 'connect', ->
    alert 'Connected!'
    return
  socket.on 'event', (data) ->
    console.log 'Event!', data
    return
  socket.on 'disconnect', ->
    console.log 'disconnect!'
    return


  return
