class Tracktime.RecordsCollection extends Backbone.Collection
  model: Tracktime.Record
  url: '/records'
  localStorage: new Backbone.LocalStorage ('records-backbone')

  initialize: () ->
    console.log 'initialize', 'RecordsCollection'
    @router = new Tracktime.RecordsRouter {controller: @}

  nextOrder: () ->
    if not @length
      order = 1
    else
      order = @last().get('order') + 1
    return order
