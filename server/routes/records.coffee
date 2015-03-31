module.exports = (express) ->
  router = express.Router()

  router.get '/', (req, res) ->
    res.json require('../tmp_records')

  router.post '/', (req, res) ->
    res.json(JSON.stringify({body: req.body}, null, 2)).end()

  router