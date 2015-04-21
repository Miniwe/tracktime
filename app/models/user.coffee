class Tracktime.User extends Tracktime.Model
  idAttribute: "_id"
  collectionName: config.collection.users
  urlRoot: config.SERVER + '/' + 'users'
  localStorage: new Backbone.LocalStorage 'users'

  defaults:
    _id: null
    first_name: ''
    last_name: ''
    email: ''
    password: ''
    description: ''
    default_pay_rate: ''
    lastAccess: (new Date()).toISOString()
    isDeleted: false

  validation:
    first_name:
      required: true
      minLength: 4
      msg: 'Please enter a valid first_name'

  initialize: ->
    @isEdit = false
    @on 'change:first_name', @updateLastAccess
    @on 'change:last_name', @updateLastAccess
    @on 'change:description', @updateLastAccess
    @on 'change:isEdit', @changeIsEdit

  isValid: () ->
    # @todo add good validation
    true

  updateLastAccess: () ->
    @set 'lastAccess', (new Date()).toISOString()

  changeIsEdit: ->
    if @isEdit
      Tracktime.AppChannel.command 'addAction', {title: 'Edit user', type: 'User', canClose: true},
        title: 'Edit user: ' + @get('first_name').substr(0, 40)
        userModel: @
        scope: 'edit:action'


(module?.exports = Tracktime.User) or @Tracktime.User = Tracktime.User
