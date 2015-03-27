class Tracktime.ActionView.ListBtn extends Backbone.View
  tagName: 'li'
  template: JST['layout/header/listbtn']
  events:
    'click': 'makeActionActive'

  initialize: (options) ->
    _.extend @, options
    @render()

  render: () ->
    @$el.toggleClass('active', @model.get('isActive'))
    @$el.html @template @model.toJSON()

  makeActionActive: () ->

    @$el.siblings().removeClass 'active'
    @$el.addClass 'active'

    #add to select-action-type-dropdown selected - can modify on action modell call
    @container.find("#action_type").replaceWith (new Tracktime.ActionView.ActiveBtn model: @model).$el

    #add selected detais if exist - will change from action modell call
    unless @model.get('details') is null
      @container.parent().find("#detailsNew").show().replaceWith (new Tracktime.ActionView.DetailsBtn model: @model).el
    else
      @container.parent().find("#detailsNew").hide()

    $('.floating-label', '#actions-form').html @model.get('title')

    @container.parents('.navbar').attr 'class', "navbar #{@model.get('navbarClass')} shadow-z-1"

    $('textarea', '#actions-form')?.focus()

(module?.exports = Tracktime.ActionView.ListBtn) or @Tracktime.ActionView.ListBtn = Tracktime.ActionView.ListBtn

