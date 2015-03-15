class Lokitest
  constructor: () ->
    @test 'Start loki</li>'
    # console.log('111');
    LokiJS = require('lokijs')
    @db = new LokiJS('users_1.json')

    $('.add-users').on 'click', (event) =>
      console.log 'add-users'
      event.preventDefault()
      @add()

    $('.get-users').on 'click', (event) =>
      console.log 'get-users'
      event.preventDefault()
      @get()

    return

  test : (msg) ->
    $('h1').html(msg) if msg
    return

  add : () ->
    users = @db.addCollection('users', indices: [ 'name' ])
    users.insert
      name: 'User 10'
      user: 20
    users.insert
      name: 'User 11'
      user: 21
    users.insert
      name: 'User 12'
      user: 22
    # console.log(users.data);
    @db.saveDatabase()
    return

  get : () ->
    @db.loadDatabase {}, =>
      users = @db.getCollection('users')
      # var records = users.data.length;
      if users
        console.log 'users', users.data
      else
        console.log 'no users Data'
        console.log 'will create'
        @add()
      return
    return
