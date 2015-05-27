class Tracktime.RecordsView extends Backbone.View
  container: '#main'
  template: JST['records/records']
  tagName: 'ul'
  className: 'list-group'

  initialize: () ->
    @views = {}
    @render()
    @listenTo @collection, "sync", @resetRecordsList
    @listenTo @collection, "remove", @removeRecord
    @listenTo @collection, "add", @addRecord
    @listenTo @collection, "newRecord", @newRecord
    $('.removeFilter', @container).on 'click', @removeFilter
    $('.btn-loadmore', @container).on 'click', @loadMoreRecords
    $('.scrollWrapper').on 'scroll', @autoLoadMoreRecords

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
    $('.btn-loadmore', @container).appendTo @container

  autoLoadMoreRecords: (event) =>
    delta = $(window).height() - $('.btn-loadmore').offset().top - $('.btn-loadmore').height()
    $('.btn-loadmore', @container).click() if delta > 0

  loadMoreRecords: (event) =>
    modelsNewCount = @resetRecordsList()
    if modelsNewCount > 0
     $('.btn-loadmore', @container).show().appendTo @container
    else
     $('.btn-loadmore', @container).hide()

  newRecord: (record) ->
    @loadMoreRecords()
    # @sortRecords()
    dateEl = record.get('recordDate').substr(0, 10).replace(/\s/g, '_')
    # $('.scrollWrapper').animate
    #   'scrollTop': .offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop() + 20
    $('.scrollWrapper').scrollTop($("##{dateEl}").offset().top + $(".scrollWrapper").scrollTop() - 78)

  sortRecords: ->
    parentCont = '#main .list-group'
    sortedList = $('.list-group-item', parentCont).sort (a, b) ->
      timeA = new Date($('.record-info time', a).attr('datetime')).getTime()
      timeB = new Date($('.record-info time', b).attr('datetime')).getTime()
      timeB - timeA

    dates = $.unique($('.record-info time', parentCont).map((i, el) -> moment($(el).attr('datetime')).format("YYYY-MM-DD") )).sort (a, b) -> b > a

    console.log 'dates', dates
    _.each dates, (el, b) ->
      if $("##{el}").length < 1
        $(parentCont).append $("<ul> /", {id: el}).append $("<li />", {class: 'list-group-items-group navbar navbar-primary'}).html moment(el).format("Do MMMM YYYY")

    _.each sortedList, (item) ->
      id = moment($('.record-info time', item).attr('datetime')).format("YYYY-MM-DD")
      $("##{id}", parentCont).append item


  resetRecordsList: ->
    frag = document.createDocumentFragment()
    models = @collection.getModels @exceptRecords()
    _.each models, (record) ->
      recordView = @setSubView "record-#{record.cid}", new Tracktime.RecordView model: record
      frag.appendChild recordView.el
    , @
    @$el.prepend frag
    @sortRecords()
    models.length

  exceptRecords: () ->
    _.pluck $('.list-group-item > div', @container), 'id'

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
    # add record - depricated
    # if record.isSatisfiedied @collection.filter
    #   recordView = new Tracktime.RecordView { model: record }
    #   $(recordView.el).prependTo @$el
    #   @setSubView "record-#{record.cid}", recordView

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

