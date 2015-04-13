(function() {
  var Tracktime, config, development, process, production, ref, test,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  process = process || window.process || {};

  production = {
    SERVER: 'https://ttpms.herokuapp.com',
    collection: {
      records: 'records',
      projects: 'projects',
      actions: 'actions'
    }
  };

  test = {
    SERVER: 'http://localhost:5000',
    collection: {
      records: 'records',
      projects: 'projects',
      actions: 'actions'
    }
  };

  development = {
    SERVER: 'http://localhost:5000',
    collection: {
      records: 'records',
      projects: 'projects',
      actions: 'actions'
    }
  };

  switch ((ref = window.process.env) != null ? ref.NODE_ENV : void 0) {
    case 'production':
      config = production;
      break;
    case 'test':
      config = test;
      break;
    default:
      config = development;
  }

  (typeof module !== "undefined" && module !== null ? module.exports = config : void 0) || (this.config = config);

  Tracktime = (function(superClass) {
    extend(Tracktime, superClass);

    function Tracktime() {
      return Tracktime.__super__.constructor.apply(this, arguments);
    }

    Tracktime.prototype.urlRoot = config.SERVER;

    Tracktime.prototype.defaults = {
      title: "TrackTime App - from"
    };

    Tracktime.prototype.initialize = function() {
      this.set('actions', new Tracktime.ActionsCollection());
      this.set('records', new Tracktime.RecordsCollection());
      return this.listenTo(Tracktime.AppChannel, "isOnline", this.updateApp);
    };

    Tracktime.prototype.updateApp = function() {
      return this.get('records').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
    };

    Tracktime.prototype.addRecord = function(options) {
      var error, success;
      _.extend(options, {
        date: (new Date()).toISOString()
      });
      success = (function(_this) {
        return function(result) {
          $.alert({
            content: 'save success',
            timeout: 2000,
            style: 'btn-success'
          });
          return _this.get('actions').getActive().successAdd();
        };
      })(this);
      error = (function(_this) {
        return function() {
          return $.alert('save error');
        };
      })(this);
      return this.get('records').addRecord(options, {
        success: success,
        error: error
      });
    };

    return Tracktime;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime : void 0) || (this.Tracktime = Tracktime);

  (function() {
    var proxiedSync;
    proxiedSync = Backbone.sync;
    Backbone.sync = function(method, model, options) {
      options || (options = {});
      if (!options.crossDomain) {
        options.crossDomain = true;
      }
      if (!options.xhrFields) {
        options.xhrFields = {
          withCredentials: true
        };
      }
      return proxiedSync(method, model, options);
    };
  })();

  Backbone.Validation.configure({
    selector: 'class_v',
    labelFormatter: 'label_v'
  });

  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

  Backbone.ViewMixin = {
    close: function() {
      if (this.onClose) {
        this.onClose();
      }
      this.unbind();
      this.remove();
    },
    onClose: function() {
      var key, ref1, results, view;
      ref1 = this.views;
      results = [];
      for (key in ref1) {
        if (!hasProp.call(ref1, key)) continue;
        view = ref1[key];
        results.push(view.close(key));
      }
      return results;
    },
    setSubView: function(key, view) {
      if (this.views[key]) {
        this.views[key].close();
      }
      return this.views[key] = view;
    },
    getSubView: function(key) {
      if (this.views[key]) {
        return this.views[key];
      }
    }
  };

  extend(Backbone.View.prototype, Backbone.ViewMixin);

  Handlebars.registerHelper('link_to', function(options) {
    var attrs, body, key, ref1, value;
    attrs = {
      href: ''
    };
    ref1 = options.hash;
    for (key in ref1) {
      if (!hasProp.call(ref1, key)) continue;
      value = ref1[key];
      if (key === 'body') {
        body = Handlebars.Utils.escapeExpression(value);
      } else {
        attrs[key] = Handlebars.Utils.escapeExpression(value);
      }
    }
    return new Handlebars.SafeString($("<a />", attrs).html(body)[0].outerHTML);
  });

  Handlebars.registerHelper('safe_val', function(value, safeValue) {
    var out;
    out = value || safeValue;
    return new Handlebars.SafeString(out);
  });

  Handlebars.registerHelper('nl2br', function(text) {
    var nl2br;
    nl2br = (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
    return new Handlebars.SafeString(nl2br);
  });

  Handlebars.registerHelper('dateFormat', function(date) {
    return date;
  });

  Handlebars.registerHelper('minuteFormat', function(val) {
    var currentHour, hour, minute;
    currentHour = val / 720 * 12;
    hour = Math.floor(currentHour);
    minute = Math.round((currentHour - hour) * 60);
    return hour + ":" + minute;
  });

  Tracktime.initdata = {};

  Tracktime.initdata.defaultActions = [
    {
      title: 'Add Record',
      type: 'AddRecord'
    }, {
      title: 'Search',
      type: 'Search'
    }
  ];

  Tracktime.initdata.tmpActions = [
    {
      title: 'Add record',
      formAction: '#',
      btnClass: 'btn-primary',
      navbarClass: 'navbar-material-amber',
      icon: {
        className: 'mdi-editor-mode-edit',
        letter: ''
      },
      isActive: true,
      isVisible: true
    }, {
      title: 'Search',
      formAction: '#',
      btnClass: 'btn-white',
      navbarClass: 'navbar-material-light-blue',
      icon: {
        className: 'mdi-action-search',
        letter: ''
      },
      isActive: false,
      isVisible: true,
      details: 'have any'
    }, {
      title: 'Add record to project 1',
      formAction: '#',
      btnClass: 'btn-info',
      navbarClass: 'navbar-material-indogo',
      icon: {
        className: 'letter',
        letter: 'P'
      },
      isActive: false,
      isVisible: true,
      details: 'have any'
    }, {
      title: 'Other wroject will be thouched',
      formAction: '#',
      btnClass: 'btn-info',
      navbarClass: 'navbar-material-indogo',
      icon: {
        className: 'mdi-action-group-work',
        letter: ''
      },
      isActive: false,
      isVisible: true
    }, {
      title: 'Add task to user',
      formAction: '#',
      btnClass: 'btn-warning',
      navbarClass: 'navbar-material-deep-purple',
      icon: {
        className: 'mdi-social-person-outline',
        letter: ''
      },
      isActive: false,
      isVisible: true
    }
  ];

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.initdata : void 0) || (this.Tracktime.initdata = Tracktime.initdata);

  (function($) {
    var snackbarOptions;
    snackbarOptions = {
      content: '',
      style: '',
      timeout: 2000,
      htmlAllowed: true
    };
    return $.extend({
      alert: function(params) {
        if (_.isString(params)) {
          snackbarOptions.content = params;
        } else {
          snackbarOptions = $.extend({}, snackbarOptions, params);
        }
        return $.snackbar(snackbarOptions);
      }
    });
  })(jQuery);

  Tracktime.Collection = (function(superClass) {
    extend(Collection, superClass);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.addRecord = function(params, options) {
      var newRecord;
      newRecord = new this.model(params);
      if (newRecord.isValid()) {
        this.add(newRecord);
        if (options.ajaxSync == null) {
          options.ajaxSync = Tracktime.AppChannel.request('isOnline');
        }
        return newRecord.save({}, options);
      } else {
        return $.alert('Erros validation from add record to collection');
      }
    };

    Collection.prototype.fetch = function(options) {
      var _success;
      this.resetLocalStorage();
      if ((options != null) && options.ajaxSync === true) {
        _success = options.success;
        options.success = (function(_this) {
          return function(collection, response, optionsSuccess) {
            _this.syncCollection(response);
            if (_.isFunction(_success)) {
              return _success.apply(_this, collection, response, options);
            }
          };
        })(this);
      }
      return Collection.__super__.fetch.call(this, options);
    };

    Collection.prototype.syncCollection = function(models) {
      var localModels;
      _.each(models, (function(_this) {
        return function(model) {
          var localLastAccess, localModel, modelLastAccess, record;
          record = _this.get(model._id);
          localModel = _this.localStorage.find(record);
          if (!localModel) {
            return record.save({
              ajaxSync: false
            });
          } else {
            modelLastAccess = (new Date(model.lastAccess)).getTime();
            localLastAccess = (new Date(localModel.lastAccess)).getTime();
            if (localModel.isDeleted) {
              return record.set({
                'isDeleted': true
              }, {
                trigger: false
              });
            } else if (localLastAccess < modelLastAccess) {
              return record.save(model, {
                ajaxSync: false
              });
            } else if (localLastAccess > modelLastAccess) {
              return record.save(localModel, {
                ajaxSync: true
              });
            }
          }
        };
      })(this));
      localModels = this.localStorage.findAll();
      return _.each(_.clone(localModels), (function(_this) {
        return function(model) {
          var collectionModel, destroedModel, modelLastAccess, newModel, replacedModel;
          collectionModel = _this.get(model._id);
          if (model.isDeleted) {
            if (model._id.length > 24) {
              destroedModel = new _this.model({
                _id: model._id,
                subject: 'model to delete'
              });
              return destroedModel.destroy({
                ajaxSync: false
              });
            } else {
              modelLastAccess = (new Date(model.lastAccess)).getTime();
              if ((collectionModel != null) && modelLastAccess > (new Date(collectionModel.get('lastAccess'))).getTime()) {
                destroedModel = collectionModel;
              } else {
                destroedModel = new _this.model(model);
              }
              return destroedModel.destroy({
                ajaxSync: true
              });
            }
          } else {
            if (!collectionModel) {
              replacedModel = new _this.model({
                _id: model._id
              });
              replacedModel.fetch({
                ajaxSync: false
              });
              newModel = replacedModel.toJSON();
              delete newModel._id;
              return _this.addRecord(newModel, {
                success: function(model, response) {
                  return replacedModel.destroy({
                    ajaxSync: false
                  });
                }
              });
            }
          }
        };
      })(this));
    };

    Collection.prototype.resetLocalStorage = function() {
      return this.localStorage = new Backbone.LocalStorage(this.collectionName);
    };

    return Collection;

  })(Backbone.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Collection : void 0) || (this.Tracktime.Collection = Tracktime.Collection);

  Tracktime.Model = (function(superClass) {
    extend(Model, superClass);

    function Model() {
      return Model.__super__.constructor.apply(this, arguments);
    }

    Model.prototype.sync = function(method, model, options) {
      var _model, _success;
      options = options || {};
      switch (method) {
        case 'create':
          if (options.ajaxSync) {
            _success = options.success;
            _model = model.clone();
            options.success = function(model, response) {
              options.ajaxSync = !options.ajaxSync;
              options.success = _success;
              _model.id = model._id;
              _model.set('_id', model._id);
              return Backbone.sync(method, _model, options);
            };
          }
          return Backbone.sync(method, model, options);
        case 'read':
          return Backbone.sync(method, model, options);
        case 'patch':
          return Backbone.sync(method, model, options);
        case 'update':
          if (options.ajaxSync) {
            _success = options.success;
            _model = model;
            options.success = function(model, response) {
              options.ajaxSync = !options.ajaxSync;
              options.success = _success;
              return Backbone.sync(method, _model, options);
            };
          }
          return Backbone.sync(method, model, options);
        case 'delete':
          if (options.ajaxSync === true) {
            model.save({
              'isDeleted': true
            }, {
              ajaxSync: false
            });
            _success = options.success;
            _model = model;
            options.success = function(model, response) {
              options.ajaxSync = !options.ajaxSync;
              options.success = _success;
              return Backbone.sync(method, _model, options);
            };
            return Backbone.sync(method, model, options);
          } else {
            return Backbone.sync(method, model, options);
          }
          break;
        default:
          $.alert("unknown method " + method);
          return Backbone.sync(method, model, options);
      }
    };

    return Model;

  })(Backbone.Model);

  Tracktime.utils = {};

  Tracktime.utils.nl2br = function(text) {
    return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  };

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.utils : void 0) || (this.Tracktime.utils = Tracktime.utils);

  Tracktime.Action = (function(superClass) {
    extend(Action, superClass);

    Action.prototype.idAttribute = "_id";

    Action.prototype.url = '/actions';

    Action.prototype.defaults = {
      _id: null,
      title: 'Default action',
      isActive: false,
      isVisible: false
    };

    Action.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    function Action() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      Action.__super__.constructor.apply(this, ['action constructor'].concat(slice.call(args)));
    }

    Action.prototype.setActive = function() {
      return this.collection.setActive(this);
    };

    Action.prototype.processAction = function(options) {
      return $.alert('Void Action');
    };

    return Action;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action : void 0) || (this.Tracktime.Action = Tracktime.Action);

  Tracktime.Action.Details = (function(superClass) {
    extend(Details, superClass);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    return Details;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action.Details : void 0) || (this.Tracktime.Action.Details = Tracktime.Action.Details);

  Tracktime.Action.AddRecord = (function(superClass) {
    extend(AddRecord, superClass);

    function AddRecord() {
      return AddRecord.__super__.constructor.apply(this, arguments);
    }

    AddRecord.prototype.defaults = _.extend({}, Tracktime.Action.prototype.defaults, {
      title: 'Default action title',
      inputValue: '',
      formAction: '#',
      btnClass: 'btn-primary',
      navbarClass: 'navbar-material-amber',
      icon: {
        className: 'mdi-editor-mode-edit',
        letter: ''
      },
      isActive: true,
      isVisible: true
    });

    AddRecord.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.set(options);
      return this.set('details', new Tracktime.Action.Details());
    };

    AddRecord.prototype.processAction = function(options) {
      this.set('inputValue', options.subject);
      this.get('details').set(options);
      return this.newRecord();
    };

    AddRecord.prototype.newRecord = function() {
      return Tracktime.AppChannel.command('newRecord', _.extend({
        project: 0
      }, this.get('details').attributes));
    };

    AddRecord.prototype.successAdd = function() {
      return this.set('inputValue', '');
    };

    return AddRecord;

  })(Tracktime.Action);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action.AddRecord : void 0) || (this.Tracktime.Action.AddRecord = Tracktime.Action.AddRecord);

  Tracktime.Action.Search = (function(superClass) {
    extend(Search, superClass);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.defaults = _.extend({}, Tracktime.Action.prototype.defaults, {
      title: 'Search',
      inputValue: '',
      formAction: '#',
      btnClass: 'btn-white',
      navbarClass: 'navbar-material-light-blue',
      icon: {
        className: 'mdi-action-search',
        letter: ''
      },
      isActive: false,
      isVisible: true
    });

    Search.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      this.set(options);
      return this.set('details', new Tracktime.Action.Details());
    };

    Search.prototype.processAction = function(options) {
      this.set('inputValue', options.subject);
      this.get('details').set(options);
      return this.search();
    };

    Search.prototype.search = function() {
      return $.alert('search start');
    };

    return Search;

  })(Tracktime.Action);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action.Search : void 0) || (this.Tracktime.Action.Search = Tracktime.Action.Search);

  Tracktime.Project = (function(superClass) {
    extend(Project, superClass);

    function Project() {
      return Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.idAttribute = "_id";

    Project.prototype.urlRoot = config.SERVER + '/projects';

    Project.prototype.localStorage = new Backbone.LocalStorage(config.collection.projects);

    Project.prototype.defaults = {
      _id: null,
      name: '',
      description: '',
      lastAccess: (new Date()).toISOString(),
      isDeleted: false
    };

    Project.prototype.validation = {
      name: {
        required: true,
        minLength: 4,
        msg: 'Please enter a valid name'
      }
    };

    Project.prototype.initialize = function(options, params, any) {
      return this.listenTo(this, 'change:name', this.updateLastAccess);
    };

    Project.prototype.isValid = function() {
      return true;
    };

    Project.prototype.updateLastAccess = function() {
      return this.set('lastAccess', (new Date()).toISOString());
    };

    return Project;

  })(Tracktime.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Project : void 0) || (this.Tracktime.Project = Tracktime.Project);

  Tracktime.Record = (function(superClass) {
    extend(Record, superClass);

    function Record() {
      return Record.__super__.constructor.apply(this, arguments);
    }

    Record.prototype.idAttribute = "_id";

    Record.prototype.urlRoot = config.SERVER + '/records';

    Record.prototype.localStorage = new Backbone.LocalStorage(config.collection.records);

    Record.prototype.defaults = {
      _id: null,
      subject: '',
      description: '',
      date: function() {
        return (new Date()).toISOString();
      },
      lastAccess: (new Date()).toISOString(),
      recordDate: '',
      recordTime: 0,
      project: 0,
      isDeleted: false
    };

    Record.prototype.validation = {
      subject: {
        required: true,
        minLength: 4,
        msg: 'Please enter a valid subject'
      }
    };

    Record.prototype.initialize = function(options, params, any) {
      return this.listenTo(this, 'change:subject', this.updateLastAccess);
    };

    Record.prototype.isValid = function() {
      return true;
    };

    Record.prototype.updateLastAccess = function() {
      return this.set('lastAccess', (new Date()).toISOString());
    };

    return Record;

  })(Tracktime.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Record : void 0) || (this.Tracktime.Record = Tracktime.Record);

  Tracktime.ActionsCollection = (function(superClass) {
    extend(ActionsCollection, superClass);

    function ActionsCollection() {
      return ActionsCollection.__super__.constructor.apply(this, arguments);
    }

    ActionsCollection.prototype.model = Tracktime.Action;

    ActionsCollection.prototype.defaultActions = Tracktime.initdata.defaultActions;

    ActionsCollection.prototype.url = '/actions';

    ActionsCollection.prototype.localStorage = new Backbone.LocalStorage('records-backbone');

    ActionsCollection.prototype.active = null;

    ActionsCollection.prototype.initialize = function() {
      return _.each(this.defaultActions, (function(_this) {
        return function(action) {
          var actionModel;
          if (Tracktime.Action[action.type]) {
            actionModel = new Tracktime.Action[action.type](action);
            return _this.push(actionModel);
          }
        };
      })(this));
    };

    ActionsCollection.prototype.setActive = function(active) {
      var ref1;
      if ((ref1 = this.active) != null) {
        ref1.set('isActive', false);
      }
      active.set('isActive', true);
      return this.active = active;
    };

    ActionsCollection.prototype.getActive = function() {
      return this.active;
    };

    ActionsCollection.prototype.getVisible = function() {
      return _.filter(this.models, function(model) {
        return model.get('isVisible');
      });
    };

    return ActionsCollection;

  })(Backbone.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionsCollection : void 0) || (this.Tracktime.ActionsCollection = Tracktime.ActionsCollection);

  Tracktime.ProjectsCollection = (function(superClass) {
    extend(ProjectsCollection, superClass);

    function ProjectsCollection() {
      return ProjectsCollection.__super__.constructor.apply(this, arguments);
    }

    ProjectsCollection.prototype.model = Tracktime.Project;

    ProjectsCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/projects';

    ProjectsCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/projects';

    ProjectsCollection.prototype.collectionName = config.collection.projects;

    ProjectsCollection.prototype.localStorage = new Backbone.LocalStorage(ProjectsCollection.collectionName);

    ProjectsCollection.prototype.initialize = function() {
      return this.fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
    };

    ProjectsCollection.prototype.comparator = function(model) {
      return -(new Date(model.get('date'))).getTime();
    };

    return ProjectsCollection;

  })(Tracktime.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ProjectsCollection : void 0) || (this.Tracktime.ProjectsCollection = Tracktime.ProjectsCollection);

  Tracktime.RecordsCollection = (function(superClass) {
    extend(RecordsCollection, superClass);

    function RecordsCollection() {
      return RecordsCollection.__super__.constructor.apply(this, arguments);
    }

    RecordsCollection.prototype.model = Tracktime.Record;

    RecordsCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/records';

    RecordsCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/records';

    RecordsCollection.prototype.collectionName = config.collection.records;

    RecordsCollection.prototype.localStorage = new Backbone.LocalStorage(RecordsCollection.collectionName);

    RecordsCollection.prototype.initialize = function() {
      return this.fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
    };

    RecordsCollection.prototype.comparator = function(model) {
      return -(new Date(model.get('date'))).getTime();
    };

    return RecordsCollection;

  })(Tracktime.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.RecordsCollection : void 0) || (this.Tracktime.RecordsCollection = Tracktime.RecordsCollection);

  Tracktime.AppChannel = Backbone.Radio.channel('app');

  _.extend(Tracktime.AppChannel, {
    isOnline: null,
    init: function() {
      this.listenTo(this, 'isOnline', (function(_this) {
        return function(status) {
          return _this.isOnline = status;
        };
      })(this));
      this.checkOnline();
      this.setWindowListeners();
      this.model = new Tracktime();
      this.bindComply();
      this.bindRequest();
      return this;
    },
    checkOnline: function() {
      if (window.navigator.onLine === true) {
        return this.checkServer();
      } else {
        return this.trigger('isOnline', false);
      }
    },
    checkServer: function() {
      var deferred, errorCallback, exception_var, serverOnlineCallback, successCallback;
      deferred = $.Deferred();
      serverOnlineCallback = (function(_this) {
        return function(status) {
          return _this.trigger('isOnline', true);
        };
      })(this);
      successCallback = (function(_this) {
        return function(result) {
          _this.trigger('isOnline', true);
          return deferred.resolve();
        };
      })(this);
      errorCallback = (function(_this) {
        return function(jqXHR, textStatus, errorThrown) {
          _this.trigger('isOnline', false);
          return deferred.resolve();
        };
      })(this);
      try {
        $.ajax({
          url: config.SERVER + "/status",
          async: false,
          dataType: 'jsonp',
          jsonpCallback: 'serverOnlineCallback',
          success: successCallback,
          error: errorCallback
        });
      } catch (_error) {
        exception_var = _error;
        this.trigger('isOnline', false);
      }
      return deferred.promise();
    },
    setWindowListeners: function() {
      window.addEventListener("offline", (function(_this) {
        return function(e) {
          return _this.trigger('isOnline', false);
        };
      })(this), false);
      return window.addEventListener("online", (function(_this) {
        return function(e) {
          return _this.checkServer();
        };
      })(this), false);
    },
    bindComply: function() {
      return this.comply({
        'start': this.startApp,
        'newRecord': this.newRecord,
        'serverOnline': this.serverOnline,
        'serverOffline': this.serverOffline,
        'checkOnline': this.checkOnline
      });
    },
    bindRequest: function() {
      return this.reply('isOnline', (function(_this) {
        return function() {
          return _this.isOnline;
        };
      })(this));
    },
    startApp: function() {
      this.router = new Tracktime.AppRouter({
        model: this.model
      });
      return Backbone.history.start({
        pushState: false
      });
    },
    newRecord: function(options) {
      return this.model.addRecord(options);
    },
    serverOnline: function() {
      return this.trigger('isOnline', true);
    },
    serverOffline: function() {
      return this.trigger('isOnline', false);
    }
  });

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppChannel : void 0) || (this.Tracktime.AppChannel = Tracktime.AppChannel);

  $(function() {
    Tracktime.AppChannel.init().command('start');
  });

  Tracktime.AdminRouter = (function(superClass) {
    extend(AdminRouter, superClass);

    function AdminRouter() {
      return AdminRouter.__super__.constructor.apply(this, arguments);
    }

    AdminRouter.prototype.routes = {
      '': 'dashboard',
      'users': 'users',
      'projects': 'projects',
      'dashboard': 'dashboard',
      'actions': 'actions'
    };

    AdminRouter.prototype.initialize = function(options) {
      return _.extend(this, options);
    };

    AdminRouter.prototype.dashboard = function() {
      return this.parent.view.setSubView('main', new Tracktime.AdminView.Dashboard());
    };

    AdminRouter.prototype.users = function() {
      return this.parent.view.setSubView('main', new Tracktime.AdminView.Users());
    };

    AdminRouter.prototype.projects = function() {
      return this.parent.view.setSubView('main', new Tracktime.AdminView.Projects());
    };

    AdminRouter.prototype.actions = function() {
      return this.parent.view.setSubView('main', new Tracktime.AdminView.Actions());
    };

    return AdminRouter;

  })(Backbone.SubRoute);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminRouter : void 0) || (this.Tracktime.AdminRouter = Tracktime.AdminRouter);

  Tracktime.AppRouter = (function(superClass) {
    extend(AppRouter, superClass);

    function AppRouter() {
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      '': 'index',
      'projects*subroute': 'invokeProjectsRouter',
      'reports*subroute': 'invokeReportsRouter',
      'user*subroute': 'invokeUserRouter',
      'admin*subroute': 'invokeAdminRouter',
      '*actions': 'default'
    };

    AppRouter.prototype.initialize = function(options) {
      _.extend(this, options);
      return this.initAuthInterface();
    };

    AppRouter.prototype.invokeProjectsRouter = function(subroute) {
      if (!this.projectsRouter) {
        return this.projectsRouter = new Tracktime.ProjectsRouter('projects', {
          parent: this
        });
      }
    };

    AppRouter.prototype.invokeReportsRouter = function(subroute) {
      if (!this.reportsRouter) {
        return this.reportsRouter = new Tracktime.ReportsRouter('reports', {
          parent: this
        });
      }
    };

    AppRouter.prototype.invokeUserRouter = function(subroute) {
      if (!this.userRouter) {
        return this.userRouter = new Tracktime.UserRouter('user', {
          parent: this
        });
      }
    };

    AppRouter.prototype.invokeAdminRouter = function(subroute) {
      if (!this.adminRouter) {
        return this.adminRouter = new Tracktime.AdminRouter('admin', {
          parent: this
        });
      }
    };

    AppRouter.prototype.initAuthInterface = function() {
      this.view = new Tracktime.AppView({
        model: this.model
      });
      this.view.setSubView('header', new Tracktime.AppView.Header({
        model: this.model
      }));
      this.view.setSubView('footer', new Tracktime.AppView.Footer());
      this.view.setSubView('menu', new Tracktime.AppView.Menu({
        model: this.model
      }));
      return this.view.initUI();
    };

    AppRouter.prototype.index = function() {
      return this.navigate('projects', {
        trigger: true,
        replace: false
      });
    };

    AppRouter.prototype["default"] = function(actions) {
      $.alert('Unknown page');
      return this.navigate('', true);
    };

    return AppRouter;

  })(Backbone.Router);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppRouter : void 0) || (this.Tracktime.AppRouter = Tracktime.AppRouter);

  Tracktime.ProjectsRouter = (function(superClass) {
    extend(ProjectsRouter, superClass);

    function ProjectsRouter() {
      return ProjectsRouter.__super__.constructor.apply(this, arguments);
    }

    ProjectsRouter.prototype.routes = {
      '': 'list',
      ':id': 'details',
      ':id/edit': 'edit',
      ':id/delete': 'delete',
      ':id/add': 'add',
      ':id/save': 'save'
    };

    ProjectsRouter.prototype.initialize = function(options) {
      return _.extend(this, options);
    };

    ProjectsRouter.prototype.list = function() {
      $.alert("whole records list in projects section");
      return this.parent.view.setSubView('main', new Tracktime.RecordsView({
        collection: this.parent.model.get('records')
      }));
    };

    ProjectsRouter.prototype.details = function(id) {
      return this.parent.view.setSubView('main', new Tracktime.RecordsView({
        collection: this.parent.model.get('records')
      }));
    };

    ProjectsRouter.prototype.edit = function(id) {
      return $.alert("projects edit " + id);
    };

    ProjectsRouter.prototype["delete"] = function(id) {
      return $.alert("projects delete " + id);
    };

    ProjectsRouter.prototype.add = function(id) {
      return $.alert("projects add " + id);
    };

    ProjectsRouter.prototype.save = function(id) {
      return $.alert("projects save " + id);
    };

    return ProjectsRouter;

  })(Backbone.SubRoute);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ProjectsRouter : void 0) || (this.Tracktime.ProjectsRouter = Tracktime.ProjectsRouter);

  Tracktime.RecordsRouter = (function(superClass) {
    extend(RecordsRouter, superClass);

    function RecordsRouter() {
      return RecordsRouter.__super__.constructor.apply(this, arguments);
    }

    RecordsRouter.prototype.routes = {
      '': 'list',
      ':id': 'details',
      ':id/edit': 'edit',
      ':id/delete': 'delete',
      ':id/add': 'add',
      ':id/save': 'save'
    };

    RecordsRouter.prototype.initialize = function(options) {
      return _.extend(this, options);
    };

    RecordsRouter.prototype.list = function() {
      return $.alert("records list");
    };

    RecordsRouter.prototype.details = function(id) {
      return $.alert("records detaids " + id);
    };

    RecordsRouter.prototype.edit = function(id) {
      return $.alert("records edit " + id);
    };

    RecordsRouter.prototype["delete"] = function(id) {
      return $.alert("records delete " + id);
    };

    RecordsRouter.prototype.add = function(id) {
      return $.alert("records add " + id);
    };

    RecordsRouter.prototype.save = function(id) {
      return $.alert("records save " + id);
    };

    return RecordsRouter;

  })(Backbone.Router);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.RecordsRouter : void 0) || (this.Tracktime.RecordsRouter = Tracktime.RecordsRouter);

  Tracktime.ReportsRouter = (function(superClass) {
    extend(ReportsRouter, superClass);

    function ReportsRouter() {
      return ReportsRouter.__super__.constructor.apply(this, arguments);
    }

    ReportsRouter.prototype.routes = {
      '': 'list',
      ':id': 'details',
      ':id/edit': 'edit',
      ':id/delete': 'delete',
      ':id/add': 'add',
      ':id/save': 'save'
    };

    ReportsRouter.prototype.initialize = function(options) {
      _.extend(this, options);
      return this.parent.view.setSubView('main', new Tracktime.ReportsView());
    };

    ReportsRouter.prototype.list = function() {
      return this.parent.view.setSubView('main', new Tracktime.ReportsView());
    };

    ReportsRouter.prototype.details = function(id) {
      return this.parent.view.setSubView('main', new Tracktime.ReportView());
    };

    ReportsRouter.prototype.edit = function(id) {
      return $.alert("reports edit " + id);
    };

    ReportsRouter.prototype["delete"] = function(id) {
      return $.alert("reports delete " + id);
    };

    ReportsRouter.prototype.add = function(id) {
      return $.alert("reports add " + id);
    };

    ReportsRouter.prototype.save = function(id) {
      return $.alert("reports save " + id);
    };

    return ReportsRouter;

  })(Backbone.SubRoute);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ReportsRouter : void 0) || (this.Tracktime.ReportsRouter = Tracktime.ReportsRouter);

  Tracktime.UserRouter = (function(superClass) {
    extend(UserRouter, superClass);

    function UserRouter() {
      return UserRouter.__super__.constructor.apply(this, arguments);
    }

    UserRouter.prototype.routes = {
      '': 'details',
      'rates': 'rates',
      'logout': 'logout'
    };

    UserRouter.prototype.initialize = function(options) {
      return _.extend(this, options);
    };

    UserRouter.prototype.details = function() {
      return this.parent.view.setSubView('main', new Tracktime.UserView.Details());
    };

    UserRouter.prototype.rates = function() {
      return this.parent.view.setSubView('main', new Tracktime.UserView.Rates());
    };

    UserRouter.prototype.logout = function() {
      return $.alert("user logout process");
    };

    return UserRouter;

  })(Backbone.SubRoute);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.UserRouter : void 0) || (this.Tracktime.UserRouter = Tracktime.UserRouter);

  Tracktime.ActionView = (function(superClass) {
    extend(ActionView, superClass);

    function ActionView() {
      return ActionView.__super__.constructor.apply(this, arguments);
    }

    ActionView.prototype.tagName = 'li';

    ActionView.prototype.className = 'btn';

    ActionView.prototype.events = {
      'click a': 'setActive'
    };

    ActionView.prototype.initialize = function() {};

    ActionView.prototype.setActive = function() {
      return this.model.setActive();
    };

    return ActionView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView : void 0) || (this.Tracktime.ActionView = Tracktime.ActionView);

  Tracktime.ActionsView = (function(superClass) {
    extend(ActionsView, superClass);

    function ActionsView() {
      return ActionsView.__super__.constructor.apply(this, arguments);
    }

    ActionsView.prototype.el = '#actions-form';

    ActionsView.prototype.className = 'actions-group';

    ActionsView.prototype.template = JST['layout/header/actions'];

    ActionsView.prototype.initialize = function(options) {
      _.extend(this, options);
      return this.render();
    };

    ActionsView.prototype.render = function() {
      var dropdown, ul;
      this.$el.html(this.template());
      dropdown = $('.select-action-type-dropdown', this.$el);
      ul = dropdown.find('.dropdown-menu');
      return _.each(this.collection.getVisible(), function(action) {
        var listBtn;
        listBtn = new Tracktime.ActionView.ListBtn({
          model: action,
          container: dropdown
        });
        ul.append(listBtn.$el);
        if (action.get('isActive')) {
          return $(listBtn.$el).click();
        }
      });
    };

    return ActionsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionsView : void 0) || (this.Tracktime.ActionsView = Tracktime.ActionsView);

  Tracktime.ActionView.ActiveBtn = (function(superClass) {
    extend(ActiveBtn, superClass);

    function ActiveBtn() {
      return ActiveBtn.__super__.constructor.apply(this, arguments);
    }

    ActiveBtn.prototype.el = '#action_type';

    ActiveBtn.prototype.initialize = function() {
      return this.render();
    };

    ActiveBtn.prototype.render = function() {
      return this.$el.attr('class', "btn btn-fab " + (this.model.get('btnClass')) + " dropdown-toggle ").find('i').attr('class', this.model.get('icon').className).html(this.model.get('icon').letter);
    };

    return ActiveBtn;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.ActiveBtn : void 0) || (this.Tracktime.ActionView.ActiveBtn = Tracktime.ActionView.ActiveBtn);

  Tracktime.ActionView.DetailsBtn = (function(superClass) {
    extend(DetailsBtn, superClass);

    function DetailsBtn() {
      return DetailsBtn.__super__.constructor.apply(this, arguments);
    }

    DetailsBtn.prototype.el = '#detailsNew';

    DetailsBtn.prototype.template = JST['blocks/action'];

    DetailsBtn.prototype.initialize = function() {
      return this.$el.popover({
        template: this.template(this.model.toJSON())
      });
    };

    DetailsBtn.prototype.remove = function() {
      return this.$el.popover('destroy');
    };

    return DetailsBtn;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.DetailsBtn : void 0) || (this.Tracktime.ActionView.DetailsBtn = Tracktime.ActionView.DetailsBtn);

  Tracktime.ActionView.ListBtn = (function(superClass) {
    extend(ListBtn, superClass);

    function ListBtn() {
      return ListBtn.__super__.constructor.apply(this, arguments);
    }

    ListBtn.prototype.tagName = 'li';

    ListBtn.prototype.template = JST['layout/header/listbtn'];

    ListBtn.prototype.events = {
      'click': 'actionActive'
    };

    ListBtn.prototype.initialize = function(options) {
      _.extend(this, options);
      this.render();
      this.listenTo(this.model, 'change:isActive', this.updateHeader);
      return this.listenTo(this.model, 'change:inputValue', this.setInputVal);
    };

    ListBtn.prototype.render = function() {
      this.$el.toggleClass('active', this.model.get('isActive'));
      return this.$el.html(this.template(this.model.toJSON()));
    };

    ListBtn.prototype.actionActive = function() {
      this.updateHeader();
      return this.model.setActive();
    };

    ListBtn.prototype.updateHeader = function() {
      this.$el.siblings().removeClass('active');
      this.$el.addClass('active');
      this.container.find("#action_type").replaceWith((new Tracktime.ActionView.ActiveBtn({
        model: this.model
      })).$el);
      this.container.parent().find("#detailsNew").popover('destroy');
      if (this.model.get('details') !== null) {
        this.container.parent().find("#detailsNew").show().replaceWith((new Tracktime.ActionView.DetailsBtn({
          model: this.model
        })).el);
      } else {
        this.container.parent().find("#detailsNew").hide();
      }
      $('.floating-label', '#actions-form').html(this.model.get('title'));
      this.container.parents('.navbar').attr('class', "navbar " + (this.model.get('navbarClass')) + " shadow-z-1");
      return this.setInputVal();
    };

    ListBtn.prototype.setInputVal = function() {
      var ref1;
      return (ref1 = $('textarea', '#actions-form')) != null ? ref1.val(this.model.get('inputValue')).focus() : void 0;
    };

    return ListBtn;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.ListBtn : void 0) || (this.Tracktime.ActionView.ListBtn = Tracktime.ActionView.ListBtn);

  Tracktime.AdminView = (function(superClass) {
    extend(AdminView, superClass);

    function AdminView() {
      return AdminView.__super__.constructor.apply(this, arguments);
    }

    AdminView.prototype.el = '#panel';

    AdminView.prototype.className = '';

    AdminView.prototype.template = JST['admin/index'];

    AdminView.prototype.views = {};

    AdminView.prototype.initialize = function() {
      return this.render();
    };

    AdminView.prototype.render = function() {
      return this.$el.html(this.template());
    };

    AdminView.prototype.initUI = function() {
      return $.material.init();
    };

    return AdminView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView : void 0) || (this.Tracktime.AdminView = Tracktime.AdminView);

  Tracktime.AdminView.Header = (function(superClass) {
    extend(Header, superClass);

    function Header() {
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.container = '#header';

    Header.prototype.template = JST['admin/layout/header'];

    Header.prototype.initialize = function(options) {
      return this.render();
    };

    Header.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template()));
    };

    return Header;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.Header : void 0) || (this.Tracktime.AdminView.Header = Tracktime.AdminView.Header);

  Tracktime.AdminView.Actions = (function(superClass) {
    extend(Actions, superClass);

    function Actions() {
      return Actions.__super__.constructor.apply(this, arguments);
    }

    Actions.prototype.container = '#main';

    Actions.prototype.template = JST['admin/actions'];

    Actions.prototype.initialize = function() {
      return this.render();
    };

    Actions.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'Actions'
      })));
    };

    return Actions;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.Actions : void 0) || (this.Tracktime.AdminView.Actions = Tracktime.AdminView.Actions);

  Tracktime.AdminView.Dashboard = (function(superClass) {
    extend(Dashboard, superClass);

    function Dashboard() {
      return Dashboard.__super__.constructor.apply(this, arguments);
    }

    Dashboard.prototype.container = '#main';

    Dashboard.prototype.template = JST['admin/dashboard'];

    Dashboard.prototype.initialize = function() {
      return this.render();
    };

    Dashboard.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template()));
    };

    return Dashboard;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.Dashboard : void 0) || (this.Tracktime.AdminView.Dashboard = Tracktime.AdminView.Dashboard);

  Tracktime.AdminView.Projects = (function(superClass) {
    extend(Projects, superClass);

    function Projects() {
      return Projects.__super__.constructor.apply(this, arguments);
    }

    Projects.prototype.container = '#main';

    Projects.prototype.template = JST['admin/projects'];

    Projects.prototype.initialize = function() {
      return this.render();
    };

    Projects.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'Projects'
      })));
    };

    return Projects;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.Projects : void 0) || (this.Tracktime.AdminView.Projects = Tracktime.AdminView.Projects);

  Tracktime.AdminView.Users = (function(superClass) {
    extend(Users, superClass);

    function Users() {
      return Users.__super__.constructor.apply(this, arguments);
    }

    Users.prototype.container = '#main';

    Users.prototype.template = JST['admin/users'];

    Users.prototype.initialize = function() {
      return this.render();
    };

    Users.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template()));
    };

    return Users;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.Users : void 0) || (this.Tracktime.AdminView.Users = Tracktime.AdminView.Users);

  Tracktime.AppView = (function(superClass) {
    extend(AppView, superClass);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = '#panel';

    AppView.prototype.className = '';

    AppView.prototype.template = JST['global/app'];

    AppView.prototype.views = {};

    AppView.prototype.initialize = function() {
      return this.render();
    };

    AppView.prototype.render = function() {
      return this.$el.html(this.template(this.model.toJSON()));
    };

    AppView.prototype.initUI = function() {
      return $.material.init();
    };

    return AppView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView : void 0) || (this.Tracktime.AppView = Tracktime.AppView);

  Tracktime.AppView.Footer = (function(superClass) {
    extend(Footer, superClass);

    function Footer() {
      return Footer.__super__.constructor.apply(this, arguments);
    }

    Footer.prototype.container = '#footer';

    Footer.prototype.template = JST['layout/footer'];

    Footer.prototype.events = {
      'click #click-me': 'clickMe',
      'click #window-close': 'windowClose'
    };

    Footer.prototype.initialize = function() {
      return this.render();
    };

    Footer.prototype.render = function() {
      var ref1;
      return $(this.container).html(this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0)));
    };

    Footer.prototype.clickMe = function(event) {
      event.preventDefault();
      return $.alert('Subview :: ' + $(event.target).attr('href'));
    };

    Footer.prototype.windowClose = function(event) {
      event.preventDefault();
      $.alert('Close window');
      return window.close();
    };

    return Footer;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Footer : void 0) || (this.Tracktime.AppView.Footer = Tracktime.AppView.Footer);

  Tracktime.AppView.Header = (function(superClass) {
    extend(Header, superClass);

    function Header() {
      this.checkContent = bind(this.checkContent, this);
      this.sendForm = bind(this.sendForm, this);
      this.fixEnter = bind(this.fixEnter, this);
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.container = '#header';

    Header.prototype.template = JST['layout/header'];

    Header.prototype.views = {};

    Header.prototype.tmpDetails = {};

    Header.prototype.initialize = function(options) {
      this.options = options;
      this.render();
      return this.initUI();
    };

    Header.prototype.initUI = function() {
      $('[data-toggle="tooltip"]', this.$el).tooltip();
      $('textarea', this.el).on('keydown', this.fixEnter).on('change, keyup', this.checkContent).textareaAutoSize();
      $('#send-form').on('click', this.sendForm);
      this.tmpDetails.recordDate = $(".select-date > .btn .caption ruby rt").html();
      $(".select-date .dropdown-menu").on('click', '.btn', (function(_this) {
        return function(event) {
          event.preventDefault();
          $(".select-date > .btn .caption ruby").html($(event.currentTarget).find('ruby').html());
          return _this.tmpDetails.recordDate = $(".select-date > .btn .caption ruby rt").html();
        };
      })(this));
      $(".slider").noUiSlider({
        start: [0],
        step: 5,
        range: {
          'min': [0],
          'max': [720]
        }
      }).on({
        slide: (function(_this) {
          return function(event, val) {
            var currentHour, hour, minute;
            _this.tmpDetails.recordTime = val;
            currentHour = val / 720 * 12;
            hour = Math.floor(currentHour);
            minute = (currentHour - hour) * 60;
            $('.slider .noUi-handle').attr('data-before', hour);
            return $('.slider .noUi-handle').attr('data-after', Math.round(minute));
          };
        })(this)
      });
      return $(".slider").noUiSlider_pips({
        mode: 'values',
        values: [0, 60 * 1, 60 * 2, 60 * 3, 60 * 4, 60 * 5, 60 * 6, 60 * 7, 60 * 8, 60 * 9, 60 * 10, 60 * 11, 60 * 12],
        density: 2,
        format: {
          to: function(value) {
            return value / 60;
          },
          from: function(value) {
            return value;
          }
        }
      });
    };

    Header.prototype.render = function() {
      var ref1;
      $(this.container).html(this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0)));
      return this.views['actions'] = new Tracktime.ActionsView({
        collection: this.model.get('actions')
      });
    };

    Header.prototype.fixEnter = function(event) {
      if (event.keyCode === 13) {
        if (event.shiftKey) {
          event.preventDefault();
          this.tmpDetails.subject = $('textarea', this.el).val();
          return this.actionSubmit();
        }
      }
    };

    Header.prototype.sendForm = function(event) {
      event.preventDefault();
      this.tmpDetails.subject = $('textarea', this.el).val();
      this.actionSubmit();
      return this.checkContent();
    };

    Header.prototype.actionSubmit = function(val) {
      if (!_.isEmpty(this.tmpDetails.subject)) {
        $('textarea', this.el).val('');
        return this.model.get('actions').getActive().processAction(this.tmpDetails);
      }
    };

    Header.prototype.checkContent = function() {
      return window.setTimeout((function(_this) {
        return function() {
          var diff;
          diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true);
          $('#actions-form').toggleClass("shadow-z-2", diff > 10);
          return $(".controls-container").toggleClass('hidden', _.isEmpty($('textarea').val()));
        };
      })(this), 500);
    };

    return Header;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Header : void 0) || (this.Tracktime.AppView.Header = Tracktime.AppView.Header);

  Tracktime.AppView.Main = (function(superClass) {
    extend(Main, superClass);

    function Main() {
      return Main.__super__.constructor.apply(this, arguments);
    }

    Main.prototype.container = '#main';

    Main.prototype.template = JST['layout/main'];

    Main.prototype.views = {};

    Main.prototype.initialize = function() {
      this.render();
      return this.bindEvents();
    };

    Main.prototype.render = function() {
      var ref1;
      $(this.container).html(this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0)));
      return this.renderRecords();
    };

    Main.prototype.bindEvents = function() {
      return this.listenTo(this.model.get('records'), "reset", this.renderRecords);
    };

    Main.prototype.renderRecords = function() {
      var recordsView;
      recordsView = new Tracktime.RecordsView({
        collection: this.model.get('records')
      });
      return this.$el.html(recordsView.el);
    };

    return Main;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Main : void 0) || (this.Tracktime.AppView.Main = Tracktime.AppView.Main);

  Tracktime.AppView.Menu = (function(superClass) {
    extend(Menu, superClass);

    function Menu() {
      return Menu.__super__.constructor.apply(this, arguments);
    }

    Menu.prototype.container = '#menu';

    Menu.prototype.template = JST['layout/menu'];

    Menu.prototype.events = {
      'change #isOnline': 'updateOnlineStatus'
    };

    Menu.prototype.initialize = function() {
      this.render();
      return this.bindEvents();
    };

    Menu.prototype.bindEvents = function() {
      var slideout;
      this.listenTo(Tracktime.AppChannel, "isOnline", function(status) {
        return $('#isOnline').prop('checked', status);
      });
      slideout = new Slideout({
        'panel': $('#panel')[0],
        'menu': $('#menu')[0],
        'padding': 256,
        'tolerance': 70
      });
      return $("#menuToggler").on('click', function() {
        return slideout.toggle();
      });
    };

    Menu.prototype.updateOnlineStatus = function(event) {
      if ($(event.target).is(":checked")) {
        return Tracktime.AppChannel.command('checkOnline');
      } else {
        return Tracktime.AppChannel.command('serverOffline');
      }
    };

    Menu.prototype.render = function() {
      var ref1;
      return $(this.container).html(this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0)));
    };

    return Menu;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Menu : void 0) || (this.Tracktime.AppView.Menu = Tracktime.AppView.Menu);

  Tracktime.ProjectView = (function(superClass) {
    extend(ProjectView, superClass);

    function ProjectView() {
      return ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.container = '#main';

    ProjectView.prototype.template = JST['projects/project'];

    ProjectView.prototype.initialize = function() {
      return this.render();
    };

    ProjectView.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'Project Details HERE'
      })));
    };

    return ProjectView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ProjectView : void 0) || (this.Tracktime.ProjectView = Tracktime.ProjectView);

  Tracktime.ProjectsView = (function(superClass) {
    extend(ProjectsView, superClass);

    function ProjectsView() {
      return ProjectsView.__super__.constructor.apply(this, arguments);
    }

    ProjectsView.prototype.container = '#main';

    ProjectsView.prototype.template = JST['projecs/projecs'];

    ProjectsView.prototype.initialize = function() {
      return this.render();
    };

    ProjectsView.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'Projects HERE'
      })));
    };

    return ProjectsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ProjectsView : void 0) || (this.Tracktime.ProjectsView = Tracktime.ProjectsView);

  Tracktime.RecordView = (function(superClass) {
    extend(RecordView, superClass);

    function RecordView() {
      this.fixEnter = bind(this.fixEnter, this);
      return RecordView.__super__.constructor.apply(this, arguments);
    }

    RecordView.prototype.tagName = 'li';

    RecordView.prototype.className = 'records-group-item shadow-z-1';

    RecordView.prototype.template = JST['records/record'];

    RecordView.prototype.events = {
      'click .btn.delete': "deleteRecord",
      'click .subject': "toggleEdit"
    };

    RecordView.prototype.initialize = function() {
      if (!this.model.get('isDeleted')) {
        this.render();
      }
      this.listenTo(this.model, "change:isDeleted", this.change_isDeleted);
      return this.listenTo(this.model, "change:subject", this.change_subject);
    };

    RecordView.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    RecordView.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      return $('.subject_edit', this.$el).on('keydown', this.fixEnter).textareaAutoSize();
    };

    RecordView.prototype.change_isDeleted = function() {
      return this.$el.remove();
    };

    RecordView.prototype.change_subject = function() {
      $('.subject', this.$el).html(Tracktime.utils.nl2br(this.model.get('subject')));
      return $('.subject_edit', this.$el).val(this.model.get('subject'));
    };

    RecordView.prototype.fixEnter = function(event) {
      var val;
      if (event.keyCode === 13) {
        if (event.shiftKey) {
          val = $(event.target).val();
          if (!_.isEmpty(val)) {
            this.model.set('subject', val);
            this.saveRecord();
            this.toggleEdit();
          }
          return event.preventDefault();
        }
      }
    };

    RecordView.prototype.toggleEdit = function(event) {
      this.$el.find('.subject_edit').css('min-height', this.$el.find('.subject').height());
      return this.$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass('hidden');
    };

    RecordView.prototype.saveRecord = function() {
      return this.model.save({}, {
        ajaxSync: Tracktime.AppChannel.request('isOnline'),
        success: function(model, respond) {
          return $.alert({
            content: 'update record',
            timeout: 2000,
            style: 'btn-info'
          });
        }
      });
    };

    RecordView.prototype.deleteRecord = function(event) {
      event.preventDefault();
      return this.model.destroy({
        ajaxSync: Tracktime.AppChannel.request('isOnline'),
        success: function(model, respond) {
          return $.alert({
            content: 'delete record',
            timeout: 2000,
            style: 'btn-danger'
          });
        }
      });
    };

    return RecordView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.RecordView : void 0) || (this.Tracktime.RecordView = Tracktime.RecordView);

  Tracktime.RecordsView = (function(superClass) {
    extend(RecordsView, superClass);

    function RecordsView() {
      return RecordsView.__super__.constructor.apply(this, arguments);
    }

    RecordsView.prototype.container = '#main';

    RecordsView.prototype.tagName = 'ul';

    RecordsView.prototype.className = 'records-group';

    RecordsView.prototype.initialize = function() {
      this.views = {};
      this.render();
      this.listenTo(this.collection, "reset", this.resetRecordsList);
      this.listenTo(this.collection, "add", this.addRecord);
      return this.listenTo(this.collection, "remove", this.removeRecord);
    };

    RecordsView.prototype.render = function() {
      $(this.container).html(this.$el.html(''));
      return this.resetRecordsList();
    };

    RecordsView.prototype.resetRecordsList = function() {
      return _.each(this.collection.where({
        isDeleted: false
      }), (function(_this) {
        return function(record) {
          var recordView;
          recordView = new Tracktime.RecordView({
            model: record
          });
          _this.$el.append(recordView.el);
          return _this.setSubView("record-" + record.cid, recordView);
        };
      })(this), this);
    };

    RecordsView.prototype.addRecord = function(record, collection, params) {
      var recordView;
      recordView = new Tracktime.RecordView({
        model: record
      });
      $(recordView.el).prependTo(this.$el);
      return this.setSubView("record-" + record.cid, recordView);
    };

    RecordsView.prototype.removeRecord = function() {
      var args, record, recordView;
      record = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      recordView = this.getSubView("record-" + record.cid);
      if (recordView) {
        return recordView.close();
      }
    };

    return RecordsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.RecordsView : void 0) || (this.Tracktime.RecordsView = Tracktime.RecordsView);

  Tracktime.ReportView = (function(superClass) {
    extend(ReportView, superClass);

    function ReportView() {
      return ReportView.__super__.constructor.apply(this, arguments);
    }

    ReportView.prototype.container = '#main';

    ReportView.prototype.template = JST['reports/report'];

    ReportView.prototype.initialize = function() {
      return this.render();
    };

    ReportView.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'Report Details HERE'
      })));
    };

    return ReportView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ReportView : void 0) || (this.Tracktime.ReportView = Tracktime.ReportView);

  Tracktime.ReportsView = (function(superClass) {
    extend(ReportsView, superClass);

    function ReportsView() {
      return ReportsView.__super__.constructor.apply(this, arguments);
    }

    ReportsView.prototype.container = '#main';

    ReportsView.prototype.template = JST['reports/reports'];

    ReportsView.prototype.initialize = function() {
      return this.render();
    };

    ReportsView.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'Reports HERE'
      })));
    };

    return ReportsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ReportsView : void 0) || (this.Tracktime.ReportsView = Tracktime.ReportsView);

  Tracktime.UserView = (function(superClass) {
    extend(UserView, superClass);

    function UserView() {
      return UserView.__super__.constructor.apply(this, arguments);
    }

    UserView.prototype.container = '#main';

    UserView.prototype.template = JST['user/user'];

    UserView.prototype.initialize = function() {
      return this.render();
    };

    UserView.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'User index'
      })));
    };

    return UserView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.UserView : void 0) || (this.Tracktime.UserView = Tracktime.UserView);

  Tracktime.UserView.Details = (function(superClass) {
    extend(Details, superClass);

    function Details() {
      return Details.__super__.constructor.apply(this, arguments);
    }

    Details.prototype.container = '#main';

    Details.prototype.template = JST['user/details'];

    Details.prototype.initialize = function() {
      return this.render();
    };

    Details.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'User details HERE'
      })));
    };

    return Details;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.UserView.Details : void 0) || (this.Tracktime.UserView.Details = Tracktime.UserView.Details);

  Tracktime.UserView.Rates = (function(superClass) {
    extend(Rates, superClass);

    function Rates() {
      return Rates.__super__.constructor.apply(this, arguments);
    }

    Rates.prototype.container = '#main';

    Rates.prototype.template = JST['user/rates'];

    Rates.prototype.initialize = function() {
      return this.render();
    };

    Rates.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template({
        title: 'User Rates'
      })));
    };

    return Rates;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.UserView.Rates : void 0) || (this.Tracktime.UserView.Rates = Tracktime.UserView.Rates);

}).call(this);

//# sourceMappingURL=app.coffee.js.map
