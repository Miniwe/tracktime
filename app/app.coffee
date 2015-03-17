class App extends Backbone.Model
  constructor: () ->
    console.log 'app constructor'
    return

  initialize: () ->
    console.log 'app init'

    Backbone.history.start
      pushState: true

    return

(module?.exports = App) or @App = App
