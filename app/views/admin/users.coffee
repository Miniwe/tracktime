class Tracktime.AdminView.Users extends Backbone.View
  container: '#main'
  template: JST['admin/users']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template()

(module?.exports = Tracktime.AdminView.Users) or @Tracktime.AdminView.Users = Tracktime.AdminView.Users

