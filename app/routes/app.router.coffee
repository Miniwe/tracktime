class Tracktime.Router extends Backbone.Router
  routes:
    '*filter' : 'setFilter'

  setFilter: (params) ->
    console.log 'Tracktime.router.params = ' + params
    window.filter = params.trim() || ''
    # Tracktime.todoList.trigger 'reset'


(module?.exports = Tracktime.Router) or @Tracktime.Router = Tracktime.Router
