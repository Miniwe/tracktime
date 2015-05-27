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
    # @listenTo @collection, "add", @addRecord
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
    @addRecord(record)
    # @loadMoreRecords()

    # dateEl = moment(record.get('recordDate') ).format("YYYY-MM-DD")
    # if $("##{dateEl}").length > 0
    #   $('.scrollWrapper').scrollTop($("##{dateEl}").offset().top + $(".scrollWrapper").scrollTop() - 78)

  sortRecords: ->
    parentCont = '#main .list-group'
    sortedList = $('.list-group-item', parentCont).sort (a, b) ->
      timeA = new Date($('.record-info time', a).attr('datetime')).getTime()
      timeB = new Date($('.record-info time', b).attr('datetime')).getTime()
      timeB - timeA

    dates = $.unique($('.record-info time', parentCont).map((i, el) -> moment($(el).attr('datetime')).format("YYYY-MM-DD") )).sort (a, b) -> b > a

    _.each dates, (el, b) ->
      if $("##{el}").length < 1
        $(parentCont).append $("<ul> /", {id: el}).append $("<li />", {class: 'list-group-items-group navbar navbar-primary'}).html moment(el).format("Do MMMM YYYY")

    _.each sortedList, (item) ->
      id = moment($('.record-info time', item).attr('datetime')).format("YYYY-MM-DD")
      $("##{id}", parentCont).append item


  resetRecordsList_old: ->
    frag = document.createDocumentFragment()
    models = @collection.getModels @exceptRecords()
    _.each models, (record) ->
      recordView = @setSubView "record-#{record.cid}", new Tracktime.RecordView model: record
      frag.appendChild recordView.el
    , @
    @$el.prepend frag
    @sortRecords()

  resetRecordsList: ->
    parentCont = '#main .list-group'
    models = @collection.getModels @exceptRecords()
    _.each models, (record) ->
      recordView = @setSubView "record-#{record.cid}", new Tracktime.RecordView model: record
      @listGroup(record).append recordView.el
    , @

  listGroup: (record) ->
    parentCont = '#main .list-group'
    # получить дату группы из модели
    groupDate = moment(record.get('recordDate')).format("YYYY-MM-DD")
    group = null
    # если группа существует то вернуть ев jquery
    if $("##{groupDate}").length > 0
      group = $("##{groupDate}")
    # иначе
    else
      # создать группу с заголовком
      group = $("<ul> /", {id: groupDate}).append $("<li />", {class: 'list-group-items-group navbar navbar-primary'}).html moment(groupDate).format("Do MMMM YYYY")
      # если списков нет то добавить группу просто
      if $(".list-group > ul", parentCont).length < 1
        $(parentCont).append group
      # иначе
      else
        # получить массив id групп - добавить в него новый элемент
        # отсортировать по убыыванию
        groups = $("ul.list-group > ul").map( (idx, el) -> $(el).attr('id') )
        groups.push groupDate
        groups = groups.sort( (a, b) -> b > a )
        # получить индекс в массиве
        groupIndex = _. indexOf groups, groupDate
        # если индекс равен длине массива то добавить группу в конец
        # иначе если индекс равен 0 массива то добавить группу в начало
        if groupIndex == 0
          $(parentCont).prepend group
        # если есть предыдущий искомому элемент полученный по индексу то добавть ul после предыдушего
        else
          prevIndexGroup = groups[groupIndex - 1]
          $("##{prevIndexGroup}").after group

    group


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
    if record.isSatisfied @collection.filter
      recordView = new Tracktime.RecordView { model: record }
      $(recordView.el).insertAfter('.list-group-items-group', @listGroup(record))
      $('.btn[role="do-active"]', recordView.el).click()
      # @setSubView "record-#{record.cid}", recordView

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

