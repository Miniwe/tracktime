class Tracktime.ActionView.Project extends Backbone.View
  container: '.form-control-wrapper'
  template: JST['actions/details/project']
  tmpDetails: {}
  views: {}

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    $(@container).html @$el.html @template @model.toJSON()
    $('placeholder#textarea', @$el).replaceWith (new Tracktime.Element.Textarea()).$el



(module?.exports = Tracktime.ActionView.Search) or @Tracktime.ActionView.Search = Tracktime.ActionView.Search

