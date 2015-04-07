process = process || {}

production =
  SERVER: 'https://ttpms.herokuapp.com'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'
development =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'

if (process.env?.NODE_ENV == 'production')
  config = production
else
  config = development

(module?.exports = config) or @config = config
