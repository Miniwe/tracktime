class Tracktime extends Backbone.Model
  urlRoot: "/"

  defaults:
    title: "TrackTime App - from"
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
    return

  populateRecords: () ->
    @set 'records', new Tracktime.RecordsCollection @get('tmpRecords')
    @trigger 'update_records'

(module?.exports = Tracktime) or @Tracktime = Tracktime
