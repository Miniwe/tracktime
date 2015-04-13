Tracktime.initdata = {}

Tracktime.initdata.defaultActions = [
  {
    title: 'Add Record'
    type: 'AddRecord'
  }
  {
    title: 'Search'
    type: 'Search'
  }
]

Tracktime.initdata.tmpActions = [
  {
    title: 'Add record'
    formAction: '#'
    btnClass: 'btn-primary'
    navbarClass: 'navbar-material-amber'
    icon:
      className: 'mdi-editor-mode-edit'
      letter: ''
    isActive: true
    isVisible: true
  }
  {
    title: 'Search'
    formAction: '#'
    btnClass: 'btn-white'
    navbarClass: 'navbar-material-light-blue'
    icon:
      className: 'mdi-action-search'
      letter: ''
    isActive: false
    isVisible: true
    details: 'have any'
  }
  {
    title: 'Add record to project 1'
    formAction: '#'
    btnClass: 'btn-info'
    navbarClass: 'navbar-material-indogo'
    icon:
      className: 'letter'
      letter: 'P'
    isActive: false
    isVisible: true
    details: 'have any'
  }
  {
    title: 'Other wroject will be thouched'
    formAction: '#'
    btnClass: 'btn-info'
    navbarClass: 'navbar-material-indogo'
    icon:
      className: 'mdi-action-group-work'
      letter: ''
    isActive: false
    isVisible: true
  }
  {
    title: 'Add task to user'
    formAction: '#'
    btnClass: 'btn-warning'
    navbarClass: 'navbar-material-deep-purple'
    icon:
      className: 'mdi-social-person-outline'
      letter: ''
    isActive: false
    isVisible: true
  }
]

(module?.exports = Tracktime.initdata) or @Tracktime.initdata = Tracktime.initdata
