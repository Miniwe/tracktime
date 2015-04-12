class Tracktime.AppView extends Backbone.View
  el: '#panel'
  className: ''
  layoutTemplate: JST['global/app']
  views:
    header: null
    main: null
    footer: null
    menu: null

  initialize: ->
    @render()
    @initUI()

  render: ->
    # $(document).title @model.get 'title'
    @$el.html @layoutTemplate @model.toJSON()
    @renderViews()

  renderViews: ->
    @views['header'] = new Tracktime.AppView.Header model: @model, container: @
    # @views['main'] = new Tracktime.AppView.Main model: @model, container: @
    @views['footer'] = new Tracktime.AppView.Footer
      container: @
    @views['menu'] = new Tracktime.AppView.Menu
      model: @model,
      container: @

  initUI: ->
    $.material.init()
    slideout = new Slideout
      'panel': $('#panel')[0]
      'menu': $('#menu')[0]
      'padding': 256
      'tolerance': 70
    $("#menuToggler").on 'click', () -> slideout.toggle()


(module?.exports = Tracktime.AppView) or @Tracktime.AppView = Tracktime.AppView

