Tracktime.utils = {}

Tracktime.utils.nl2br = (text) ->
  (text + '').replace /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2'

(module?.exports = Tracktime.utils) or @Tracktime.utils = Tracktime.utils
