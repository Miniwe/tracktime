module.exports = (express) ->
  router = express.Router()

  router.get '/', (req, res) ->
    res.send 'Hello World! 63 a'

  router.get '/status', (req, res) ->
    res.type('text/javascript').send 'Tracktime.AppChannel.command("serverOnline")'

  router
