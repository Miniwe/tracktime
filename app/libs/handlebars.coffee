Handlebars.registerHelper 'link_to', (options) ->
  attrs = href: ''
  for own key, value of options.hash
    if key is 'body'
      body = Handlebars.Utils.escapeExpression value
    else
      attrs[key] = Handlebars.Utils.escapeExpression value
  new (Handlebars.SafeString) $("<a />", attrs).html(body)[0].outerHTML


Handlebars.registerHelper 'safe_val', (value, safeValue) ->
  out = value || safeValue
  new Handlebars.SafeString(out)


Handlebars.registerHelper 'nl2br', (text) ->
  nl2br = (text + '').replace /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2'
  return new Handlebars.SafeString nl2br

Handlebars.registerHelper 'dateFormat', (date) ->
  date
  # timestamp = Date.parse date
  # unless _.isNaN(timestamp)
  #   (new Date(timestamp)).toLocalString()
  # else
  #   new Date()

