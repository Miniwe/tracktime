class Tracktime extends Backbone.Model

  urlRoot: "/"

  defaults:
    title: "TrackTime App"
    tmpRecords: [
      {
        subject: 'Lorem'
        description: 'Iipsum dolor sit amet, consectetur adipisicing elit. Quisquam, facere!'

      }
      {
        subject: 'Tempore'
        description: 'Harum quis officiis consequuntur dolorem omnis at quo maxime?'

      }
      {
        subject: 'Consequuntur'
        description: 'Libero quibusdam perspiciatis assumenda quas natus eveniet asperiores dolor.'

      }
      {
        subject: 'Rem'
        description: 'Libero, enim doloremque blanditiis delectus quasi itaque architecto accusantium!'

      }
    ]

  initialize: () ->
    @set 'router', new Tracktime.Router()
    Backbone.history.start
      pushState: true
    return

  populateRecords: () ->
    recordsCollection = new Tracktime.RecordsCollection()
    _.each @get('tmpRecords'), (record) ->
      recordsCollection.add new Tracktime.Record record
    @set 'records', recordsCollection

(module?.exports = Tracktime) or @Tracktime = Tracktime
