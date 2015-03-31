module.exports = () ->

  @use (req, res, next) ->
    err = new Error('Not Found')
    err.status = 404
    next err

  # error handlers

  # development error handler
  # will print stacktrace
  if @get('env') == 'development'
    @use (err, req, res, next) ->
      res.status(err.status or 500)
      res.render 'error',
        message: err.message
        error: err
        title: 'error'

  # production error handler
  # no stacktraces leaked to user
  @use (err, req, res, next) ->
    res.status(err.status or 500)
    res.render 'error',
      message: err.message
      error: {}
      title: 'error'
