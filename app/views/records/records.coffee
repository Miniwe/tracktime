class Tracktime.RecordsView extends Backbone.View
  container: '#main'
  template: JST['records/records']
  tagName: 'ul'
  className: 'list-group'

  initialize: () ->
    @views = {}
    @render()
    # @listenTo @collection, "reset", @resetRecordsList
    @listenTo @collection, "add", @addRecord
    @listenTo @collection, "remove", @removeRecord
    $('.removeFilter', @container).on 'click', @removeFilter

    @projects = Tracktime.AppChannel.request 'projects'
    @projects.on 'sync', @updateProjectInfo

    @users = Tracktime.AppChannel.request 'users'
    @users.on 'sync', @updateUserInfo

  render: () ->
    $(@container).html @$el.html ''
    @$el.before @template {title: 'Records', filter: @collection.getFilter()}
    @resetRecordsList()
    @updateProjectInfo()
    @updateUserInfo()

  resetRecordsList: () ->
    # @clear()
    frag = document.createDocumentFragment()
    models = @collection.getModels()
    _.each models, (record) ->
      recordView = @setSubView "record-#{record.cid}", new Tracktime.RecordView model: record
      frag.appendChild recordView.el
    , @
    @$el.append frag

  updateProjectInfo: ->
    @projectsList = Tracktime.AppChannel.request 'projectsList'
    key = $('.removeFilter[data-exclude=project]', @container).data('value')
    if key of @projectsList
      $('.removeFilter[data-exclude=project] .caption', @container).text @projectsList[key]

  updateUserInfo: ->
    @usersList = Tracktime.AppChannel.request 'usersList'
    key = $('.removeFilter[data-exclude=user]', @container).data('value')
    if key of @usersList
      $('.removeFilter[data-exclude=user] .caption', @container).text @usersList[key]

  addRecord: (record, collection, params) ->
    if record.isSatisfied @collection.filter
      recordView = new Tracktime.RecordView { model: record }
      $(recordView.el).prependTo @$el
      @setSubView "record-#{record.cid}", recordView

  removeFilter: (event) =>
    key = $(event.currentTarget).data('exclude')
    # remove key from collection filter
    @collection.removeFilter key
    # remove all records from list
    @$el.find('.list-group > li').remove()
    # refresh filter list in header
    $(event.currentTarget).remove()
    # add records by filter from collection
    @resetRecordsList()



  removeRecord: (record, args...) ->
    recordView = @getSubView "record-#{record.cid}"
    recordView.close() if recordView

(module?.exports = Tracktime.RecordsView) or @Tracktime.RecordsView = Tracktime.RecordsView

