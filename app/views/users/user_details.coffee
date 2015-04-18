class Tracktime.UserView.Details extends Backbone.View
  container: '#main'
  template: JST['users/details']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'User details HERE'}

(module?.exports = Tracktime.UserView.Details) or @Tracktime.UserView.Details = Tracktime.UserView.Details

