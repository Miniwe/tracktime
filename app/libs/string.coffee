String::capitalizeFirstLetter = ->
  @charAt(0).toUpperCase() + @slice(1)

String::nl2br = ->
  (@ + '').replace /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2'

String::letter = ->
  @charAt(0).toUpperCase()
