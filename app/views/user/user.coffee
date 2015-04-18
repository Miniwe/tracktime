class Tracktime.UserView extends Backbone.View
  container: '#main'
  template: JST['users/user']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'User index'}

(module?.exports = Tracktime.UserView) or @Tracktime.UserView = Tracktime.UserView

