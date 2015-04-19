class Tracktime.AdminView.UsersView extends Backbone.View
  container: '#main'
  template: JST['admin/users']
  tagName: 'ul'
  className: 'list-group'

  initialize: () ->
    @views = {}
    @render()
    @listenTo @collection, "reset", @resetUsersList
    @listenTo @collection, "add", @addUser
    @listenTo @collection, "remove", @removeUser

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Users'}
    @resetUsersList()

  resetUsersList: () ->
    _.each @collection.where(isDeleted: false), (user) =>
      console.log 'render user view'
      userView =  new Tracktime.AdminView.UserView { model: user }
      @$el.append userView.el
      @setSubView "user-#{user.cid}", userView
    , @

  addUser: (user, collection, params) ->
    userView = new Tracktime.AdminView.UserView { model: user }
    $(userView.el).prependTo @$el
    @setSubView "user-#{user.cid}", userView

  removeUser: (user, args...) ->
    userView = @getSubView "user-#{user.cid}"
    userView.close() if userView

(module?.exports = Tracktime.AdminView.UsersView) or @Tracktime.AdminView.UsersView = Tracktime.AdminView.UsersView

