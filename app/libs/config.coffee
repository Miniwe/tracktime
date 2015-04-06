env = process?.env.NODE_ENV || 'dev'
env = 'production'

global_config =
  production:
    ROOT: 'https://ttpms.herokuapp.com'
    SERVER: 'https://ttpms.herokuapp.com'
    collection:
      records: 'records-backbone'
  dev:
    ROOT: 'http://localhost:5000'
    SERVER: 'http://localhost:5000'
    collection:
      records: 'records-backbone'

config = global_config[env]

(module?.exports = config) or @config = config
