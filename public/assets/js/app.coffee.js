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

  switch ((ref = process.env) != null ? ref.NODE_ENV : void 0) {
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
      title: "TrackTime App"
    };

    Tracktime.prototype.initialize = function() {
      this.set('actions', new Tracktime.ActionsCollection());
      this.set('records', new Tracktime.RecordsCollection());
      this.set('projects', new Tracktime.ProjectsCollection());
      this.set('users', new Tracktime.UsersCollection());
      return this.listenTo(Tracktime.AppChannel, "isOnline", this.updateApp);
    };

    Tracktime.prototype.updateApp = function() {
      this.get('records').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
      this.get('projects').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
      return this.get('users').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
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
      this.undelegateEvents();
      this.$el.removeData().unbind();
      this.remove();
      Backbone.View.prototype.remove.call(this);
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
    text = Handlebars.Utils.escapeExpression(text);
    return new Handlebars.SafeString(text.nl2br());
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

  Handlebars.registerHelper('placeholder', function(name) {
    var placeholder;
    placeholder = "<placeholder id='" + name + "'></placeholder>";
    return new Handlebars.SafeString(placeholder);
  });

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

  String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  String.prototype.nl2br = function() {
    return (this + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  };

  Tracktime.Collection = (function(superClass) {
    extend(Collection, superClass);

    function Collection() {
      return Collection.__super__.constructor.apply(this, arguments);
    }

    Collection.prototype.addModel = function(params, options) {
      var newModel;
      newModel = new this.model(params);
      if (newModel.isValid()) {
        this.add(newModel);
        if (options.ajaxSync == null) {
          options.ajaxSync = Tracktime.AppChannel.request('isOnline');
        }
        return newModel.save({}, options);
      } else {
        return $.alert('Erros validation from add curModel to collection');
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
          var curModel, localLastAccess, localModel, modelLastAccess;
          curModel = _this.get(model._id);
          localModel = _this.localStorage.find(curModel);
          if (!localModel) {
            return curModel.save({
              ajaxSync: false
            });
          } else {
            modelLastAccess = (new Date(model.lastAccess)).getTime();
            localLastAccess = (new Date(localModel.lastAccess)).getTime();
            if (localModel.isDeleted) {
              return curModel.set({
                'isDeleted': true
              }, {
                trigger: false
              });
            } else if (localLastAccess < modelLastAccess) {
              return curModel.save(model, {
                ajaxSync: false
              });
            } else if (localLastAccess > modelLastAccess) {
              return curModel.save(localModel, {
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
              return _this.addModel(newModel, {
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

  Tracktime.Action = (function(superClass) {
    extend(Action, superClass);

    function Action() {
      return Action.__super__.constructor.apply(this, arguments);
    }

    Action.prototype.idAttribute = "_id";

    Action.prototype.url = '/actions';

    Action.prototype.defaults = {
      _id: null,
      title: 'Default action',
      isActive: null,
      isVisible: false,
      canClose: false
    };

    Action.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

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

  Tracktime.Action.Project = (function(superClass) {
    extend(Project, superClass);

    function Project() {
      return Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.defaults = _.extend({}, Tracktime.Action.prototype.defaults, {
      title: 'Add project',
      projectModel: null,
      formAction: '#',
      btnClass: 'btn-primary',
      navbarClass: 'navbar-material-amber',
      icon: {
        className: 'mdi-content-add',
        letter: ''
      },
      isActive: null,
      isVisible: true
    });

    Project.prototype.initialize = function() {
      if (!(this.get('projectModel') instanceof Tracktime.Project)) {
        return this.set('projectModel', new Tracktime.Project());
      }
    };

    Project.prototype.processAction = function() {
      var projectModel;
      projectModel = this.get('projectModel');
      if (projectModel.isValid()) {
        if (projectModel.isNew()) {
          Tracktime.AppChannel.command('newProject', projectModel.toJSON());
          return projectModel.clear().set(projectModel.defaults);
        } else {
          return projectModel.save({}, {
            ajaxSync: Tracktime.AppChannel.request('isOnline'),
            success: (function(_this) {
              return function() {
                $.alert({
                  content: 'Project: update success',
                  timeout: 2000,
                  style: 'btn-success'
                });
                return _this.destroy();
              };
            })(this)
          });
        }
      }
    };

    Project.prototype.destroy = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.get('projectModel').isEdit = false;
      this.get('projectModel').trigger('change:isEdit');
      return Project.__super__.destroy.apply(this, args);
    };

    return Project;

  })(Tracktime.Action);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action.Project : void 0) || (this.Tracktime.Action.Project = Tracktime.Action.Project);

  Tracktime.Action.Record = (function(superClass) {
    extend(Record, superClass);

    function Record() {
      return Record.__super__.constructor.apply(this, arguments);
    }

    Record.prototype.defaults = _.extend({}, Tracktime.Action.prototype.defaults, {
      title: 'Add record',
      recordModel: null,
      formAction: '#',
      btnClass: 'btn-primary',
      navbarClass: 'navbar-material-amber',
      icon: {
        className: 'mdi-content-add',
        letter: ''
      },
      isActive: null,
      isVisible: true
    });

    Record.prototype.initialize = function() {
      if (!(this.get('recordModel') instanceof Tracktime.Record)) {
        return this.set('recordModel', new Tracktime.Record());
      }
    };

    Record.prototype.processAction = function() {
      var recordModel;
      recordModel = this.get('recordModel');
      if (recordModel.isValid()) {
        if (recordModel.isNew()) {
          Tracktime.AppChannel.command('newRecord', recordModel.toJSON());
          return recordModel.clear().set(recordModel.defaults);
        } else {
          return recordModel.save({}, {
            ajaxSync: Tracktime.AppChannel.request('isOnline'),
            success: (function(_this) {
              return function() {
                $.alert({
                  content: 'Record: update success',
                  timeout: 2000,
                  style: 'btn-success'
                });
                return _this.destroy();
              };
            })(this)
          });
        }
      }
    };

    Record.prototype.destroy = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.get('recordModel').isEdit = false;
      this.get('recordModel').trigger('change:isEdit');
      return Record.__super__.destroy.apply(this, args);
    };

    return Record;

  })(Tracktime.Action);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action.Record : void 0) || (this.Tracktime.Action.Record = Tracktime.Action.Record);

  Tracktime.Action.Search = (function(superClass) {
    extend(Search, superClass);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.defaults = _.extend({}, Tracktime.Action.prototype.defaults, {
      title: 'Search',
      formAction: '#',
      btnClass: 'btn-white',
      navbarClass: 'navbar-material-light-blue',
      icon: {
        className: 'mdi-action-search',
        letter: ''
      },
      isActive: null,
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
      this.get('details').set(options);
      return this.search();
    };

    Search.prototype.search = function() {
      return $.alert('search start');
    };

    return Search;

  })(Tracktime.Action);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action.Search : void 0) || (this.Tracktime.Action.Search = Tracktime.Action.Search);

  Tracktime.Action.User = (function(superClass) {
    extend(User, superClass);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.defaults = _.extend({}, Tracktime.Action.prototype.defaults, {
      title: 'Add user',
      userModel: null,
      formAction: '#',
      btnClass: 'btn-primary',
      navbarClass: 'navbar-material-amber',
      icon: {
        className: 'mdi-content-add',
        letter: ''
      },
      isActive: null,
      isVisible: true
    });

    User.prototype.initialize = function() {
      if (!(this.get('userModel') instanceof Tracktime.User)) {
        return this.set('userModel', new Tracktime.User());
      }
    };

    User.prototype.processAction = function() {
      var userModel;
      userModel = this.get('userModel');
      if (userModel.isValid()) {
        if (userModel.isNew()) {
          Tracktime.AppChannel.command('newUser', userModel.toJSON());
          return userModel.clear().set(userModel.defaults);
        } else {
          return userModel.save({}, {
            ajaxSync: Tracktime.AppChannel.request('isOnline'),
            success: (function(_this) {
              return function() {
                $.alert({
                  content: 'User: update success',
                  timeout: 2000,
                  style: 'btn-success'
                });
                return _this.destroy();
              };
            })(this)
          });
        }
      }
    };

    User.prototype.destroy = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.get('userModel').isEdit = false;
      this.get('userModel').trigger('change:isEdit');
      return User.__super__.destroy.apply(this, args);
    };

    return User;

  })(Tracktime.Action);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Action.User : void 0) || (this.Tracktime.Action.User = Tracktime.Action.User);

  Tracktime.Project = (function(superClass) {
    extend(Project, superClass);

    function Project() {
      return Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.idAttribute = "_id";

    Project.prototype.collectionName = config.collection.projects;

    Project.prototype.urlRoot = config.SERVER + '/' + 'projects';

    Project.prototype.localStorage = new Backbone.LocalStorage('projects');

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

    Project.prototype.initialize = function() {
      this.isEdit = false;
      this.on('change:name', this.updateLastAccess);
      return this.on('change:isEdit', this.changeIsEdit);
    };

    Project.prototype.isValid = function() {
      return true;
    };

    Project.prototype.updateLastAccess = function() {
      return this.set('lastAccess', (new Date()).toISOString());
    };

    Project.prototype.changeIsEdit = function() {
      if (this.isEdit) {
        return Tracktime.AppChannel.command('addAction', {
          title: 'Edit project',
          type: 'Project',
          canClose: true
        }, {
          title: 'Edit project: ' + this.get('name').substr(0, 40),
          navbarClass: 'navbar-material-purple',
          btnClass: 'btn-material-purple',
          icon: {
            className: 'mdi-editor-mode-edit'
          },
          projectModel: this,
          scope: 'edit:action'
        });
      }
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

    Record.prototype.collectionName = config.collection.records;

    Record.prototype.urlRoot = config.SERVER + '/' + 'records';

    Record.prototype.localStorage = new Backbone.LocalStorage('records');

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

    Record.prototype.initialize = function() {
      this.isEdit = false;
      this.on('change:subject change:recordTime change:recordDate change:project', this.updateLastAccess);
      return this.on('change:isEdit', this.changeIsEdit);
    };

    Record.prototype.isValid = function() {
      return true;
    };

    Record.prototype.updateLastAccess = function() {
      return this.set('lastAccess', (new Date()).toISOString());
    };

    Record.prototype.changeIsEdit = function() {
      if (this.isEdit) {
        return Tracktime.AppChannel.command('addAction', {
          title: 'Edit record',
          type: 'Record',
          canClose: true
        }, {
          title: 'Edit record: ' + this.get('subject').substr(0, 40),
          navbarClass: 'navbar-material-indigo',
          btnClass: 'btn-material-indigo',
          icon: {
            className: 'mdi-editor-mode-edit'
          },
          recordModel: this,
          scope: 'edit:action'
        });
      }
    };

    return Record;

  })(Tracktime.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Record : void 0) || (this.Tracktime.Record = Tracktime.Record);

  Tracktime.User = (function(superClass) {
    extend(User, superClass);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.idAttribute = "_id";

    User.prototype.collectionName = config.collection.users;

    User.prototype.urlRoot = config.SERVER + '/' + 'users';

    User.prototype.localStorage = new Backbone.LocalStorage('users');

    User.prototype.defaults = {
      _id: null,
      name: '',
      description: '',
      lastAccess: (new Date()).toISOString(),
      isDeleted: false
    };

    User.prototype.validation = {
      name: {
        required: true,
        minLength: 4,
        msg: 'Please enter a valid name'
      }
    };

    User.prototype.initialize = function() {
      this.isEdit = false;
      this.on('change:name', this.updateLastAccess);
      return this.on('change:isEdit', this.changeIsEdit);
    };

    User.prototype.isValid = function() {
      return true;
    };

    User.prototype.updateLastAccess = function() {
      return this.set('lastAccess', (new Date()).toISOString());
    };

    User.prototype.changeIsEdit = function() {
      if (this.isEdit) {
        return Tracktime.AppChannel.command('addAction', {
          title: 'Edit user',
          type: 'User',
          canClose: true
        }, {
          title: 'Edit user: ' + this.get('name').substr(0, 40),
          navbarClass: 'navbar-material-purple',
          btnClass: 'btn-material-purple',
          icon: {
            className: 'mdi-editor-mode-edit'
          },
          userModel: this,
          scope: 'edit:action'
        });
      }
    };

    return User;

  })(Tracktime.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.User : void 0) || (this.Tracktime.User = Tracktime.User);

  Tracktime.ActionsCollection = (function(superClass) {
    extend(ActionsCollection, superClass);

    function ActionsCollection() {
      this.addAction = bind(this.addAction, this);
      return ActionsCollection.__super__.constructor.apply(this, arguments);
    }

    ActionsCollection.prototype.model = Tracktime.Action;

    ActionsCollection.prototype.collectionName = config.collection.actions;

    ActionsCollection.prototype.url = '/' + 'actions';

    ActionsCollection.prototype.localStorage = new Backbone.LocalStorage('actions');

    ActionsCollection.prototype.defaultActions = [
      {
        title: 'Add Record',
        type: 'Record'
      }, {
        title: 'Search',
        type: 'Search'
      }
    ];

    ActionsCollection.prototype.active = null;

    ActionsCollection.prototype.initialize = function() {
      this.on('remove', this.setDefaultActive);
      return _.each(this.defaultActions, this.addAction);
    };

    ActionsCollection.prototype.addAction = function(action, params) {
      var actionModel;
      if (params == null) {
        params = {};
      }
      if (Tracktime.Action[action.type]) {
        actionModel = new Tracktime.Action[action.type](action);
        actionModel.set(params);
        this.push(actionModel);
        return actionModel;
      }
    };

    ActionsCollection.prototype.setDefaultActive = function() {
      if (!this.find({
        isActive: true
      })) {
        return this.at(0).setActive();
      }
    };

    ActionsCollection.prototype.setActive = function(active) {
      var ref1;
      if ((ref1 = this.active) != null) {
        ref1.set('isActive', false);
      }
      active.set('isActive', true);
      this.active = active;
      return this.trigger('change:active', this.active);
    };

    ActionsCollection.prototype.getActive = function() {
      return this.active;
    };

    ActionsCollection.prototype.getActions = function() {
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

    ProjectsCollection.prototype.collectionName = config.collection.projects;

    ProjectsCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/' + 'projects';

    ProjectsCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/' + 'projects';

    ProjectsCollection.prototype.localStorage = new Backbone.LocalStorage('projects');

    ProjectsCollection.prototype.initialize = function() {
      return this.fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
    };

    ProjectsCollection.prototype.comparator = function(model) {
      return -(new Date(model.get('date'))).getTime();
    };

    ProjectsCollection.prototype.addProject = function(options) {
      var error, success;
      _.extend(options, {
        date: (new Date()).toISOString()
      });
      success = (function(_this) {
        return function(result) {
          return $.alert({
            content: 'Project: save success',
            timeout: 2000,
            style: 'btn-success'
          });
        };
      })(this);
      error = (function(_this) {
        return function() {
          return $.alert('Project: save error');
        };
      })(this);
      return this.addModel(options, {
        success: success,
        error: error
      });
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

    RecordsCollection.prototype.collectionName = config.collection.records;

    RecordsCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/' + 'records';

    RecordsCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/' + 'records';

    RecordsCollection.prototype.localStorage = new Backbone.LocalStorage('records');

    RecordsCollection.prototype.initialize = function() {
      return this.fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
    };

    RecordsCollection.prototype.comparator = function(model) {
      return -(new Date(model.get('date'))).getTime();
    };

    RecordsCollection.prototype.addRecord = function(options) {
      var error, success;
      _.extend(options, {
        date: (new Date()).toISOString()
      });
      success = (function(_this) {
        return function(result) {
          return $.alert({
            content: 'Record: save success',
            timeout: 2000,
            style: 'btn-success'
          });
        };
      })(this);
      error = (function(_this) {
        return function() {
          return $.alert('Record: save error');
        };
      })(this);
      return this.addModel(options, {
        success: success,
        error: error
      });
    };

    return RecordsCollection;

  })(Tracktime.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.RecordsCollection : void 0) || (this.Tracktime.RecordsCollection = Tracktime.RecordsCollection);

  Tracktime.UsersCollection = (function(superClass) {
    extend(UsersCollection, superClass);

    function UsersCollection() {
      return UsersCollection.__super__.constructor.apply(this, arguments);
    }

    UsersCollection.prototype.model = Tracktime.User;

    UsersCollection.prototype.collectionName = config.collection.users;

    UsersCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/' + 'users';

    UsersCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/' + 'users';

    UsersCollection.prototype.localStorage = new Backbone.LocalStorage('users');

    UsersCollection.prototype.initialize = function() {
      return this.fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
    };

    UsersCollection.prototype.comparator = function(model) {
      return -(new Date(model.get('date'))).getTime();
    };

    UsersCollection.prototype.addUser = function(options) {
      var error, success;
      _.extend(options, {
        date: (new Date()).toISOString()
      });
      success = (function(_this) {
        return function(result) {
          return $.alert({
            content: 'User: save success',
            timeout: 2000,
            style: 'btn-success'
          });
        };
      })(this);
      error = (function(_this) {
        return function() {
          return $.alert('User: save error');
        };
      })(this);
      return this.addModel(options, {
        success: success,
        error: error
      });
    };

    return UsersCollection;

  })(Tracktime.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.UsersCollection : void 0) || (this.Tracktime.UsersCollection = Tracktime.UsersCollection);

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
        'newProject': this.newProject,
        'newUser': this.newUser,
        'addAction': this.addAction,
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
      return this.model.get('records').addRecord(options);
    },
    newProject: function(options) {
      return this.model.get('projects').addProject(options);
    },
    newUser: function(options) {
      return this.model.get('users').addUser(options);
    },
    addAction: function(options, params) {
      var action;
      action = this.model.get('actions').addAction(options, params);
      return action.setActive();
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
      _.extend(this, options);
      return this.on('route', (function(_this) {
        return function(route, params) {
          return _this.parent.trigger('subroute', "admin:" + route, params);
        };
      })(this));
    };

    AdminRouter.prototype.dashboard = function() {
      return this.parent.view.setSubView('main', new Tracktime.AdminView.Dashboard());
    };

    AdminRouter.prototype.users = function() {
      var newAction;
      this.parent.view.setSubView('main', new Tracktime.AdminView.UsersView({
        collection: this.parent.model.get('users')
      }));
      newAction = this.parent.model.get('actions').addAction({
        title: 'Add users',
        type: 'User'
      }, {
        scope: 'admin:users'
      });
      return newAction.setActive();
    };

    AdminRouter.prototype.projects = function() {
      var newAction;
      this.parent.view.setSubView('main', new Tracktime.AdminView.ProjectsView({
        collection: this.parent.model.get('projects')
      }));
      newAction = this.parent.model.get('actions').addAction({
        title: 'Add projects',
        type: 'Project'
      }, {
        scope: 'admin:projects'
      });
      return newAction.setActive();
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
      this.on('route subroute', (function(_this) {
        return function(route, params) {
          if (route.substr(0, 6) !== 'invoke') {
            return _this.removeActionsExcept(route);
          }
        };
      })(this));
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

    AppRouter.prototype.removeActionsExcept = function(route) {
      return _.each(this.model.get('actions').models, function(action) {
        if (action.has('scope') && action.get('scope') !== route) {
          return action.destroy();
        }
      });
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
      _.extend(this, options);
      return this.on('route', (function(_this) {
        return function(route, params) {
          return _this.parent.trigger('subroute', "projects:" + route, params);
        };
      })(this));
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
      _.extend(this, options);
      return this.on('route', (function(_this) {
        return function(route, params) {
          return _this.parent.trigger('subroute', "records:" + route, params);
        };
      })(this));
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
      this.on('route', (function(_this) {
        return function(route, params) {
          return _this.parent.trigger('subroute', "reports:" + route, params);
        };
      })(this));
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
      _.extend(this, options);
      return this.on('route', (function(_this) {
        return function(route, params) {
          return _this.parent.trigger('subroute', "user:" + route, params);
        };
      })(this));
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
      this.addAction = bind(this.addAction, this);
      return ActionsView.__super__.constructor.apply(this, arguments);
    }

    ActionsView.prototype.el = '#actions-form';

    ActionsView.prototype.menu = '#actions-form';

    ActionsView.prototype.template = JST['actions/actions'];

    ActionsView.prototype.views = {};

    ActionsView.prototype.initialize = function(options) {
      _.extend(this, options);
      this.listenTo(this.collection, 'change:active', this.renderAction);
      this.listenTo(this.collection, 'add', this.addAction);
      return this.render();
    };

    ActionsView.prototype.render = function() {
      this.$el.html(this.template());
      this.menu = $('.dropdown-menu', '.select-action', this.$el);
      _.each(this.collection.getActions(), this.addAction);
      return this.collection.at(0).setActive();
    };

    ActionsView.prototype.addAction = function(action) {
      var listBtn;
      listBtn = new Tracktime.ActionView.ListBtn({
        model: action
      });
      this.menu.append(listBtn.$el);
      this.setSubView("listBtn-" + listBtn.cid, listBtn);
      return $('[data-toggle="tooltip"]', listBtn.$el).tooltip();
    };

    ActionsView.prototype.renderAction = function(action) {
      if (Tracktime.ActionView[action.get('type')]) {
        this.$el.parents('.navbar').attr('class', "navbar " + (action.get('navbarClass')) + " shadow-z-1");
        return this.setSubView("actionDetails", new Tracktime.ActionView[action.get('type')]({
          model: action
        }));
      }
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

  Tracktime.ActionView.ListBtn = (function(superClass) {
    extend(ListBtn, superClass);

    function ListBtn() {
      return ListBtn.__super__.constructor.apply(this, arguments);
    }

    ListBtn.prototype.tagName = 'li';

    ListBtn.prototype.template = JST['actions/listbtn'];

    ListBtn.prototype.events = {
      'click': 'actionActive'
    };

    ListBtn.prototype.initialize = function(options) {
      _.extend(this, options);
      this.render();
      this.listenTo(this.model, 'change:isActive', this.updateActionControl);
      return this.listenTo(this.model, 'destroy', this.close);
    };

    ListBtn.prototype.render = function() {
      this.$el.html(this.template(this.model.toJSON()));
      if (this.model.get('isActive') === true) {
        this.$el.addClass('active');
        return this.updateActionControl();
      } else {
        return this.$el.removeClass('active');
      }
    };

    ListBtn.prototype.actionActive = function(event) {
      event.preventDefault();
      return this.model.setActive();
    };

    ListBtn.prototype.updateActionControl = function() {
      this.$el.siblings().removeClass('active');
      this.$el.addClass('active');
      return $("#action_type").replaceWith((new Tracktime.ActionView.ActiveBtn({
        model: this.model
      })).$el);
    };

    return ListBtn;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.ListBtn : void 0) || (this.Tracktime.ActionView.ListBtn = Tracktime.ActionView.ListBtn);

  Tracktime.ActionView.Project = (function(superClass) {
    extend(Project, superClass);

    function Project() {
      this.sendForm = bind(this.sendForm, this);
      this.textareaInput = bind(this.textareaInput, this);
      return Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.container = '.form-control-wrapper';

    Project.prototype.template = JST['actions/details/project'];

    Project.prototype.views = {};

    Project.prototype.events = {
      'click #send-form': 'sendForm',
      'input textarea': 'textareaInput'
    };

    Project.prototype.initialize = function(options) {
      _.extend(this, options);
      return this.render();
    };

    Project.prototype.render = function() {
      var textarea;
      $(this.container).html(this.$el.html(this.template(this.model.toJSON())));
      textarea = new Tracktime.Element.Textarea({
        model: this.model.get('projectModel'),
        field: 'name'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      textarea.$el.textareaAutoSize().focus();
      textarea.on('tSubmit', this.sendForm);
      if (this.model.get('canClose')) {
        return $('placeholder#btn_close_action', this.$el).replaceWith((new Tracktime.Element.ElementCloseAction({
          model: this.model
        })).$el);
      }
    };

    Project.prototype.textareaInput = function(event) {
      return window.setTimeout((function(_this) {
        return function() {
          var diff;
          diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true);
          $('#actions-form').toggleClass("shadow-z-2", diff > 10);
          return $(".details-container").toggleClass('hidden', _.isEmpty($(event.target).val()));
        };
      })(this), 500);
    };

    Project.prototype.sendForm = function() {
      return this.model.processAction();
    };

    return Project;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.Project : void 0) || (this.Tracktime.ActionView.Project = Tracktime.ActionView.Project);

  Tracktime.ActionView.Record = (function(superClass) {
    extend(Record, superClass);

    function Record() {
      this.sendForm = bind(this.sendForm, this);
      this.textareaInput = bind(this.textareaInput, this);
      return Record.__super__.constructor.apply(this, arguments);
    }

    Record.prototype.container = '.form-control-wrapper';

    Record.prototype.template = JST['actions/details/record'];

    Record.prototype.views = {};

    Record.prototype.events = {
      'click #send-form': 'sendForm',
      'input textarea': 'textareaInput'
    };

    Record.prototype.initialize = function(options) {
      _.extend(this, options);
      return this.render();
    };

    Record.prototype.render = function() {
      var textarea;
      $(this.container).html(this.$el.html(this.template(this.model.toJSON())));
      textarea = new Tracktime.Element.Textarea({
        model: this.model.get('recordModel'),
        field: 'subject'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      textarea.$el.textareaAutoSize().focus();
      textarea.on('tSubmit', this.sendForm);
      $('placeholder#slider', this.$el).replaceWith((new Tracktime.Element.Slider({
        model: this.model.get('recordModel'),
        field: 'recordTime'
      })).$el);
      $('placeholder#selectday', this.$el).replaceWith((new Tracktime.Element.SelectDay({
        model: this.model.get('recordModel'),
        field: 'recordDate'
      })).$el);
      if (this.model.get('canClose')) {
        return $('placeholder#btn_close_action', this.$el).replaceWith((new Tracktime.Element.ElementCloseAction({
          model: this.model
        })).$el);
      }
    };

    Record.prototype.textareaInput = function(event) {
      return window.setTimeout((function(_this) {
        return function() {
          var diff;
          diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true);
          $('#actions-form').toggleClass("shadow-z-2", diff > 10);
          return $(".details-container").toggleClass('hidden', _.isEmpty($(event.target).val()));
        };
      })(this), 500);
    };

    Record.prototype.sendForm = function() {
      return this.model.processAction();
    };

    return Record;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.Record : void 0) || (this.Tracktime.ActionView.Record = Tracktime.ActionView.Record);

  Tracktime.ActionView.Search = (function(superClass) {
    extend(Search, superClass);

    function Search() {
      return Search.__super__.constructor.apply(this, arguments);
    }

    Search.prototype.container = '.form-control-wrapper';

    Search.prototype.template = JST['actions/details/search'];

    Search.prototype.tmpDetails = {};

    Search.prototype.views = {};

    Search.prototype.initialize = function(options) {
      _.extend(this, options);
      return this.render();
    };

    Search.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template(this.model.toJSON())));
    };

    return Search;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.Search : void 0) || (this.Tracktime.ActionView.Search = Tracktime.ActionView.Search);

  Tracktime.ActionView.User = (function(superClass) {
    extend(User, superClass);

    function User() {
      this.sendForm = bind(this.sendForm, this);
      this.textareaInput = bind(this.textareaInput, this);
      return User.__super__.constructor.apply(this, arguments);
    }

    User.prototype.container = '.form-control-wrapper';

    User.prototype.template = JST['actions/details/user'];

    User.prototype.views = {};

    User.prototype.events = {
      'click #send-form': 'sendForm',
      'input textarea': 'textareaInput'
    };

    User.prototype.initialize = function(options) {
      _.extend(this, options);
      return this.render();
    };

    User.prototype.render = function() {
      var textarea;
      $(this.container).html(this.$el.html(this.template(this.model.toJSON())));
      textarea = new Tracktime.Element.Textarea({
        model: this.model.get('userModel'),
        field: 'name'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      textarea.$el.textareaAutoSize().focus();
      textarea.on('tSubmit', this.sendForm);
      if (this.model.get('canClose')) {
        return $('placeholder#btn_close_action', this.$el).replaceWith((new Tracktime.Element.ElementCloseAction({
          model: this.model
        })).$el);
      }
    };

    User.prototype.textareaInput = function(event) {
      return window.setTimeout((function(_this) {
        return function() {
          var diff;
          diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true);
          $('#actions-form').toggleClass("shadow-z-2", diff > 10);
          return $(".details-container").toggleClass('hidden', _.isEmpty($(event.target).val()));
        };
      })(this), 500);
    };

    User.prototype.sendForm = function() {
      return this.model.processAction();
    };

    return User;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionView.User : void 0) || (this.Tracktime.ActionView.User = Tracktime.ActionView.User);

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

  Tracktime.AdminView.ProjectsView = (function(superClass) {
    extend(ProjectsView, superClass);

    function ProjectsView() {
      return ProjectsView.__super__.constructor.apply(this, arguments);
    }

    ProjectsView.prototype.container = '#main';

    ProjectsView.prototype.template = JST['admin/projects'];

    ProjectsView.prototype.tagName = 'ul';

    ProjectsView.prototype.className = 'list-group';

    ProjectsView.prototype.initialize = function() {
      this.views = {};
      this.render();
      this.listenTo(this.collection, "reset", this.resetProjectsList);
      this.listenTo(this.collection, "add", this.addProject);
      return this.listenTo(this.collection, "remove", this.removeProject);
    };

    ProjectsView.prototype.render = function() {
      $(this.container).html(this.$el.html(''));
      this.$el.before(this.template({
        title: 'Projects'
      }));
      return this.resetProjectsList();
    };

    ProjectsView.prototype.resetProjectsList = function() {
      return _.each(this.collection.where({
        isDeleted: false
      }), (function(_this) {
        return function(project) {
          var projectView;
          projectView = new Tracktime.AdminView.ProjectView({
            model: project
          });
          _this.$el.append(projectView.el);
          return _this.setSubView("project-" + project.cid, projectView);
        };
      })(this), this);
    };

    ProjectsView.prototype.addProject = function(project, collection, params) {
      var projectView;
      projectView = new Tracktime.AdminView.ProjectView({
        model: project
      });
      $(projectView.el).prependTo(this.$el);
      return this.setSubView("project-" + project.cid, projectView);
    };

    ProjectsView.prototype.removeProject = function() {
      var args, project, projectView;
      project = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      projectView = this.getSubView("project-" + project.cid);
      if (projectView) {
        return projectView.close();
      }
    };

    return ProjectsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.ProjectsView : void 0) || (this.Tracktime.AdminView.ProjectsView = Tracktime.AdminView.ProjectsView);

  Tracktime.AdminView.UsersView = (function(superClass) {
    extend(UsersView, superClass);

    function UsersView() {
      return UsersView.__super__.constructor.apply(this, arguments);
    }

    UsersView.prototype.container = '#main';

    UsersView.prototype.template = JST['admin/users'];

    UsersView.prototype.tagName = 'ul';

    UsersView.prototype.className = 'list-group';

    UsersView.prototype.initialize = function() {
      this.views = {};
      this.render();
      this.listenTo(this.collection, "reset", this.resetUsersList);
      this.listenTo(this.collection, "add", this.addUser);
      return this.listenTo(this.collection, "remove", this.removeUser);
    };

    UsersView.prototype.render = function() {
      $(this.container).html(this.$el.html(''));
      this.$el.before(this.template({
        title: 'Users'
      }));
      return this.resetUsersList();
    };

    UsersView.prototype.resetUsersList = function() {
      return _.each(this.collection.where({
        isDeleted: false
      }), (function(_this) {
        return function(user) {
          var userView;
          userView = new Tracktime.AdminView.UserView({
            model: user
          });
          _this.$el.append(userView.el);
          return _this.setSubView("user-" + user.cid, userView);
        };
      })(this), this);
    };

    UsersView.prototype.addUser = function(user, collection, params) {
      var userView;
      userView = new Tracktime.AdminView.UserView({
        model: user
      });
      $(userView.el).prependTo(this.$el);
      return this.setSubView("user-" + user.cid, userView);
    };

    UsersView.prototype.removeUser = function() {
      var args, user, userView;
      user = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      userView = this.getSubView("user-" + user.cid);
      if (userView) {
        return userView.close();
      }
    };

    return UsersView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.UsersView : void 0) || (this.Tracktime.AdminView.UsersView = Tracktime.AdminView.UsersView);

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

  Tracktime.Element = (function(superClass) {
    extend(Element, superClass);

    function Element() {
      return Element.__super__.constructor.apply(this, arguments);
    }

    Element.prototype.initialize = function() {
      return this.render();
    };

    Element.prototype.render = function() {
      return this.$el.html('void element');
    };

    return Element;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Element : void 0) || (this.Tracktime.Element = Tracktime.Element);

  Tracktime.Element.ElementCloseAction = (function(superClass) {
    extend(ElementCloseAction, superClass);

    function ElementCloseAction() {
      this.closeAction = bind(this.closeAction, this);
      return ElementCloseAction.__super__.constructor.apply(this, arguments);
    }

    ElementCloseAction.prototype.tagName = 'button';

    ElementCloseAction.prototype.className = 'btn btn-close-action btn-fab btn-flat btn-fab-mini';

    ElementCloseAction.prototype.hint = 'Cancel action';

    ElementCloseAction.prototype.events = {
      'click': 'closeAction'
    };

    ElementCloseAction.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      _.extend(this, options);
      return this.render();
    };

    ElementCloseAction.prototype.render = function() {
      return this.$el.attr('title', this.hint).append($('<i />', {
        "class": 'mdi-content-remove'
      }));
    };

    ElementCloseAction.prototype.closeAction = function() {
      return this.model.destroy();
    };

    return ElementCloseAction;

  })(Tracktime.Element);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Element.ElementCloseAction : void 0) || (this.Tracktime.Element.ElementCloseAction = Tracktime.Element.ElementCloseAction);

  Tracktime.Element.SelectDay = (function(superClass) {
    extend(SelectDay, superClass);

    function SelectDay() {
      this.changeInput = bind(this.changeInput, this);
      this.changeField = bind(this.changeField, this);
      return SelectDay.__super__.constructor.apply(this, arguments);
    }

    SelectDay.prototype.className = 'btn-group select-day';

    SelectDay.prototype.template = JST['elements/selectday'];

    SelectDay.prototype.events = {
      'click button.btn': 'setDay'
    };

    SelectDay.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      _.extend(this, options);
      this.render();
      this.changeField();
      return this.listenTo(this.model, "change:" + this.field, this.changeField);
    };

    SelectDay.prototype.render = function() {
      return this.$el.html(this.template());
    };

    SelectDay.prototype.changeField = function() {};

    SelectDay.prototype.changeInput = function(value) {
      return this.model.set(this.field, value, {
        silent: true
      });
    };

    SelectDay.prototype.setDay = function(event) {
      event.preventDefault();
      $(".dropdown-toggle ruby", this.$el).html($('ruby', event.currentTarget).html());
      return this.changeInput($(".dropdown-toggle ruby rt", this.$el).html());
    };

    return SelectDay;

  })(Tracktime.Element);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Element.SelectDay : void 0) || (this.Tracktime.Element.SelectDay = Tracktime.Element.SelectDay);

  Tracktime.Element.Slider = (function(superClass) {
    extend(Slider, superClass);

    function Slider() {
      this.changeInput = bind(this.changeInput, this);
      this.changeField = bind(this.changeField, this);
      return Slider.__super__.constructor.apply(this, arguments);
    }

    Slider.prototype.className = 'slider shor btn-primary slider-material-orange';

    Slider.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      _.extend(this, options);
      this.render();
      this.changeField();
      return this.listenTo(this.model, "change:" + this.field, this.changeField);
    };

    Slider.prototype.render = function() {
      this.$el.noUiSlider({
        start: [0],
        step: 5,
        range: {
          'min': [0],
          'max': [720]
        }
      }).on({
        slide: (function(_this) {
          return function(event, inval) {
            var currentHour, hour, minute, val;
            if ((inval != null) && _.isNumber(parseFloat(inval))) {
              _this.changeInput(parseFloat(inval));
              val = inval;
            } else {
              val = 0;
            }
            currentHour = val / 720 * 12;
            hour = Math.floor(currentHour);
            minute = (currentHour - hour) * 60;
            $('.slider .noUi-handle').attr('data-before', hour);
            return $('.slider .noUi-handle').attr('data-after', Math.round(minute));
          };
        })(this)
      });
      return this.$el.noUiSlider_pips({
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

    Slider.prototype.changeField = function() {
      var fieldValue, newVal;
      newVal = 0;
      fieldValue = this.model.get(this.field);
      if ((fieldValue != null) && _.isNumber(parseFloat(fieldValue))) {
        newVal = parseFloat(this.model.get(this.field));
        return this.$el.val(newVal).trigger('slide');
      }
    };

    Slider.prototype.changeInput = function(value) {
      return this.model.set(this.field, parseFloat(value) || 0, {
        silent: true
      });
    };

    return Slider;

  })(Tracktime.Element);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Element.Slider : void 0) || (this.Tracktime.Element.Slider = Tracktime.Element.Slider);

  Tracktime.Element.Textarea = (function(superClass) {
    extend(Textarea, superClass);

    function Textarea() {
      this.fixEnter = bind(this.fixEnter, this);
      this.changeInput = bind(this.changeInput, this);
      this.changeField = bind(this.changeField, this);
      return Textarea.__super__.constructor.apply(this, arguments);
    }

    Textarea.prototype.tagName = 'textarea';

    Textarea.prototype.className = 'form-control';

    Textarea.prototype.events = {
      'keydown': 'fixEnter',
      'keyup': 'changeInput',
      'change': 'changeInput'
    };

    Textarea.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      _.extend(this, options);
      this.render();
      return this.listenTo(this.model, "change:" + this.field, this.changeField);
    };

    Textarea.prototype.render = function() {
      this.$el.attr('name', 'action_text');
      return this.$el.val(this.model.get(this.field));
    };

    Textarea.prototype.changeField = function() {
      return this.$el.val(this.model.get(this.field)).trigger('input');
    };

    Textarea.prototype.changeInput = function(event) {
      return this.model.set(this.field, $(event.target).val(), {
        silent: true
      });
    };

    Textarea.prototype.fixEnter = function(event) {
      if (event.keyCode === 13 && event.shiftKey) {
        event.preventDefault();
        return this.trigger('tSubmit');
      }
    };

    return Textarea;

  })(Tracktime.Element);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Element.Textarea : void 0) || (this.Tracktime.Element.Textarea = Tracktime.Element.Textarea);

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
      return Header.__super__.constructor.apply(this, arguments);
    }

    Header.prototype.container = '#header';

    Header.prototype.template = JST['layout/header'];

    Header.prototype.views = {};

    Header.prototype.initialize = function(options) {
      this.options = options;
      return this.render();
    };

    Header.prototype.render = function() {
      var ref1;
      $(this.container).html(this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0)));
      return this.views['actions'] = new Tracktime.ActionsView({
        collection: this.model.get('actions')
      });
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
      $(this.container).html(this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0)));
      return _.each(this.model.get('projects').models, (function(_this) {
        return function(model) {
          var projectLink;
          projectLink = $('<a />', {
            "class": 'list-group-item',
            href: "#projects/" + (model.get('_id'))
          }).html(model.get('name'));
          return projectLink.appendTo("#projects-section .list-style-group");
        };
      })(this));
    };

    return Menu;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Menu : void 0) || (this.Tracktime.AppView.Menu = Tracktime.AppView.Menu);

  Tracktime.AdminView.ProjectView = (function(superClass) {
    extend(ProjectView, superClass);

    function ProjectView() {
      this.sendForm = bind(this.sendForm, this);
      return ProjectView.__super__.constructor.apply(this, arguments);
    }

    ProjectView.prototype.tagName = 'li';

    ProjectView.prototype.className = 'list-group-item shadow-z-1';

    ProjectView.prototype.template = JST['projects/admin_project'];

    ProjectView.prototype.events = {
      'click .btn.delete': "deleteProject",
      'click .subject': "toggleInlineEdit",
      'click .edit.btn': "editProject"
    };

    ProjectView.prototype.initialize = function() {
      if (!this.model.get('isDeleted')) {
        this.render();
      }
      this.listenTo(this.model, "change:isDeleted", this.changeIsDeleted);
      this.listenTo(this.model, "change:name", this.changeName);
      this.listenTo(this.model, "change:isEdit", this.changeIsEdit);
      return this.listenTo(this.model, "sync", this.syncModel);
    };

    ProjectView.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    ProjectView.prototype.render = function() {
      var textarea;
      this.$el.html(this.template(this.model.toJSON()));
      $('.subject_edit', this.$el).on('keydown', this.fixEnter).textareaAutoSize();
      textarea = new Tracktime.Element.Textarea({
        model: this.model,
        className: 'subject_edit form-control hidden',
        field: 'name'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      return textarea.on('tSubmit', this.sendForm);
    };

    ProjectView.prototype.changeIsEdit = function() {
      return this.$el.toggleClass('editmode', this.model.isEdit === true);
    };

    ProjectView.prototype.syncModel = function(model, options, params) {
      model.isEdit = false;
      model.trigger('change:isEdit');
      return model.trigger('change:name');
    };

    ProjectView.prototype.changeIsDeleted = function() {
      return this.$el.remove();
    };

    ProjectView.prototype.changeName = function() {
      $('.subject', this.$el).html((this.model.get('name') + '').nl2br());
      return $('.name_edit', this.$el).val(this.model.get('name'));
    };

    ProjectView.prototype.toggleInlineEdit = function() {
      this.$el.find('.subject_edit').css('min-height', this.$el.find('.subject').height());
      this.$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass('hidden');
      return this.$el.find('.subject_edit').textareaAutoSize().focus();
    };

    ProjectView.prototype.sendForm = function() {
      this.toggleInlineEdit();
      return this.model.save({}, {
        ajaxSync: Tracktime.AppChannel.request('isOnline'),
        success: function(model, respond) {
          return $.alert({
            content: 'update project',
            timeout: 2000,
            style: 'btn-info'
          });
        }
      });
    };

    ProjectView.prototype.editProject = function() {
      return $('.scrollWrapper').animate({
        'scrollTop': this.$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
      }, 400, (function(_this) {
        return function(event) {
          _this.model.isEdit = true;
          return _this.model.trigger('change:isEdit');
        };
      })(this));
    };

    ProjectView.prototype.deleteProject = function(event) {
      event.preventDefault();
      return this.model.destroy({
        ajaxSync: Tracktime.AppChannel.request('isOnline'),
        success: function(model, respond) {
          return $.alert({
            content: 'delete project',
            timeout: 2000,
            style: 'btn-danger'
          });
        }
      });
    };

    return ProjectView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.ProjectView : void 0) || (this.Tracktime.AdminView.ProjectView = Tracktime.AdminView.ProjectView);

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
        title: 'Project Details View HERE'
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
        title: 'Projects HERE - Only view'
      })));
    };

    return ProjectsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ProjectsView : void 0) || (this.Tracktime.ProjectsView = Tracktime.ProjectsView);

  Tracktime.RecordView = (function(superClass) {
    extend(RecordView, superClass);

    function RecordView() {
      this.sendForm = bind(this.sendForm, this);
      return RecordView.__super__.constructor.apply(this, arguments);
    }

    RecordView.prototype.tagName = 'li';

    RecordView.prototype.className = 'list-group-item shadow-z-1';

    RecordView.prototype.template = JST['records/record'];

    RecordView.prototype.events = {
      'click .btn.delete': "deleteRecord",
      'click .subject': "toggleInlineEdit",
      'click .edit.btn': "editRecord"
    };

    RecordView.prototype.initialize = function() {
      if (!this.model.get('isDeleted')) {
        this.render();
      }
      this.listenTo(this.model, "change:isDeleted", this.changeIsDeleted);
      this.listenTo(this.model, "change:subject", this.changeSubject);
      this.listenTo(this.model, "change:isEdit", this.changeIsEdit);
      return this.listenTo(this.model, "sync", this.syncModel);
    };

    RecordView.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    RecordView.prototype.render = function() {
      var textarea;
      this.$el.html(this.template(this.model.toJSON()));
      $('.subject_edit', this.$el).on('keydown', this.fixEnter).textareaAutoSize();
      textarea = new Tracktime.Element.Textarea({
        model: this.model,
        className: 'subject_edit form-control hidden',
        field: 'subject'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      return textarea.on('tSubmit', this.sendForm);
    };

    RecordView.prototype.changeIsEdit = function() {
      return this.$el.toggleClass('editmode', this.model.isEdit === true);
    };

    RecordView.prototype.syncModel = function(model, options, params) {
      model.isEdit = false;
      model.trigger('change:isEdit');
      return model.trigger('change:subject');
    };

    RecordView.prototype.changeIsDeleted = function() {
      return this.$el.remove();
    };

    RecordView.prototype.changeSubject = function() {
      $('.subject', this.$el).html((this.model.get('subject') + '').nl2br());
      return $('.subject_edit', this.$el).val(this.model.get('subject'));
    };

    RecordView.prototype.toggleInlineEdit = function() {
      this.$el.find('.subject_edit').css('min-height', this.$el.find('.subject').height());
      this.$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass('hidden');
      return this.$el.find('.subject_edit').textareaAutoSize().focus();
    };

    RecordView.prototype.sendForm = function() {
      this.toggleInlineEdit();
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

    RecordView.prototype.editRecord = function() {
      return $('.scrollWrapper').animate({
        'scrollTop': this.$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
      }, 400, (function(_this) {
        return function(event) {
          _this.model.isEdit = true;
          return _this.model.trigger('change:isEdit');
        };
      })(this));
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

    RecordsView.prototype.template = JST['records/records'];

    RecordsView.prototype.tagName = 'ul';

    RecordsView.prototype.className = 'list-group';

    RecordsView.prototype.initialize = function() {
      this.views = {};
      this.render();
      this.listenTo(this.collection, "reset", this.resetRecordsList);
      this.listenTo(this.collection, "add", this.addRecord);
      return this.listenTo(this.collection, "remove", this.removeRecord);
    };

    RecordsView.prototype.render = function() {
      $(this.container).html(this.$el.html(''));
      this.$el.before(this.template({
        title: 'Records'
      }));
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

  Tracktime.AdminView.UserView = (function(superClass) {
    extend(UserView, superClass);

    function UserView() {
      this.sendForm = bind(this.sendForm, this);
      return UserView.__super__.constructor.apply(this, arguments);
    }

    UserView.prototype.tagName = 'li';

    UserView.prototype.className = 'list-group-item shadow-z-1';

    UserView.prototype.template = JST['users/admin_user'];

    UserView.prototype.events = {
      'click .btn.delete': "deleteUser",
      'click .subject': "toggleInlineEdit",
      'click .edit.btn': "editUser"
    };

    UserView.prototype.initialize = function() {
      if (!this.model.get('isDeleted')) {
        this.render();
      }
      this.listenTo(this.model, "change:isDeleted", this.changeIsDeleted);
      this.listenTo(this.model, "change:name", this.changeName);
      this.listenTo(this.model, "change:isEdit", this.changeIsEdit);
      return this.listenTo(this.model, "sync", this.syncModel);
    };

    UserView.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    UserView.prototype.render = function() {
      var textarea;
      this.$el.html(this.template(this.model.toJSON()));
      $('.subject_edit', this.$el).on('keydown', this.fixEnter).textareaAutoSize();
      textarea = new Tracktime.Element.Textarea({
        model: this.model,
        className: 'subject_edit form-control hidden',
        field: 'name'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      return textarea.on('tSubmit', this.sendForm);
    };

    UserView.prototype.changeIsEdit = function() {
      return this.$el.toggleClass('editmode', this.model.isEdit === true);
    };

    UserView.prototype.syncModel = function(model, options, params) {
      model.isEdit = false;
      model.trigger('change:isEdit');
      return model.trigger('change:name');
    };

    UserView.prototype.changeIsDeleted = function() {
      return this.$el.remove();
    };

    UserView.prototype.changeName = function() {
      $('.subject', this.$el).html((this.model.get('name') + '').nl2br());
      return $('.name_edit', this.$el).val(this.model.get('name'));
    };

    UserView.prototype.toggleInlineEdit = function() {
      this.$el.find('.subject_edit').css('min-height', this.$el.find('.subject').height());
      this.$el.find('.subject, .subject_edit').css('border', 'apx solid blue').toggleClass('hidden');
      return this.$el.find('.subject_edit').textareaAutoSize().focus();
    };

    UserView.prototype.sendForm = function() {
      this.toggleInlineEdit();
      return this.model.save({}, {
        ajaxSync: Tracktime.AppChannel.request('isOnline'),
        success: function(model, respond) {
          return $.alert({
            content: 'update user',
            timeout: 2000,
            style: 'btn-info'
          });
        }
      });
    };

    UserView.prototype.editUser = function() {
      return $('.scrollWrapper').animate({
        'scrollTop': this.$el.offset().top - $('.scrollWrapper').offset().top + $('.scrollWrapper').scrollTop()
      }, 400, (function(_this) {
        return function(event) {
          _this.model.isEdit = true;
          return _this.model.trigger('change:isEdit');
        };
      })(this));
    };

    UserView.prototype.deleteUser = function(event) {
      event.preventDefault();
      return this.model.destroy({
        ajaxSync: Tracktime.AppChannel.request('isOnline'),
        success: function(model, respond) {
          return $.alert({
            content: 'delete user',
            timeout: 2000,
            style: 'btn-danger'
          });
        }
      });
    };

    return UserView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.UserView : void 0) || (this.Tracktime.AdminView.UserView = Tracktime.AdminView.UserView);

  Tracktime.UserView = (function(superClass) {
    extend(UserView, superClass);

    function UserView() {
      return UserView.__super__.constructor.apply(this, arguments);
    }

    UserView.prototype.container = '#main';

    UserView.prototype.template = JST['users/user'];

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

    Details.prototype.template = JST['users/details'];

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

    Rates.prototype.template = JST['users/rates'];

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
