$ ->
  console.log 'app run'
  $.material.init()

  domain = 'http://localhost:3000'
  loki = new Lokitest

  socket = io(domain)

  content = $ 'h1'
  socket.on 'connect', ->
    console.log 'Connected!'
    return

  socket.on 'message', (msg) ->
    content.append $('<p>').text msg
           .append $('<em>').text ' from server'

  socket.on 'event', (data) ->
    console.log 'Event!', data
    return

  # socket.on 'tweet', (data) ->
  #   console.log 'Tweet!'
  #   console.log 'T data!', data
  #   return

  $('.send-request').on 'click', (event) ->
    event.preventDefault()
    msg = 'text object'
    content.append $('<p>').text msg
           .append $('<em>').text ' from me'

    socket.emit msg


    # $.get domain + '/users',
    #  message: 'command'
    # , (data) ->
    #   console.log 'request result', data
    # console.log 'clicked .send-request', socket
    # socket.emit 'command',
    #   data: 'command-text'
    # socket.emit 'users'
    # socket.emit '/users'

  socket.on 'disconnect', ->
    console.log 'disconnect!'
    return


  return
