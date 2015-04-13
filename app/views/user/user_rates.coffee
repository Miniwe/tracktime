class Tracktime.UserView.Rates extends Backbone.View
  container: '#main'
  template: JST['user/rates']

  initialize: () ->
    @render()

  render: () ->
    $(@container).html @$el.html @template {title: 'User Rates'}

(module?.exports = Tracktime.UserView.Rates) or @Tracktime.UserView.Rates = Tracktime.UserView.Rates

