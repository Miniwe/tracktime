module.exports = (express, db) ->
  router         = express.Router()
  collectionName = 'records'


  findAll = (req, res) ->
    db.base.collection  collectionName, (err, collection) ->
      collection.find().toArray (err, items) ->
        res.send items

  addRecord = (req, res) ->
    record = req.body
    console.log 'Adding record: ' + JSON.stringify(record)
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
    console.log 'Retrieving record: ' + id
    db.base.collection collectionName, (err, collection) ->
      collection.findOne { '_id': new db.bson(id) }, (err, item) ->
        res.send item
        return
      return

  updateRecord = (req, res) ->
    id = req.params.id
    record = req.body
    delete record._id
    console.log 'Updating record: ' + id
    console.log JSON.stringify(record)
    db.base.collection collectionName, (err, collection) ->
      collection.update { '_id': new db.bson(id) }, record, { safe: true }, (err, result) ->
        if err
          console.log 'Error updating record: ' + err
          res.send 'error': 'An error has occurred'
        else
          console.log '' + result + ' document(s) updated'
          res.send record
        return
      return

  deleteRecord = (req, res) ->
    id = req.params.id
    console.log 'Deleting record: ' + id
    db.base.collection collectionName, (err, collection) ->
      collection.remove { '_id': new db.bson(id) }, { safe: true }, (err, result) ->
        if err
          res.send 'error': 'An error has occurred - ' + err
        else
          console.log '' + result + ' document(s) deleted'
          res.send req.body
        return
      return


  router.get    '/',    findAll
  router.get    '/:id', findById
  router.post   '/',    addRecord
  router.put    '/:id', updateRecord
  router.delete '/:id', deleteRecord

  router





# curl 'http://localhost:3000/records/551bed5aa15f0e4d6aea340c' -H 'Pragma: no-cache' -H 'Origin: null' -H 'Accept-Encoding: gzip, deflate, sdch' -H 'Accept-Language: ru,en-US;q=0.8,en;q=0.6' -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2272.104 Safari/537.36' -H 'Accept: application/json, text/javascript, */*; q=0.01' -H 'Cache-Control: no-cache' -H 'Cookie: PHPSESSID=bec910e6332d168d8dffa0e0a0009deb' -H 'Connection: keep-alive' --compressed