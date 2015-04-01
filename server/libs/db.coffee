module.exports = do ->
  # Instance stores a reference to the Singleton
  instance = undefined
  db = undefined
  BSON = undefined

  init = ->
    privateVariable = 'Im also private'
    # Singleton
    # Private methods and variables

    open  = (err, db) ->
      unless err
        console.log "Connected to database"

    mongo = require('mongodb')
    Server = mongo.Server
    Db = mongo.Db
    BSON = require('bson')

    server = new Server('localhost', 27017, {auto_reconnect: true})
    db = new Db('trackime', server, {safe: true});
    db.open(open)

    privateMethod = ->
      # console.log 'I am private'
      return

    {
      publicMethod: ->
        # console.log 'The public can see me!'
        return
      base: db
      bson: BSON.ObjectId
    }

  { get: ->
    if !instance
      instance = init()
    instance
  }
