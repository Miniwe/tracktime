process = process or window.process or {}

production =
  SERVER: 'https://ttpms.herokuapp.com'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'
test =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'
development =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records-backbone'
    actions: 'actions-backbone'

if (window.process.env?.NODE_ENV == 'production')
  config = production
else if (window.process.env?.NODE_ENV == 'test')
  config = test
else
  config = development

(module?.exports = config) or @config = config
