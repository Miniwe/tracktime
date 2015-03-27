class Tracktime.ActionView extends Backbone.View
  tagName: 'li'
  className: 'btn'
  events:
    'click a': 'setActive'

  initialize: () ->
    # _.bindAll @model, 'change:isActive', @update
  attributes: () ->
    id: @model.cid

  setActive: (event) ->
    @model.setActive()
    # event.preventDefault()
    # $('#action_type').html $(event.currentTarget).html()
    # $('.floating-label').html $(event.currentTarget).data('original-title')
    # $('textarea', @$el).focus()
    # $('#action_type').removeClass()
    # $('#action_type').addClass $(event.currentTarget).attr('class')
    # $('.dropdown-menu li', @$el).removeClass('active')
    # $(event.currentTarget).parent().addClass('active')


(module?.exports = Tracktime.ActionView) or @Tracktime.ActionView = Tracktime.ActionView

