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
      actions: 'actions',
      users: 'users'
    }
  };

  test = {
    SERVER: 'http://localhost:5000',
    collection: {
      records: 'records',
      projects: 'projects',
      actions: 'actions',
      users: 'users'
    }
  };

  development = {
    SERVER: 'http://localhost:5000',
    collection: {
      records: 'records',
      projects: 'projects',
      actions: 'actions',
      users: 'users'
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
      title: 'TrackTime App',
      authUser: null
    };

    Tracktime.prototype.initialize = function() {
      this.set('authUser', new Tracktime.User.Auth());
      this.listenTo(this.get('authUser'), 'change:authorized', this.changeUserStatus);
      return this.listenTo(this.get('authUser'), 'destroy', function() {
        this.set('authUser', new Tracktime.User.Auth());
        return this.listenTo(this.get('authUser'), 'change:authorized', this.changeUserStatus);
      });
    };

    Tracktime.prototype.initCollections = function() {
      this.set('users', new Tracktime.UsersCollection());
      this.set('records', new Tracktime.RecordsCollection());
      this.set('projects', new Tracktime.ProjectsCollection());
      this.set('actions', new Tracktime.ActionsCollection());
      return this.listenTo(Tracktime.AppChannel, "isOnline", this.updateApp);
    };

    Tracktime.prototype.unsetCollections = function() {
      this.unset('users');
      this.unset('actions');
      this.unset('records');
      this.unset('projects');
      return this.stopListening(Tracktime.AppChannel, "isOnline");
    };

    Tracktime.prototype.updateApp = function() {
      this.get('users').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
      this.get('records').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
      return this.get('projects').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline')
      });
    };

    Tracktime.prototype.changeUserStatus = function() {
      return this.setUsetStatus(this.get('authUser').get('authorized'));
    };

    Tracktime.prototype.setUsetStatus = function(status) {
      if (status === true) {
        this.initCollections();
        return Tracktime.AppChannel.command('userAuth');
      } else {
        this.unsetCollections();
        return Tracktime.AppChannel.command('userGuest');
      }
    };

    return Tracktime;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime : void 0) || (this.Tracktime = Tracktime);

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

  Backbone.Validation.configure;

  _.extend(Backbone.Model.prototype, Backbone.Validation.mixin);

  Backbone.ViewMixin = {
    close: function() {
      if (this.onClose) {
        this.onClose();
      }
      if (this.container != null) {
        $(this.container).unbind();
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
        view.close();
        results.push(delete this.views[key]);
      }
      return results;
    },
    clear: function() {
      return this.onClose();
    },
    setSubView: function(key, view) {
      if (key in this.views) {
        this.views[key].close();
      }
      return this.views[key] = view;
    },
    getSubView: function(key) {
      if (key in this.views) {
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
    var localeData, moment;
    moment = window.moment;
    localeData = moment.localeData('ru');
    return moment(date).format("MMM Do YYYY");
  });

  Handlebars.registerHelper('minuteFormat', function(val) {
    var duration;
    duration = moment.duration(val, 'minute');
    return duration.get('hours') + ':' + duration.get('minutes');
  });

  Handlebars.registerHelper('placeholder', function(name) {
    var placeholder;
    placeholder = "<placeholder id='" + name + "'></placeholder>";
    return new Handlebars.SafeString(placeholder);
  });

  Handlebars.registerHelper('filteredHref', function(options) {
    var parsedFilter;
    parsedFilter = {};
    if ('filter' in options.hash) {
      _.extend(parsedFilter, options.hash.filter);
    }
    if ('user' in options.hash) {
      _.extend(parsedFilter, {
        user: options.hash.user
      });
    }
    if ('project' in options.hash) {
      _.extend(parsedFilter, {
        project: options.hash.project
      });
    }
    if ('exclude' in options.hash && options.hash.exclude in parsedFilter) {
      delete parsedFilter[options.hash.exclude];
    }
    if (_.keys(parsedFilter).length > 0) {
      return '/' + _.map(parsedFilter, function(value, key) {
        return key + "/" + value;
      }).join('/');
    } else {
      return '';
    }
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

  String.prototype.letter = function() {
    return this.charAt(0).toUpperCase();
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
          var curModel, localModel, localUpdatetAt, modelUpdatetAt;
          curModel = _this.get(model._id);
          localModel = _this.localStorage.find(curModel);
          if (!localModel) {
            return curModel.save({
              ajaxSync: false
            });
          } else {
            modelUpdatetAt = (new Date(model.updatedAt)).getTime();
            localUpdatetAt = (new Date(localModel.updatedAt)).getTime();
            if (localModel.isDeleted) {
              return curModel.set({
                'isDeleted': true
              }, {
                trigger: false
              });
            } else if (localUpdatetAt < modelUpdatetAt) {
              return curModel.save(model, {
                ajaxSync: false
              });
            } else if (localUpdatetAt > modelUpdatetAt) {
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
          var collectionModel, destroedModel, modelUpdatetAt, newModel, replacedModel;
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
              modelUpdatetAt = (new Date(model.updatedAt)).getTime();
              if ((collectionModel != null) && modelUpdatetAt > (new Date(collectionModel.get('updatedAt'))).getTime()) {
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

    Action.prototype.collectionName = config.collection.actions;

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

  Tracktime.Action.Project = (function(superClass) {
    extend(Project, superClass);

    function Project() {
      return Project.__super__.constructor.apply(this, arguments);
    }

    Project.prototype.defaults = _.extend({}, Tracktime.Action.prototype.defaults, {
      title: 'Add project',
      projectModel: null,
      formAction: '#',
      btnClass: 'btn-material-purple',
      btnClassEdit: 'btn-material-blue',
      navbarClass: 'navbar-inverse',
      icon: {
        className: 'mdi-content-add-circle',
        classNameEdit: 'mdi-content-add-circle-outline',
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
      btnClass: 'btn-material-green',
      btnClassEdit: 'btn-material-lime',
      navbarClass: 'navbar-primary',
      icon: {
        className: 'mdi-action-bookmark',
        classNameEdit: 'mdi-action-bookmark-outline',
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
      btnClassEdit: 'btn-white',
      navbarClass: 'navbar-material-light-blue',
      icon: {
        className: 'mdi-action-search',
        classNameEdit: 'mdi-action-search',
        letter: ''
      },
      isActive: null,
      isVisible: true
    });

    Search.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      return this.set(options);
    };

    Search.prototype.processAction = function(options) {
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
      btnClass: 'btn-material-deep-orange',
      btnClassEdit: 'btn-material-amber',
      navbarClass: 'navbar-material-yellow',
      icon: {
        className: 'mdi-social-person',
        classNameEdit: 'mdi-social-person-outline',
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
      updatedAt: (new Date()).toISOString(),
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
      this.on('change:name', this.updateUpdatedAt);
      return this.on('change:isEdit', this.changeIsEdit);
    };

    Project.prototype.isValid = function() {
      return true;
    };

    Project.prototype.updateUpdatedAt = function() {
      return this.set('updatedAt', (new Date()).toISOString());
    };

    Project.prototype.changeIsEdit = function() {
      if (this.isEdit) {
        return Tracktime.AppChannel.command('addAction', {
          title: 'Edit project',
          type: 'Project',
          canClose: true
        }, {
          title: 'Edit project: ' + this.get('name').substr(0, 40),
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
      updatedAt: (new Date()).toISOString(),
      recordDate: '',
      recordTime: 0,
      project: 0,
      user: 0,
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
      this.on('change:subject change:recordTime change:recordDate change:project', this.updateUpdatedAt);
      return this.on('change:isEdit', this.changeIsEdit);
    };

    Record.prototype.isValid = function() {
      return true;
    };

    Record.prototype.isSatisfied = function(filter) {
      return _.isMatch(this.attributes, filter);
    };

    Record.prototype.updateUpdatedAt = function() {
      return this.set('updatedAt', new Date());
    };

    Record.prototype.changeIsEdit = function() {
      if (this.isEdit) {
        return Tracktime.AppChannel.command('addAction', {
          title: 'Edit record',
          type: 'Record',
          canClose: true
        }, {
          title: 'Edit record: ' + this.get('subject').substr(0, 40),
          recordModel: this,
          scope: 'edit:action'
        });
      }
    };

    Record.prototype.addTime = function(diff) {
      var time;
      time = parseInt(this.get('recordTime'), 10);
      this.set('recordTime', time + diff);
      return this.save({}, {
        ajaxSync: true
      });
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
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      description: '',
      default_pay_rate: '',
      updatedAt: (new Date()).toISOString(),
      activeRecord: '',
      startedAt: null,
      isDeleted: false
    };

    User.prototype.validation = {
      first_name: {
        required: true,
        minLength: 4,
        msg: 'Please enter a valid first_name'
      }
    };

    User.prototype.initialize = function() {
      this.isEdit = false;
      this.on('change:first_name', this.updateUpdatedAt);
      this.on('change:last_name', this.updateUpdatedAt);
      this.on('change:description', this.updateUpdatedAt);
      return this.on('change:isEdit', this.changeIsEdit);
    };

    User.prototype.isValid = function() {
      return true;
    };

    User.prototype.updateUpdatedAt = function() {
      return this.set('updatedAt', (new Date()).toISOString());
    };

    User.prototype.changeIsEdit = function() {
      if (this.isEdit) {
        return Tracktime.AppChannel.command('addAction', {
          title: 'Edit user',
          type: 'User',
          canClose: true
        }, {
          title: 'Edit user: ' + this.get('first_name').substr(0, 40),
          userModel: this,
          scope: 'edit:action'
        });
      }
    };

    return User;

  })(Tracktime.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.User : void 0) || (this.Tracktime.User = Tracktime.User);

  Tracktime.User.Auth = (function(superClass) {
    extend(Auth, superClass);

    function Auth() {
      return Auth.__super__.constructor.apply(this, arguments);
    }

    Auth.prototype.idAttribute = "_id";

    Auth.prototype.urlRoot = config.SERVER + '/' + '';

    Auth.prototype.defaults = {
      authorized: null
    };

    Auth.prototype.initialize = function() {
      return this.fetch({
        ajaxSync: true,
        url: config.SERVER + '/auth_user',
        success: (function(_this) {
          return function(model, response, options) {
            return _this.set('authorized', true);
          };
        })(this),
        error: (function(_this) {
          return function(model, response, options) {
            return _this.set('authorized', false);
          };
        })(this)
      });
    };

    Auth.prototype.login = function(params) {
      return this.save(params, {
        ajaxSync: true,
        url: config.SERVER + '/login',
        success: (function(_this) {
          return function(model, response, options) {
            _this.set(response);
            _this.set('authorized', true);
            $.alert("Welcome back, " + response.first_name + " " + response.last_name + "!");
            return window.location.hash = '#records';
          };
        })(this),
        error: (function(_this) {
          return function(model, response, options) {
            if (response.responseJSON != null) {
              return _this.trigger('flash', response.responseJSON.error);
            } else {
              return _this.trigger('flash', {
                scope: "unknown",
                msg: 'Send request error'
              });
            }
          };
        })(this)
      });
    };

    Auth.prototype.signin = function(params) {
      _.extend(params, {
        status: 'active',
        k_status: 'active',
        updatedAt: (new Date()).toISOString(),
        isDeleted: 'false'
      });
      return this.save(params, {
        ajaxSync: true,
        url: config.SERVER + '/register',
        success: (function(_this) {
          return function(model, response, options) {
            _this.set(response);
            _this.set('authorized', true);
            return $.alert("Welcome, " + response.name + " !");
          };
        })(this),
        error: (function(_this) {
          return function(model, response, options) {
            return _this.trigger('flash', response.responseJSON.error);
          };
        })(this)
      });
    };

    Auth.prototype.forgotpasswrod = function() {};

    Auth.prototype.fullName = function() {
      return (this.get('first_name')) + " " + (this.get('last_name'));
    };

    Auth.prototype.logout = function() {
      $.alert("Goodbay, " + (this.fullName()) + "!");
      this.set('authorized', false);
      return this.destroy({
        ajaxSync: true,
        url: config.SERVER + '/logout/' + this.id,
        success: (function(_this) {
          return function(model, response, options) {
            window.location.href = '#';
            return window.location.reload();
          };
        })(this),
        error: (function(_this) {
          return function(model, response, options) {
            return console.log('logout error');
          };
        })(this)
      });
    };

    Auth.prototype.setActiveRecord = function(record, status) {
      var params;
      if (this.get('activeRecord')) {
        Tracktime.AppChannel.command('addTime', this.get('activeRecord'), this.get('startedAt'));
      }
      if (status) {
        params = {
          activeRecord: record.id,
          startedAt: (new Date()).toISOString()
        };
      } else {
        params = {
          activeRecord: '',
          startedAt: null
        };
      }
      return this.save(params, {
        ajaxSync: true,
        url: config.SERVER + '/users/' + this.id,
        success: (function(_this) {
          return function(model, response, options) {
            return record.trigger('isActive', status);
          };
        })(this),
        error: (function(_this) {
          return function(model, response, options) {
            return _this.trigger('flash', response.responseJSON.error);
          };
        })(this)
      });
    };

    return Auth;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.User.Auth : void 0) || (this.Tracktime.User.Auth = Tracktime.User.Auth);

  Tracktime.ActionsCollection = (function(superClass) {
    extend(ActionsCollection, superClass);

    function ActionsCollection() {
      this.addAction = bind(this.addAction, this);
      return ActionsCollection.__super__.constructor.apply(this, arguments);
    }

    ActionsCollection.prototype.model = Tracktime.Action;

    ActionsCollection.prototype.collectionName = config.collection.actions;

    ActionsCollection.prototype.url = '/actions';

    ActionsCollection.prototype.localStorage = new Backbone.LocalStorage(ActionsCollection.collectionName);

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
      if (params == null) {
        params = {};
      }
      if (Tracktime.Action[action.type]) {
        return this.push(new Tracktime.Action[action.type](_.extend(action, params)));
      }
    };

    ActionsCollection.prototype.setDefaultActive = function() {
      if (!this.findWhere({
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

    ProjectsCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/projects';

    ProjectsCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/projects';

    ProjectsCollection.prototype.localStorage = new Backbone.LocalStorage(ProjectsCollection.collectionName);

    ProjectsCollection.prototype.initialize = function() {
      return this.on('sync', this.makeList);
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

    ProjectsCollection.prototype.makeList = function() {
      var list;
      list = {};
      _.each(this.models, function(model, index) {
        return list[model.get('_id')] = model.get('name');
      });
      return Tracktime.AppChannel.reply('projectsList', function() {
        return list;
      });
    };

    ProjectsCollection.prototype.useProject = function(id) {
      var project, useCount;
      project = this.get(id);
      if (project.has('useCount')) {
        useCount = project.get('useCount') + 1;
      } else {
        useCount = 1;
      }
      return project.save({
        'useCount': useCount
      }, {
        ajaxSync: false
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

    RecordsCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/records';

    RecordsCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/records';

    RecordsCollection.prototype.localStorage = new Backbone.LocalStorage(RecordsCollection.collectionName);

    RecordsCollection.prototype.initialize = function() {
      this.filter = {};
      return this.defaultFilter = {
        isDeleted: false
      };
    };

    RecordsCollection.prototype.comparator = function(model) {
      return -(new Date(model.get('date'))).getTime();
    };

    RecordsCollection.prototype.setFilter = function(filter) {
      var pairs;
      this.resetFilter();
      if (filter !== null) {
        pairs = filter.match(/((user|project)\/[a-z0-9A-Z]{24})+/g);
        if (pairs) {
          _.each(pairs, function(pair, index) {
            var _p;
            _p = pair.split('/');
            return this.filter[_p[0]] = _p[1];
          }, this);
        }
      }
      return this.filter;
    };

    RecordsCollection.prototype.resetFilter = function() {
      return this.filter = _.clone(this.defaultFilter);
    };

    RecordsCollection.prototype.removeFilter = function(key) {
      if (key in this.filter) {
        return delete this.filter[key];
      }
    };

    RecordsCollection.prototype.getFilter = function(removeDefault) {
      var keys, result;
      if (removeDefault == null) {
        removeDefault = true;
      }
      result = {};
      if (removeDefault) {
        keys = _.keys(this.defaultFilter);
        result = _.omit(this.filter, keys);
      } else {
        result = this.filter;
      }
      return result;
    };

    RecordsCollection.prototype.addRecord = function(options) {
      var error, success;
      _.extend(options, {
        date: (new Date()).toISOString()
      });
      if (_.isEmpty(options.recordDate)) {
        options.recordDate = (new Date()).toISOString();
      }
      success = (function(_this) {
        return function(result) {
          $.alert({
            content: 'Record: save success',
            timeout: 2000,
            style: 'btn-success'
          });
          return _this.trigger('newRecord', result);
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

    RecordsCollection.prototype.getModels = function(except) {
      var fmodels, limit, models, outmodels;
      if (except == null) {
        except = [];
      }
      models = {};
      limit = 6;
      if (this.length > 0) {
        fmodels = _.filter(this.models, (function(_this) {
          return function(model) {
            return model.isSatisfied(_this.filter);
          };
        })(this));
        models = fmodels;
      } else {
        models = this.models;
      }
      outmodels = _.filter(models, function(model) {
        return _.indexOf(except, model.id) === -1;
      });
      return _.first(outmodels, limit);
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

    UsersCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/users';

    UsersCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/users';

    UsersCollection.prototype.localStorage = new Backbone.LocalStorage(UsersCollection.collectionName);

    UsersCollection.prototype.initialize = function() {
      return this.on('sync', this.makeList);
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

    UsersCollection.prototype.makeList = function(collection, models) {
      var list;
      list = {};
      _.each(collection.models, function(model, index) {
        return list[model.get('_id')] = (model.get('first_name')) + " " + (model.get('last_name'));
      });
      return Tracktime.AppChannel.reply('usersList', function() {
        return list;
      });
    };

    return UsersCollection;

  })(Tracktime.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.UsersCollection : void 0) || (this.Tracktime.UsersCollection = Tracktime.UsersCollection);

  Tracktime.AppChannel = Backbone.Radio.channel('app');

  _.extend(Tracktime.AppChannel, {
    isOnline: null,
    userStatus: null,
    router: null,
    init: function() {
      this.on('isOnline', (function(_this) {
        return function(status) {
          return _this.isOnline = status;
        };
      })(this));
      this.on('userStatus', (function(_this) {
        return function(status) {
          return _this.changeUserStatus(status);
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
        'useProject': this.useProject,
        'addAction': this.addAction,
        'serverOnline': this.serverOnline,
        'serverOffline': this.serverOffline,
        'checkOnline': this.checkOnline,
        'userAuth': this.userAuth,
        'userGuest': this.userGuest,
        'activeRecord': this.activeRecord,
        'addTime': this.addTime
      });
    },
    bindRequest: function() {
      this.reply('isOnline', (function(_this) {
        return function() {
          return _this.isOnline;
        };
      })(this));
      this.reply('userStatus', (function(_this) {
        return function() {
          return _this.userStatus;
        };
      })(this));
      this.reply('projects', (function(_this) {
        return function() {
          return _this.model.get('projects');
        };
      })(this));
      this.reply('users', (function(_this) {
        return function() {
          return _this.model.get('users');
        };
      })(this));
      this.reply('projectsList', (function(_this) {
        return function() {
          return {};
        };
      })(this));
      return this.reply('usersList', (function(_this) {
        return function() {
          return {};
        };
      })(this));
    },
    startApp: function() {
      return Backbone.history.start({
        pushState: false
      });
    },
    newRecord: function(options) {
      _.extend(options, {
        user: this.model.get('authUser').id
      });
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
    activeRecord: function(record, status) {
      return this.model.get('authUser').setActiveRecord(record, status);
    },
    addTime: function(record, start) {
      return this.model.get('records').get(record).addTime(moment(new Date()).diff(new Date(start), 'second'));
    },
    serverOnline: function() {
      return this.trigger('isOnline', true);
    },
    useProject: function(id) {
      return this.model.get('projects').useProject(id);
    },
    serverOffline: function() {
      return this.trigger('isOnline', false);
    },
    userAuth: function() {
      return this.trigger('userStatus', true);
    },
    userGuest: function() {
      return this.trigger('userStatus', false);
    },
    changeUserStatus: function(status) {
      if (this.router !== null) {
        this.router.view.close();
        delete this.router.view;
      }
      if (status === true) {
        this.router = new Tracktime.AppRouter({
          model: this.model
        });
        return this.trigger('isOnline', this.isOnline);
      } else {
        return this.router = new Tracktime.GuestRouter({
          model: this.model
        });
      }
    },
    checkActive: function(id) {
      return id === this.model.get('authUser').get('activeRecord');
    }
  });

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppChannel : void 0) || (this.Tracktime.AppChannel = Tracktime.AppChannel);

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
      var model;
      model = this.model.toJSON();
      if (model.canClose) {
        model.btnClass = model.btnClassEdit;
        model.icon.className = model.icon.classNameEdit;
      }
      return this.$el.attr('class', "btn btn-fab " + model.btnClass + " dropdown-toggle ").find('i').attr('title', model.title).attr('class', model.icon.className).html(model.icon.letter);
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
      var model;
      model = this.model.toJSON();
      if (model.canClose) {
        model.btnClass = model.btnClassEdit;
        model.icon.className = model.icon.classNameEdit;
      }
      this.$el.html(this.template(model));
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

    Project.prototype.container = '.action-wrapper';

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
        placeholder: this.model.get('title'),
        field: 'name'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      $.material.input("[name=" + textarea.name + "]");
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
          return $(".details-container").toggleClass('hidden', _.isEmpty($(event.currentTarget).val()));
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
      return Record.__super__.constructor.apply(this, arguments);
    }

    Record.prototype.container = '.action-wrapper';

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
      var projectDefinition, textarea;
      $(this.container).html(this.$el.html(this.template(this.model.toJSON())));
      textarea = new Tracktime.Element.Textarea({
        model: this.model.get('recordModel'),
        placeholder: this.model.get('title'),
        field: 'subject'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      $.material.input("[name=" + textarea.name + "]");
      textarea.$el.textareaAutoSize().focus();
      window.setTimeout((function(_this) {
        return function() {
          return textarea.$el.trigger('input');
        };
      })(this), 100);
      textarea.on('tSubmit', this.sendForm);
      $('placeholder#slider', this.$el).replaceWith((new Tracktime.Element.Slider({
        model: this.model.get('recordModel'),
        field: 'recordTime'
      })).$el);
      $('placeholder#selectday', this.$el).replaceWith((new Tracktime.Element.SelectDay({
        model: this.model.get('recordModel'),
        field: 'recordDate'
      })).$el);
      projectDefinition = new Tracktime.Element.ProjectDefinition({
        model: this.model.get('recordModel'),
        field: 'project'
      });
      $('.floating-label', "#actions-form").append(projectDefinition.$el);
      if (this.model.get('canClose')) {
        $('placeholder#btn_close_action', this.$el).replaceWith((new Tracktime.Element.ElementCloseAction({
          model: this.model
        })).$el);
      }
      return $('[data-toggle="tooltip"]').tooltip();
    };

    Record.prototype.textareaInput = function(event) {
      var diff;
      diff = $('#actions-form').outerHeight() - $('.navbar').outerHeight(true);
      $('#actions-form').toggleClass("shadow-z-2", diff > 10);
      return $(".details-container").toggleClass('hidden', _.isEmpty($(event.target).val()));
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

    Search.prototype.container = '.action-wrapper';

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

    User.prototype.container = '.action-wrapper';

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
        placeholder: this.model.get('title'),
        field: 'first_name'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      $.material.input("[name=" + textarea.name + "]");
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

  Tracktime.AdminView.ActionView = (function(superClass) {
    extend(ActionView, superClass);

    function ActionView() {
      return ActionView.__super__.constructor.apply(this, arguments);
    }

    ActionView.prototype.tagName = 'li';

    ActionView.prototype.className = 'list-group-item';

    ActionView.prototype.template = JST['actions/admin_action'];

    ActionView.prototype.events = {
      'click .btn-call-action': "callAction",
      'click .edit.btn': "editAction"
    };

    ActionView.prototype.initialize = function() {
      return this.render();
    };

    ActionView.prototype.render = function() {
      return this.$el.html(this.template(this.model.toJSON()));
    };

    ActionView.prototype.editAction = function() {};

    ActionView.prototype.callAction = function() {
      return $.alert('Test action call');
    };

    return ActionView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.ActionView : void 0) || (this.Tracktime.AdminView.ActionView = Tracktime.AdminView.ActionView);

  Tracktime.AdminView.ActionsView = (function(superClass) {
    extend(ActionsView, superClass);

    function ActionsView() {
      return ActionsView.__super__.constructor.apply(this, arguments);
    }

    ActionsView.prototype.container = '#main';

    ActionsView.prototype.template = JST['admin/actions'];

    ActionsView.prototype.templateHeader = JST['admin/actions_header'];

    ActionsView.prototype.tagName = 'ul';

    ActionsView.prototype.className = 'list-group';

    ActionsView.prototype.views = {};

    ActionsView.prototype.actionsTypes = ['Project', 'Record', 'User', 'Search'];

    ActionsView.prototype.initialize = function() {
      return this.render();
    };

    ActionsView.prototype.render = function() {
      $(this.container).html(this.$el.html(''));
      this.$el.before(this.template({
        title: 'Actions'
      }));
      this.$el.prepend(this.templateHeader());
      return this.renderActionsList();
    };

    ActionsView.prototype.renderActionsList = function() {
      return _.each(this.actionsTypes, (function(_this) {
        return function(atype) {
          var actionView;
          actionView = new Tracktime.AdminView.ActionView({
            model: new Tracktime.Action[atype]()
          });
          _this.$el.append(actionView.el);
          return _this.setSubView("atype-" + atype, actionView);
        };
      })(this), this);
    };

    return ActionsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AdminView.ActionsView : void 0) || (this.Tracktime.AdminView.ActionsView = Tracktime.AdminView.ActionsView);

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

    ProjectsView.prototype.views = {};

    ProjectsView.prototype.initialize = function() {
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

    UsersView.prototype.views = {};

    UsersView.prototype.initialize = function() {
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

    AppView.prototype.container = '#panel';

    AppView.prototype.className = '';

    AppView.prototype.template = JST['global/app'];

    AppView.prototype.views = {};

    AppView.prototype.initialize = function() {
      return this.render();
    };

    AppView.prototype.render = function() {
      return $(this.container).html(this.$el.html(this.template(this.model.toJSON())));
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

  Tracktime.Element.ProjectDefinition = (function(superClass) {
    extend(ProjectDefinition, superClass);

    function ProjectDefinition() {
      this.selectProject = bind(this.selectProject, this);
      this.renderList = bind(this.renderList, this);
      this.setSearch = bind(this.setSearch, this);
      return ProjectDefinition.__super__.constructor.apply(this, arguments);
    }

    ProjectDefinition.prototype.className = 'project_definition';

    ProjectDefinition.prototype.template = JST['elements/project_definition'];

    ProjectDefinition.prototype.defaultTitle = 'Select project';

    ProjectDefinition.prototype.searchStr = '';

    ProjectDefinition.prototype.events = {
      'click .btn-white': 'selectProject'
    };

    ProjectDefinition.prototype.initialize = function(options) {
      if (options == null) {
        options = {};
      }
      _.extend(this, options);
      this.render();
      this.projects = Tracktime.AppChannel.request('projects');
      this.projectsList = Tracktime.AppChannel.request('projectsList');
      return this.projects.on('sync', this.renderList);
    };

    ProjectDefinition.prototype.render = function() {
      this.$el.html(this.template({
        title: this.defaultTitle
      }));
      this.renderList();
      $('.input-cont', this.$el).on('click', function(event) {
        return event.stopPropagation();
      });
      return $('.input-cont input', this.$el).on('keyup', this.setSearch);
    };

    ProjectDefinition.prototype.setSearch = function(event) {
      this.searchStr = $(event.currentTarget).val().toLowerCase();
      return this.renderList();
    };

    ProjectDefinition.prototype.getList = function(limit) {
      var i, keys, sublist;
      if (limit == null) {
        limit = 5;
      }
      this.projectsList = Tracktime.AppChannel.request('projectsList');
      keys = _.keys(this.projectsList);
      if (!_.isEmpty(this.searchStr)) {
        keys = _.filter(keys, (function(_this) {
          return function(key) {
            return _this.projectsList[key].toLowerCase().indexOf(_this.searchStr) > -1;
          };
        })(this));
      }
      sublist = {};
      i = 0;
      limit = Math.min(limit, keys.length);
      while (i < limit) {
        sublist[keys[i]] = this.projectsList[keys[i]];
        i++;
      }
      return sublist;
    };

    ProjectDefinition.prototype.renderList = function() {
      var key, list, menu, value;
      list = this.getList();
      menu = $('.dropdown-menu', this.$el);
      menu.children('.item').remove();
      this.updateTitle();
      for (key in list) {
        if (!hasProp.call(list, key)) continue;
        value = list[key];
        menu.append($("<li class='item'><a class='btn btn-white' data-project='" + key + "' href='#" + key + "'>" + value + "</a></li>"));
      }
      return menu.append($("<li class='item'><a class='btn btn-white' data-project='0' href='#0'><span class='text-muted'>No project</span></a></li>"));
    };

    ProjectDefinition.prototype.getTitle = function() {
      var projectId;
      projectId = this.model.get(this.field);
      if (projectId in this.projectsList) {
        return "to " + this.projectsList[projectId];
      } else {
        return this.defaultTitle;
      }
    };

    ProjectDefinition.prototype.selectProject = function(event) {
      var projectId;
      event.preventDefault();
      projectId = $(event.currentTarget).data('project');
      this.model.set(this.field, projectId);
      Tracktime.AppChannel.command('useProject', projectId);
      this.updateTitle();
      return this.$el.parents('.form-control-wrapper').find('textarea').focus();
    };

    ProjectDefinition.prototype.updateTitle = function() {
      return $('.project_definition-toggler span.caption', this.$el).text(this.getTitle());
    };

    return ProjectDefinition;

  })(Tracktime.Element);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Element.ProjectDefinition : void 0) || (this.Tracktime.Element.ProjectDefinition = Tracktime.Element.ProjectDefinition);

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
      return this.$el.html(this.template(this.setDays()));
    };

    SelectDay.prototype.setDays = function() {
      var localeData, moment;
      moment = window.moment;
      localeData = moment.localeData('ru');
      return {
        current: {
          name: localeData.weekdays(moment()),
          day: moment().format("MMM Do YYYY"),
          value: moment().toISOString()
        },
        days: [
          {
            name: localeData.weekdays(moment().subtract(2, 'days')),
            day: moment().subtract(2, 'day').format("MMM Do YYYY"),
            value: moment().subtract(2, 'day').toISOString()
          }, {
            name: localeData.weekdays(moment().subtract(1, 'day')),
            day: moment().subtract(1, 'day').format("MMM Do YYYY"),
            value: moment().subtract(1, 'day').toISOString()
          }, {
            name: localeData.weekdays(moment()),
            day: moment().format("MMM Do YYYY"),
            value: moment().toISOString()
          }
        ]
      };
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
      return this.changeInput($(event.currentTarget).data('value'));
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

    Textarea.prototype.name = 'action_text';

    Textarea.prototype.tagName = 'textarea';

    Textarea.prototype.className = 'form-control floating-label';

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
      this.name = this.name + "-" + this.model.cid;
      this.render();
      return this.listenTo(this.model, "change:" + this.field, this.changeField);
    };

    Textarea.prototype.render = function() {
      this.$el.attr('name', this.name);
      this.$el.attr('placeholder', this.placeholder);
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
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        return this.trigger('tSubmit');
      }
    };

    return Textarea;

  })(Tracktime.Element);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Element.Textarea : void 0) || (this.Tracktime.Element.Textarea = Tracktime.Element.Textarea);

  Tracktime.GuestView = (function(superClass) {
    extend(GuestView, superClass);

    function GuestView() {
      return GuestView.__super__.constructor.apply(this, arguments);
    }

    GuestView.prototype.container = '#panel';

    GuestView.prototype.className = '';

    GuestView.prototype.template = JST['global/guest'];

    GuestView.prototype.views = {};

    GuestView.prototype.initialize = function() {
      return this.render();
    };

    GuestView.prototype.render = function() {
      $(this.container).html(this.$el.html(this.template(this.model.toJSON())));
      this.setSubView('login', new Tracktime.GuestView.Login({
        model: this.model
      }));
      this.setSubView('signin', new Tracktime.GuestView.Signin({
        model: this.model
      }));
      return this.setSubView('fopass', new Tracktime.GuestView.Fopass({
        model: this.model
      }));
    };

    GuestView.prototype.initUI = function() {
      return $.material.init();
    };

    return GuestView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView : void 0) || (this.Tracktime.AppView = Tracktime.AppView);

  Tracktime.GuestView.Fopass = (function(superClass) {
    extend(Fopass, superClass);

    function Fopass() {
      return Fopass.__super__.constructor.apply(this, arguments);
    }

    Fopass.prototype.el = '#forgotpassword';

    Fopass.prototype.events = {
      'click .btn-forgotpassword': 'forgotpasswordProcess'
    };

    Fopass.prototype.initialize = function() {};

    Fopass.prototype.forgotpasswordProcess = function(event) {
      event.preventDefault();
      return $.alert('fopass process');
    };

    return Fopass;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.GuestView.Fopass : void 0) || (this.Tracktime.GuestView.Fopass = Tracktime.GuestView.Fopass);

  Tracktime.GuestView.Login = (function(superClass) {
    extend(Login, superClass);

    function Login() {
      return Login.__super__.constructor.apply(this, arguments);
    }

    Login.prototype.el = '#login > form';

    Login.prototype.events = {
      'submit': 'loginProcess'
    };

    Login.prototype.initialize = function() {
      return this.listenTo(this.model.get('authUser'), 'flash', this.showFlash);
    };

    Login.prototype.loginProcess = function(event) {
      event.preventDefault();
      return this.model.get('authUser').login({
        email: $('[name=email]', this.$el).val(),
        password: $('[name=password]', this.$el).val()
      });
    };

    Login.prototype.showFlash = function(message) {
      return $.alert(message.scope.capitalizeFirstLetter() + (" Error: " + message.msg));
    };

    return Login;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.GuestView.Login : void 0) || (this.Tracktime.GuestView.Login = Tracktime.GuestView.Login);

  Tracktime.GuestView.Signin = (function(superClass) {
    extend(Signin, superClass);

    function Signin() {
      return Signin.__super__.constructor.apply(this, arguments);
    }

    Signin.prototype.el = '#signin > form';

    Signin.prototype.events = {
      'submit': 'signinProcess'
    };

    Signin.prototype.initialize = function() {
      return this.listenTo(this.model.get('authUser'), 'flash', this.showFlash);
    };

    Signin.prototype.signinProcess = function(event) {
      event.preventDefault();
      if (this.checkInput()) {
        return this.model.get('authUser').signin({
          first_name: $('[name=first_name]', this.$el).val(),
          last_name: $('[name=last_name]', this.$el).val(),
          email: $('[name=email]', this.$el).val(),
          password: $('[name=password]', this.$el).val()
        });
      }
    };

    Signin.prototype.checkInput = function() {
      var result;
      result = true;
      if (_.isEmpty($('[name=first_name]', this.$el).val())) {
        this.showFlash({
          scope: "Signin",
          msg: 'First Name empty'
        });
        result = false;
      }
      if (_.isEmpty($('[name=last_name]', this.$el).val())) {
        this.showFlash({
          scope: "Signin",
          msg: 'Last Name empty'
        });
        result = false;
      }
      if (_.isEmpty($('[name=email]', this.$el).val())) {
        this.showFlash({
          scope: "Signin",
          msg: 'Email empty'
        });
        result = false;
      }
      if (_.isEmpty($('[name=password]', this.$el).val())) {
        this.showFlash({
          scope: "Signin",
          msg: 'Password empty'
        });
        result = false;
      }
      if ($('[name=password]', this.$el).val() !== $('[name=repassword]', this.$el).val()) {
        this.showFlash({
          scope: "Signin",
          msg: 'Repassword incorrect'
        });
        result = false;
      }
      return result;
    };

    Signin.prototype.showFlash = function(message) {
      return $.alert({
        content: message.scope.capitalizeFirstLetter() + (" Error: " + message.msg),
        style: "btn-danger"
      });
    };

    return Signin;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.GuestView.Signin : void 0) || (this.Tracktime.GuestView.Signin = Tracktime.GuestView.Signin);

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
      $(this.container).html(this.$el.html(this.template()));
      return this.setSubView('actions', new Tracktime.ActionsView({
        collection: this.model.get('actions')
      }));
    };

    return Header;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Header : void 0) || (this.Tracktime.AppView.Header = Tracktime.AppView.Header);

  Tracktime.AppView.Main = (function(superClass) {
    extend(Main, superClass);

    function Main() {
      return Main.__super__.constructor.apply(this, arguments);
    }

    Main.prototype.el = '#main';

    Main.prototype.template = JST['layout/main'];

    Main.prototype.views = {};

    Main.prototype.initialize = function() {
      this.render();
      return this.bindEvents();
    };

    Main.prototype.render = function() {
      var ref1;
      this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0));
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
      this.renderSearchList = bind(this.renderSearchList, this);
      this.renderMenuList = bind(this.renderMenuList, this);
      this.setSearch = bind(this.setSearch, this);
      return Menu.__super__.constructor.apply(this, arguments);
    }

    Menu.prototype.container = '#menu';

    Menu.prototype.template = JST['layout/menu'];

    Menu.prototype.searchStr = '';

    Menu.prototype.events = {
      'change #isOnline': 'updateOnlineStatus'
    };

    Menu.prototype.initialize = function() {
      this.render();
      this.bindEvents();
      this.projects = Tracktime.AppChannel.request('projects');
      this.projectsList = Tracktime.AppChannel.request('projectsList');
      return this.projects.on('all', this.renderMenuList);
    };

    Menu.prototype.bindEvents = function() {
      this.listenTo(Tracktime.AppChannel, "isOnline", function(status) {
        return $('#isOnline').prop('checked', status);
      });
      this.slideout = new Slideout({
        'panel': $('#panel')[0],
        'menu': $('#menu')[0],
        'padding': 256,
        'tolerance': 70
      });
      $("#menuToggler").on('click', (function(_this) {
        return function() {
          return _this.slideout.toggle();
        };
      })(this));
      return $(".input-search", this.container).on('keyup', this.setSearch);
    };

    Menu.prototype.setSearch = function(event) {
      this.searchStr = $(event.currentTarget).val().toLowerCase();
      return this.searchProject();
    };

    Menu.prototype.searchProject = function(event) {
      return this.renderSearchList();
    };

    Menu.prototype.getSearchList = function(limit) {
      var i, keys, sublist;
      if (limit == null) {
        limit = 5;
      }
      this.projectsList = Tracktime.AppChannel.request('projectsList');
      keys = _.keys(this.projectsList);
      if (!_.isEmpty(this.searchStr)) {
        keys = _.filter(keys, (function(_this) {
          return function(key) {
            return _this.projectsList[key].toLowerCase().indexOf(_this.searchStr) > -1;
          };
        })(this));
      }
      sublist = {};
      i = 0;
      limit = Math.min(limit, keys.length);
      while (i < limit) {
        sublist[keys[i]] = this.projectsList[keys[i]];
        i++;
      }
      return sublist;
    };

    Menu.prototype.renderMenuList = function() {
      var i, keys, limit, menu, project, results;
      menu = $('#projects-section .list-style-group', this.container);
      menu.children('.project-link').remove();
      limit = 5;
      this.projectsList = Tracktime.AppChannel.request('projectsList');
      keys = _.keys(this.projectsList);
      if (keys.length > 0) {
        keys = _.sortBy(keys, (function(_this) {
          return function(key) {
            var count;
            count = _this.projects.get(key).get('useCount');
            count = count !== void 0 ? count : 0;
            return -count;
          };
        })(this));
        i = 0;
        results = [];
        while (i < limit) {
          project = this.projects.get(keys[i]);
          menu.append($("<a class='list-group-item project-link' href='#records/project/" + project.id + "'>" + (project.get('name')) + "</a>").on('click', 'a', this.navTo));
          results.push(i++);
        }
        return results;
      }
    };

    Menu.prototype.renderSearchList = function() {
      var key, list, menu, value;
      list = this.getSearchList();
      menu = $('.menu-projects', this.container);
      menu.children().remove();
      for (key in list) {
        if (!hasProp.call(list, key)) continue;
        value = list[key];
        menu.append($("<li><a href='#records/project/" + key + "'>" + value + "</a></li>").on('click', 'a', this.navTo));
      }
      if (_.size(list) > 0) {
        if (_.isEmpty(this.searchStr)) {
          return menu.dropdown().hide();
        } else {
          return menu.dropdown().show();
        }
      } else {
        return menu.dropdown().hide();
      }
    };

    Menu.prototype.navTo = function(event) {
      var href, projectId;
      href = $(event.currentTarget).attr('href');
      projectId = href.substr(-24);
      Tracktime.AppChannel.command('useProject', projectId);
      window.location.hash = href;
      return $('.menu-projects', this.container).dropdown().hide();
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

    Menu.prototype.close = function() {
      this.slideout.close();
      return Menu.__super__.close.apply(this, arguments);
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
      this.renderUserInfo = bind(this.renderUserInfo, this);
      this.renderProjectInfo = bind(this.renderProjectInfo, this);
      return RecordView.__super__.constructor.apply(this, arguments);
    }

    RecordView.prototype.tagName = 'li';

    RecordView.prototype.className = 'list-group-item shadow-z-1';

    RecordView.prototype.template = JST['records/record'];

    RecordView.prototype.events = {
      'click .btn.delete': "deleteRecord",
      'click .subject': "toggleInlineEdit",
      'click .edit.btn': "editRecord",
      'click .btn[role=do-active]': "toggleActive"
    };

    RecordView.prototype.initialize = function() {
      if (!this.model.get('isDeleted')) {
        this.render();
      }
      this.listenTo(this.model, "change:isDeleted", this.changeIsDeleted);
      this.listenTo(this.model, "change:subject", this.changeSubject);
      this.listenTo(this.model, "change:project", this.changeProject);
      this.listenTo(this.model, "change:recordTime", this.changeRecordTime);
      this.listenTo(this.model, "change:isEdit", this.changeIsEdit);
      this.listenTo(this.model, "sync", this.syncModel);
      this.listenTo(this.model, "isActive", this.setActiveState);
      this.projects = Tracktime.AppChannel.request('projects');
      this.projects.on('sync', this.renderProjectInfo);
      this.users = Tracktime.AppChannel.request('users');
      return this.users.on('sync', this.renderUserInfo);
    };

    RecordView.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    RecordView.prototype.render = function() {
      var textarea;
      this.$el.html(this.template(_.extend({
        filter: this.model.collection.getFilter()
      }, this.model.toJSON())));
      $('.subject_edit', this.$el).on('keydown', this.fixEnter).textareaAutoSize();
      textarea = new Tracktime.Element.Textarea({
        model: this.model,
        className: 'subject_edit form-control hidden',
        field: 'subject'
      });
      $('placeholder#textarea', this.$el).replaceWith(textarea.$el);
      textarea.on('tSubmit', this.sendForm);
      if (Tracktime.AppChannel.checkActive(this.model.id)) {
        this.$el.addClass('current');
      }
      this.changeRecordTime();
      this.renderProjectInfo();
      return this.renderUserInfo();
    };

    RecordView.prototype.toggleActive = function() {
      return Tracktime.AppChannel.command('activeRecord', this.model, !(Tracktime.AppChannel.checkActive(this.model.id)));
    };

    RecordView.prototype.setActiveState = function(status) {
      $('.list-group-item').removeClass('current');
      return this.$el.toggleClass('current', status);
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

    RecordView.prototype.changeRecordTime = function() {
      var duration, durationStr;
      duration = moment.duration(parseInt(this.model.get('recordTime'), 10), 'minute');
      durationStr = duration.get('hours') + ':' + duration.get('minutes');
      return $('.recordTime .value', this.$el).html(durationStr);
    };

    RecordView.prototype.changeProject = function() {
      return this.renderProjectInfo();
    };

    RecordView.prototype.renderProjectInfo = function() {
      var project_id, title;
      project_id = this.model.get('project');
      this.projectsList = Tracktime.AppChannel.request('projectsList');
      if (project_id in this.projectsList) {
        title = this.projectsList[project_id];
        $(".record-info-project span", this.$el).html(title);
        $(".record-info-project", this.$el).removeClass('hidden');
        return $(".btn.type i", this.$el).removeClass().addClass('letter').html(title.letter());
      } else {
        $(".record-info-project", this.$el).addClass('hidden');
        return $(".btn.type i", this.$el).removeClass().addClass('mdi-action-bookmark-outline').html('');
      }
    };

    RecordView.prototype.renderUserInfo = function() {
      var title, user_id;
      user_id = this.model.get('user');
      this.usersList = Tracktime.AppChannel.request('usersList');
      if (user_id in this.usersList) {
        title = this.usersList[user_id];
        $(".record-info-user span", this.$el).html(title);
        return $(".record-info-user", this.$el).removeClass('hidden');
      } else {
        return $(".record-info-user", this.$el).addClass('hidden');
      }
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
      this.removeFilter = bind(this.removeFilter, this);
      this.loadMoreRecords = bind(this.loadMoreRecords, this);
      this.autoLoadMoreRecords = bind(this.autoLoadMoreRecords, this);
      return RecordsView.__super__.constructor.apply(this, arguments);
    }

    RecordsView.prototype.container = '#main';

    RecordsView.prototype.template = JST['records/records'];

    RecordsView.prototype.tagName = 'ul';

    RecordsView.prototype.className = 'list-group';

    RecordsView.prototype.initialize = function() {
      this.views = {};
      this.render();
      this.listenTo(this.collection, "sync", this.resetRecordsList);
      this.listenTo(this.collection, "remove", this.removeRecord);
      this.listenTo(this.collection, "add", this.addRecord);
      this.listenTo(this.collection, "newRecord", this.newRecord);
      $('.removeFilter', this.container).on('click', this.removeFilter);
      $('.btn-loadmore', this.container).on('click', this.loadMoreRecords);
      $('.scrollWrapper').on('scroll', this.autoLoadMoreRecords);
      this.projects = Tracktime.AppChannel.request('projects');
      this.projects.on('sync', this.updateProjectInfo);
      this.users = Tracktime.AppChannel.request('users');
      return this.users.on('sync', this.updateUserInfo);
    };

    RecordsView.prototype.render = function() {
      $(this.container).html(this.$el.html(''));
      this.$el.before(this.template({
        title: 'Records',
        filter: this.collection.getFilter()
      }));
      this.resetRecordsList();
      this.updateProjectInfo();
      this.updateUserInfo();
      return $('.btn-loadmore', this.container).appendTo(this.container);
    };

    RecordsView.prototype.autoLoadMoreRecords = function(event) {
      var delta;
      delta = $(window).height() - $('.btn-loadmore').offset().top - $('.btn-loadmore').height();
      if (delta > 0) {
        return $('.btn-loadmore', this.container).click();
      }
    };

    RecordsView.prototype.loadMoreRecords = function(event) {
      var modelsNewCount;
      modelsNewCount = this.resetRecordsList();
      if (modelsNewCount > 0) {
        return $('.btn-loadmore', this.container).show().appendTo(this.container);
      } else {
        return $('.btn-loadmore', this.container).hide();
      }
    };

    RecordsView.prototype.newRecord = function(record) {
      var dateEl;
      this.loadMoreRecords();
      dateEl = record.get('recordDate').substr(0, 10).replace(/\s/g, '_');
      return $('.scrollWrapper').scrollTop($("#" + dateEl).offset().top + $(".scrollWrapper").scrollTop() - 78);
    };

    RecordsView.prototype.sortRecords = function() {
      var dates, parentCont, sortedList;
      parentCont = '#main .list-group';
      sortedList = $('.list-group-item', parentCont).sort(function(a, b) {
        var timeA, timeB;
        timeA = new Date($('.record-info time', a).attr('datetime')).getTime();
        timeB = new Date($('.record-info time', b).attr('datetime')).getTime();
        return timeB - timeA;
      });
      dates = $.unique($('.record-info time', parentCont).map(function(i, el) {
        return moment($(el).attr('datetime')).format("YYYY-MM-DD");
      })).sort(function(a, b) {
        return b > a;
      });
      console.log('dates', dates);
      _.each(dates, function(el, b) {
        if ($("#" + el).length < 1) {
          return $(parentCont).append($("<ul> /", {
            id: el
          }).append($("<li />", {
            "class": 'list-group-items-group navbar navbar-primary'
          }).html(moment(el).format("Do MMMM YYYY"))));
        }
      });
      return _.each(sortedList, function(item) {
        var id;
        id = moment($('.record-info time', item).attr('datetime')).format("YYYY-MM-DD");
        return $("#" + id, parentCont).append(item);
      });
    };

    RecordsView.prototype.resetRecordsList = function() {
      var frag, models;
      frag = document.createDocumentFragment();
      models = this.collection.getModels(this.exceptRecords());
      _.each(models, function(record) {
        var recordView;
        recordView = this.setSubView("record-" + record.cid, new Tracktime.RecordView({
          model: record
        }));
        return frag.appendChild(recordView.el);
      }, this);
      this.$el.prepend(frag);
      this.sortRecords();
      return models.length;
    };

    RecordsView.prototype.exceptRecords = function() {
      return _.pluck($('.list-group-item > div', this.container), 'id');
    };

    RecordsView.prototype.updateProjectInfo = function() {
      var key;
      this.projectsList = Tracktime.AppChannel.request('projectsList');
      key = $('.removeFilter[data-exclude=project]', this.container).data('value');
      if (key in this.projectsList) {
        return $('.removeFilter[data-exclude=project] .caption', this.container).text(this.projectsList[key]);
      }
    };

    RecordsView.prototype.updateUserInfo = function() {
      var key;
      this.usersList = Tracktime.AppChannel.request('usersList');
      key = $('.removeFilter[data-exclude=user]', this.container).data('value');
      if (key in this.usersList) {
        return $('.removeFilter[data-exclude=user] .caption', this.container).text(this.usersList[key]);
      }
    };

    RecordsView.prototype.addRecord = function(record, collection, params) {};

    RecordsView.prototype.removeFilter = function(event) {
      var key;
      key = $(event.currentTarget).data('exclude');
      this.collection.removeFilter(key);
      this.$el.find('.list-group > li').remove();
      $(event.currentTarget).remove();
      return this.resetRecordsList();
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
      this.listenTo(this.model, "change:first_name", this.changeName);
      this.listenTo(this.model, "change:isEdit", this.changeIsEdit);
      return this.listenTo(this.model, "sync", this.syncModel);
    };

    UserView.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    UserView.prototype.render = function() {
      var data, textarea;
      data = _.extend({}, this.model.toJSON(), {
        hash: window.md5(this.model.get('email').toLowerCase())
      });
      this.$el.html(this.template(data));
      $('.subject_edit', this.$el).on('keydown', this.fixEnter).textareaAutoSize();
      textarea = new Tracktime.Element.Textarea({
        model: this.model,
        className: 'subject_edit form-control hidden',
        field: 'first_name'
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
      return model.trigger('change:first_name');
    };

    UserView.prototype.changeIsDeleted = function() {
      return this.$el.remove();
    };

    UserView.prototype.changeName = function() {
      $('.subject', this.$el).html((this.model.get('first_name') + '').nl2br());
      return $('.name_edit', this.$el).val(this.model.get('first_name'));
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
      return this.parent.view.setSubView('main', new Tracktime.AdminView.ActionsView({
        collection: this.parent.model.get('actions')
      }));
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
      'records*subroute': 'invokeRecordsRouter',
      'reports*subroute': 'invokeReportsRouter',
      'user*subroute': 'invokeUserRouter',
      'admin*subroute': 'invokeAdminRouter',
      '*actions': 'default'
    };

    AppRouter.prototype.initialize = function(options) {
      _.extend(this, options);
      this.on('route', (function(_this) {
        return function(route, params) {
          if (route.substr(0, 6) !== 'invoke') {
            return _this.removeActionsExcept(route);
          }
        };
      })(this));
      this.initInterface();
      return Backbone.history.loadUrl(Backbone.history.fragment);
    };

    AppRouter.prototype.addListener = function(subroute, scope) {
      return this.listenTo(subroute, 'route', (function(_this) {
        return function(route, params) {
          return _this.removeActionsExcept(scope + ":" + route);
        };
      })(this));
    };

    AppRouter.prototype.invokeProjectsRouter = function(subroute) {
      if (!this.projectsRouter) {
        this.projectsRouter = new Tracktime.ProjectsRouter('projects', {
          parent: this
        });
        return this.addListener(this.projectsRouter, 'projects');
      }
    };

    AppRouter.prototype.invokeRecordsRouter = function(subroute) {
      if (!this.recordsRouter) {
        this.recordsRouter = new Tracktime.RecordsRouter('records', {
          parent: this
        });
        return this.addListener(this.recordsRouter, 'records');
      }
    };

    AppRouter.prototype.invokeReportsRouter = function(subroute) {
      if (!this.reportsRouter) {
        this.reportsRouter = new Tracktime.ReportsRouter('reports', {
          parent: this
        });
        return this.addListener(this.reportsRouter, 'reports');
      }
    };

    AppRouter.prototype.invokeUserRouter = function(subroute) {
      if (!this.userRouter) {
        this.userRouter = new Tracktime.UserRouter('user', {
          parent: this
        });
        return this.addListener(this.userRouter, 'users');
      }
    };

    AppRouter.prototype.invokeAdminRouter = function(subroute) {
      if (!this.adminRouter) {
        this.adminRouter = new Tracktime.AdminRouter('admin', {
          parent: this
        });
        return this.addListener(this.adminRouter, 'admin');
      }
    };

    AppRouter.prototype.initInterface = function() {
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

    AppRouter.prototype.index = function() {};

    AppRouter.prototype["default"] = function(actions) {
      $.alert('Unknown page');
      return this.navigate('', true);
    };

    AppRouter.prototype.removeActionsExcept = function(route) {
      if (this.model.get('actions')) {
        return _.each(this.model.get('actions').models, function(action) {
          if (action && action.has('scope') && action.get('scope') !== route) {
            return action.destroy();
          }
        });
      }
    };

    return AppRouter;

  })(Backbone.Router);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppRouter : void 0) || (this.Tracktime.AppRouter = Tracktime.AppRouter);

  Tracktime.GuestRouter = (function(superClass) {
    extend(GuestRouter, superClass);

    function GuestRouter() {
      return GuestRouter.__super__.constructor.apply(this, arguments);
    }

    GuestRouter.prototype.routes = {
      '': 'index',
      '*actions': 'default'
    };

    GuestRouter.prototype.initialize = function(options) {
      _.extend(this, options);
      this.initInterface();
      return Backbone.history.loadUrl(Backbone.history.fragment);
    };

    GuestRouter.prototype.initInterface = function() {
      this.view = new Tracktime.GuestView({
        model: this.model
      });
      return this.view.initUI();
    };

    GuestRouter.prototype.index = function() {};

    GuestRouter.prototype["default"] = function(actions) {
      return this.navigate('', true);
    };

    return GuestRouter;

  })(Backbone.Router);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.GuestRouter : void 0) || (this.Tracktime.GuestRouter = Tracktime.GuestRouter);

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
      '*filter': 'listFilter',
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
      var collection;
      collection = this.parent.model.get('records');
      collection.resetFilter();
      return this.parent.view.setSubView('main', new Tracktime.RecordsView({
        collection: collection
      }));
    };

    RecordsRouter.prototype.listFilter = function(filter) {
      var collection;
      collection = this.parent.model.get('records');
      collection.setFilter(filter);
      return this.parent.view.setSubView('main', new Tracktime.RecordsView({
        collection: collection
      }));
    };

    RecordsRouter.prototype.details = function(id) {
      $.alert("details");
      return this.parent.view.setSubView('main', new Tracktime.RecordsView({
        collection: this.parent.model.get('records')
      }));
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

  })(Backbone.SubRoute);

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
      return this.parent.model.get('authUser').logout();
    };

    return UserRouter;

  })(Backbone.SubRoute);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.UserRouter : void 0) || (this.Tracktime.UserRouter = Tracktime.UserRouter);

}).call(this);

//# sourceMappingURL=app.coffee.js.map
