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
  text = Handlebars.Utils.escapeExpression text
  new Handlebars.SafeString text.nl2br()

Handlebars.registerHelper 'dateFormat', (date) ->
  moment = window.moment
  localeData = moment.localeData('ru')
  moment(date).format("MMM Do YYYY")


  # timestamp = Date.parse date
  # unless _.isNaN(timestamp)
  #   (new Date(timestamp)).toLocalString()
  # else
  #   new Date()

Handlebars.registerHelper 'minuteFormat', (val) ->
  currentHour = val / 720 * 12
  hour = Math.floor(currentHour)
  minute = Math.round((currentHour - hour) * 60)
  "#{hour}:#{minute}"

Handlebars.registerHelper 'placeholder', (name) ->
  placeholder = "<placeholder id='#{name}'></placeholder>"
  new Handlebars.SafeString placeholder