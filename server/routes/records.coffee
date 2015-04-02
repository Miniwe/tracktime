module.exports = (express, db) ->
  router         = express.Router()
  collectionName = 'records'


  findAll = (req, res) ->
    db.base.collection  collectionName, (err, collection) ->
      collection.find().toArray (err, items) ->
        res.send items

  addRecord = (req, res) ->
    record = req.body
    # console.log 'Adding record: ' + JSON.stringify(record)
    db.base.collection collectionName, (err, collection) ->
      collection.insert record, {safe:true, fullResult:true}, (err, result) ->
        if err
          err = new Error('Add error has occurred')
          err.status = 456
          next err
        else
          res.json result.ops[0]

  findById = (req, res) ->
    id = req.params.id
    # console.log 'Retrieving record: ' + id
    db.base.collection collectionName, (err, collection) ->
      collection.findOne { '_id': new db.bson(id) }, (err, item) ->
        res.send item
        return
      return

  updateRecord = (req, res) ->
    id = req.params.id
    record = req.body
    delete record._id
    # console.log 'Updating record: ' + id
    # console.log JSON.stringify(record)
    db.base.collection collectionName, (err, collection) ->
      collection.update { '_id': new db.bson(id) }, record, { safe: true }, (err, result) ->
        if err
          # console.log 'Error updating record: ' + err
          res.send 'error': 'An error has occurred'
        else
          # console.log '' + result + ' document(s) updated'
          res.send record
        return
      return

  deleteRecord = (req, res) ->
    id = req.params.id
    # console.log 'Deleting record: ' + id
    db.base.collection collectionName, (err, collection) ->
      collection.remove { '_id': new db.bson(id) }, { safe: true }, (err, result) ->
        if err
          res.send 'error': 'An error has occurred - ' + err
        else
          # console.log '' + result + ' document(s) deleted'
          res.send req.body
        return
      return


  router.get    '/',    findAll
  router.get    '/:id', findById
  router.post   '/',    addRecord
  router.put    '/:id', updateRecord
  router.delete '/:id', deleteRecord

  router