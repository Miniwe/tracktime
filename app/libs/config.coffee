process = process or window.process or {}


production =
  SERVER: 'https://ttpms.herokuapp.com'
  collection:
    records: 'records'
    projects: 'projects'
    actions: 'actions'
test =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records'
    projects: 'projects'
    actions: 'actions'
development =
  SERVER: 'http://localhost:5000'
  collection:
    records: 'records'
    projects: 'projects'
    actions: 'actions'


switch window.process.env?.NODE_ENV
  when 'production'
    config = production
  when 'test'
    config = test
  else
    config = development

(module?.exports = config) or @config = config
