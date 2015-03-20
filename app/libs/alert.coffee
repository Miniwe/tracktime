(($) ->
  snackbarOptions =
    content: ''
    style: ''
    timeout: 2000
    htmlAllowed: true

  $.extend (
    alert: (params) ->
      if _.isString params
        snackbarOptions.content = params
      else
        snackbarOptions = $.extend {},snackbarOptions,params
      $.snackbar snackbarOptions
  )
) jQuery