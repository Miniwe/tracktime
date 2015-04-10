(function() {
  var Lokitest, Tracktime, config, development, process, production, ref, test,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  process = process || window.process || {};

  production = {
    SERVER: 'https://ttpms.herokuapp.com',
    collection: {
      records: 'records-backbone',
      actions: 'actions-backbone'
    }
  };

  test = {
    SERVER: 'http://localhost:5000',
    collection: {
      records: 'records-backbone',
      actions: 'actions-backbone'
    }
  };

  development = {
    SERVER: 'http://localhost:5000',
    collection: {
      records: 'records-backbone',
      actions: 'actions-backbone'
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
      this.populateActions();
      this.set('records', new Tracktime.RecordsCollection());
      return this.listenTo(Tracktime.AppChannel, "isOnline", this.updateApp);
    };

    Tracktime.prototype.updateApp = function() {
      return this.get('records').fetch({
        ajaxSync: Tracktime.AppChannel.request('isOnline'),
        success: (function(_this) {
          return function() {
            return _this.trigger('render_records');
          };
        })(this)
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
            style: 'btn-primary'
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

    Tracktime.prototype.populateActions = function() {
      return this.set('actions', new Tracktime.ActionsCollection(Tracktime.initdata.tmpActions));
    };

    return Tracktime;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime : void 0) || (this.Tracktime = Tracktime);

  Tracktime.Action = (function(superClass) {
    extend(Action, superClass);

    Action.prototype.idAttribute = "_id";

    Action.prototype.url = '/actions';

    Action.prototype.defaults = {
      _id: null,
      title: 'Default action title',
      formAction: '#',
      btnClass: 'btn-default',
      navbarClass: 'navbar-material-amber',
      icon: {
        className: 'mdi-editor-mode-edit',
        letter: ''
      },
      isActive: false,
      isVisible: false,
      inputValue: '',
      details: null
    };

    Action.prototype.validation = function() {};

    Action.prototype.attributes = function() {
      return {
        id: this.model.cid
      };
    };

    function Action() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      Action.__super__.constructor.apply(this, args);
    }

    Action.prototype.initialize = function() {
      return this.set('details', new Tracktime.Action.Details());
    };

    Action.prototype.setActive = function() {
      return this.collection.setActive(this);
    };

    Action.prototype.processAction = function(options) {
      this.set('inputValue', options.subject);
      this.get('details').set(options);
      return this.newRecord();
    };

    Action.prototype.newRecord = function() {
      return Tracktime.AppChannel.command('newRecord', _.extend({
        project: 0
      }, this.get('details').attributes));
    };

    Action.prototype.search = function() {
      return $.alert('search under construction');
    };

    Action.prototype.successAdd = function() {
      return this.set('inputValue', '');
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

  Lokitest = (function() {
    function Lokitest() {
      var LokiJS;
      this.test('Start loki</li>');
      LokiJS = require('lokijs');
      this.db = new LokiJS('users_1.json');
      $('.add-users').on('click', (function(_this) {
        return function(event) {
          console.log('add-users');
          event.preventDefault();
          return _this.add();
        };
      })(this));
      $('.get-users').on('click', (function(_this) {
        return function(event) {
          console.log('get-users');
          event.preventDefault();
          return _this.get();
        };
      })(this));
      return;
    }

    Lokitest.prototype.test = function(msg) {
      if (msg) {
        $('h1').html(msg);
      }
    };

    Lokitest.prototype.add = function() {
      var users;
      users = this.db.addCollection('users', {
        indices: ['name']
      });
      users.insert({
        name: 'User 10',
        user: 20
      });
      users.insert({
        name: 'User 11',
        user: 21
      });
      users.insert({
        name: 'User 12',
        user: 22
      });
      this.db.saveDatabase();
    };

    Lokitest.prototype.get = function() {
      this.db.loadDatabase({}, (function(_this) {
        return function() {
          var users;
          users = _this.db.getCollection('users');
          if (users) {
            console.log('users', users.data);
          } else {
            console.log('no users Data');
            console.log('will create');
            _this.add();
          }
        };
      })(this));
    };

    return Lokitest;

  })();

  Tracktime.Model = (function(superClass) {
    extend(Model, superClass);

    Model.prototype.url = '/models';

    Model.prototype.validation = {
      field: {
        required: true
      },
      someAttribute: function(value) {
        if (value !== 'somevalue') {
          return 'Error message';
        }
      }
    };

    function Model() {
      return;
    }

    Model.prototype.initialize = function() {};

    return Model;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Model : void 0) || (this.Tracktime.Model = Tracktime.Model);

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

    Record.prototype.sync = function(method, model, options) {
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
          model.save({
            'isDeleted': true
          }, {
            ajaxSync: false
          });
          if (options.ajaxSync) {
            _success = options.success;
            _model = model;
            options.success = function(model, response) {
              options.ajaxSync = !options.ajaxSync;
              options.success = _success;
              return Backbone.sync(method, _model, options);
            };
            return Backbone.sync(method, model, options);
          }
          break;
        default:
          $.alert("unknown method " + method);
          return Backbone.sync(method, model, options);
      }
    };

    return Record;

  })(Backbone.Model);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.Record : void 0) || (this.Tracktime.Record = Tracktime.Record);

  Tracktime.ActionsCollection = (function(superClass) {
    extend(ActionsCollection, superClass);

    function ActionsCollection() {
      return ActionsCollection.__super__.constructor.apply(this, arguments);
    }

    ActionsCollection.prototype.model = Tracktime.Action;

    ActionsCollection.prototype.url = '/actions';

    ActionsCollection.prototype.localStorage = new Backbone.LocalStorage('records-backbone');

    ActionsCollection.prototype.active = null;

    ActionsCollection.prototype.initialize = function() {};

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

    ActionsCollection.prototype.fetch = function() {
      var models;
      models = this.localStorage.findAll();
      if (!models.length) {
        _.each(Tracktime.initdata.tmpActions, function(action) {
          var newAction;
          newAction = new Tracktime.Action(action);
          return newAction.save();
        });
        models = this.localStorage.findAll();
      }
      return this.add(models);
    };

    return ActionsCollection;

  })(Backbone.Collection);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.ActionsCollection : void 0) || (this.Tracktime.ActionsCollection = Tracktime.ActionsCollection);

  Tracktime.RecordsCollection = (function(superClass) {
    extend(RecordsCollection, superClass);

    function RecordsCollection() {
      return RecordsCollection.__super__.constructor.apply(this, arguments);
    }

    RecordsCollection.prototype.model = Tracktime.Record;

    RecordsCollection.prototype.url = (config != null ? config.SERVER : void 0) + '/records';

    RecordsCollection.prototype.urlRoot = (config != null ? config.SERVER : void 0) + '/records';

    RecordsCollection.prototype.localStorage = new Backbone.LocalStorage(config.collection.records);

    RecordsCollection.prototype.initialize = function() {};

    RecordsCollection.prototype.comparator = function(model) {
      return -(new Date(model.get('date'))).getTime();
    };

    RecordsCollection.prototype.addRecord = function(params, options) {
      var newRecord;
      newRecord = new Tracktime.Record(params);
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

    RecordsCollection.prototype.fetch = function(options) {
      var _success;
      this.resetLocalStorage();
      if ((options != null) && options.ajaxSync === true) {
        _success = options.success;
        options.success = (function(_this) {
          return function(collection, response, optionsSuccess) {
            _this.syncRecords(response);
            if (_.isFunction(_success)) {
              return _success.apply(_this, collection, response, options);
            }
          };
        })(this);
      }
      return RecordsCollection.__super__.fetch.call(this, options);
    };

    RecordsCollection.prototype.syncRecords = function(models) {
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
            modelLastAccess = (new Date(model.lastAccess)).getTime();
            if ((collectionModel != null) && modelLastAccess > (new Date(collectionModel.get('lastAccess'))).getTime()) {
              destroedModel = collectionModel;
            } else {
              destroedModel = new Tracktime.Record(model);
            }
            return destroedModel.destroy({
              ajaxSync: true
            });
          } else {
            if (!collectionModel) {
              replacedModel = new Tracktime.Record({
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

    RecordsCollection.prototype.resetLocalStorage = function() {
      return this.localStorage = new Backbone.LocalStorage(config.collection.records);
    };

    return RecordsCollection;

  })(Backbone.Collection);

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
          return _this.model.get('isOnline');
        };
      })(this));
    },
    startApp: function() {
      this.view = new Tracktime.AppView({
        model: this.model
      });
      this.router = new Tracktime.AppRouter();
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

  Tracktime.initdata.tmpActions = [
    {
      title: 'Add record +4',
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

  Tracktime.initdata.tmpRecords = [
    {
      description: 'Lorem',
      subject: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam, culpa, deleniti, temporibus, itaque similique suscipit saepe rerum voluptates voluptatum asperiores modi possimus vitae inventore dolore illo incidunt dolorem animi iure provident labore minima delectus unde nihil soluta recusandae ut dicta explicabo perspiciatis dolores eum. Numquam molestias reiciendis quibusdam sunt suscipit fugit temporibus asperiores quia. Cum, vel, molestias, sapiente ex nisi blanditiis dolorem quod beatae obcaecati culpa eos eius at vitae sed modi explicabo tempore. Harum, error nam veritatis maiores est at incidunt quae magni amet non qui eum. Aperiam, harum, tenetur facere officia delectus omnis odio totam consequatur obcaecati tempora. ',
      date: (new Date()).toISOString()
    }, {
      description: 'Tempore',
      subject: 'Accusamus, cumque, aperiam velit quos quisquam ex officiis obcaecati totam ipsa saepe fugiat in. Corrupti, soluta, aliquid cumque adipisci nihil omnis explicabo itaque commodi neque dolorum fugit quibusdam deserunt voluptates corporis amet hic quod blanditiis nesciunt dignissimos vero iure. Omnis, provident ducimus delectus sed in incidunt expedita quae accusantium cum culpa recusandae rerum ipsum vitae aliquid ratione ea architecto optio accusamus similique saepe nobis vel deleniti tempora iure consequatur. Debitis laborum accusantium omnis iure velit necessitatibus quod veniam sequi! Excepturi, praesentium, porro ducimus fugit provident repellendus quibusdam dolorum nisi autem tenetur. Non, neque reiciendis eius sequi accusamus. Quam, nostrum, nesciunt. ',
      date: (new Date()).toISOString()
    }, {
      description: 'Consequuntur',
      subject: 'Obcaecati, incidunt, optio deleniti earum odio nobis dolore sapiente delectus. Accusamus sequi voluptatibus magni fuga fugit nisi aut nam rem repellat possimus! Delectus, harum nisi eos nostrum necessitatibus ducimus eius odio dolores ratione quas quos laboriosam magnam reprehenderit itaque nihil! Dolor, hic, asperiores alias aut voluptas odit illum voluptatem quod! Pariatur, nesciunt distinctio aliquam quam voluptatibus temporibus voluptate placeat quaerat nemo quidem. Asperiores, nihil quasi molestias suscipit sunt. Itaque, sapiente voluptatibus qui non fugit impedit voluptatem beatae repellat at nulla dignissimos esse doloribus. Officiis, dolorem, id, officia sapiente eius ullam vel dolorum numquam et aspernatur illo deleniti enim quam autem! ',
      date: (new Date()).toISOString()
    }, {
      description: 'Rem',
      subject: 'Quisquam ab soluta dicta amet possimus iure deserunt expedita facere maxime nemo. Laudantium, quod, dignissimos, quos perspiciatis illo numquam est hic qui totam eligendi aut in provident dolor. Libero, dolores, cumque ut molestiae iusto nostrum tempore voluptatum laborum iure quae? Culpa, et, deserunt, explicabo a assumenda voluptate commodi voluptatum possimus omnis totam libero ipsum delectus? Harum, facilis, suscipit perspiciatis dolorum sapiente quae voluptas assumenda cumque atque accusamus blanditiis ullam doloribus enim placeat saepe dolorem sed quos architecto error vero odit deserunt autem? Sunt, cumque, similique voluptatem quis voluptatum non explicabo quibusdam porro in nihil quae sint rem molestias vero beatae!',
      date: (new Date()).toISOString()
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

  Tracktime.utils = {};

  Tracktime.utils.nl2br = function(text) {
    return (text + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + '<br>' + '$2');
  };

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.utils : void 0) || (this.Tracktime.utils = Tracktime.utils);

  Tracktime.AdminRouter = (function(superClass) {
    extend(AdminRouter, superClass);

    function AdminRouter() {
      return AdminRouter.__super__.constructor.apply(this, arguments);
    }

    AdminRouter.prototype.routes = {
      'users': 'users',
      'projects': 'projects',
      'actions': 'actions'
    };

    AdminRouter.prototype.users = function() {
      return $.alert("admin users");
    };

    AdminRouter.prototype.projects = function() {
      return $.alert("admin projects");
    };

    AdminRouter.prototype.actions = function() {
      return $.alert("admin actions");
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
      'page1': 'page1',
      'page2': 'page2',
      'projects*subroute': 'invokeProjectsRouter',
      'reports*subroute': 'invokeReportsRouter',
      'user*subroute': 'invokeUserRouter',
      'admin*subroute': 'invokeAdminRouter',
      '*actions': 'default'
    };

    AppRouter.prototype.initialize = function(options) {
      return _.extend(this, options);
    };

    AppRouter.prototype.invokeProjectsRouter = function(subroute) {
      if (!this.projectsRouter) {
        return this.projectsRouter = new Tracktime.ProjectsRouter("projects");
      }
    };

    AppRouter.prototype.invokeReportsRouter = function(subroute) {
      if (!this.reportsRouter) {
        return this.reportsRouter = new Tracktime.ReportsRouter("reports");
      }
    };

    AppRouter.prototype.invokeUserRouter = function(subroute) {
      if (!this.userRouter) {
        return this.userRouter = new Tracktime.UserRouter("user");
      }
    };

    AppRouter.prototype.invokeAdminRouter = function(subroute) {
      if (!this.adminRouter) {
        return this.adminRouter = new Tracktime.AdminRouter("admin");
      }
    };

    AppRouter.prototype.index = function() {
      return $.alert('index');
    };

    AppRouter.prototype.page1 = function() {
      return $.alert('Page 1');
    };

    AppRouter.prototype.page2 = function() {
      return $.alert('Page 2');
    };

    AppRouter.prototype["default"] = function(actions) {
      $.alert('Unknown page');
      return this.navigate("", true);
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

    ProjectsRouter.prototype.list = function() {
      return $.alert("projects list");
    };

    ProjectsRouter.prototype.details = function(id) {
      return $.alert("projects details " + id);
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
      '/:id': 'details',
      '/:id/edit': 'edit',
      '/:id/delete': 'delete',
      '/:id/add': 'add',
      '/:id/save': 'save'
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

    ReportsRouter.prototype.list = function() {
      return $.alert("reports list");
    };

    ReportsRouter.prototype.details = function(id) {
      return $.alert("reports details " + id);
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

    UserRouter.prototype.details = function() {
      return $.alert("user details");
    };

    UserRouter.prototype.rates = function() {
      return $.alert("user rates");
    };

    UserRouter.prototype.logout = function() {
      return $.alert("user logout");
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

  Tracktime.AppView = (function(superClass) {
    extend(AppView, superClass);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = '#panel';

    AppView.prototype.className = '';

    AppView.prototype.layoutTemplate = JST['global/app'];

    AppView.prototype.childViews = {};

    AppView.prototype.initialize = function() {
      this.render();
      return this.initUI();
    };

    AppView.prototype.render = function() {
      this.$el.html(this.layoutTemplate(this.model.toJSON()));
      return this.renderChilds();
    };

    AppView.prototype.renderChilds = function() {
      this.childViews['header'] = new Tracktime.AppView.Header({
        model: this.model,
        container: this
      });
      this.childViews['main'] = new Tracktime.AppView.Main({
        model: this.model,
        container: this
      });
      this.childViews['footer'] = new Tracktime.AppView.Footer({
        container: this
      });
      return this.childViews['menu'] = new Tracktime.AppView.Menu({
        model: this.model,
        container: this
      });
    };

    AppView.prototype.initUI = function() {
      var slideout;
      $.material.init();
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

    return AppView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView : void 0) || (this.Tracktime.AppView = Tracktime.AppView);

  Tracktime.AppView.Global = (function(superClass) {
    extend(Global, superClass);

    function Global() {
      return Global.__super__.constructor.apply(this, arguments);
    }

    Global.prototype.el = 'body';

    Global.prototype.template = JST['layout/global'];

    Global.prototype.initialize = function() {
      return this.render();
    };

    Global.prototype.render = function() {
      var ref1;
      return this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0));
    };

    return Global;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Global : void 0) || (this.Tracktime.AppView.Global = Tracktime.AppView.Global);

  Tracktime.AppView.Footer = (function(superClass) {
    extend(Footer, superClass);

    function Footer() {
      return Footer.__super__.constructor.apply(this, arguments);
    }

    Footer.prototype.el = '#footer';

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
      return this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0));
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

    Header.prototype.el = '#header';

    Header.prototype.template = JST['layout/header'];

    Header.prototype.childViews = {};

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
      return $(".slider").noUiSlider({
        start: [1],
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
    };

    Header.prototype.render = function() {
      var ref1;
      this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0));
      return this.childViews['actions'] = new Tracktime.ActionsView({
        collection: this.model.get('actions'),
        container: this
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

    Main.prototype.el = '#main';

    Main.prototype.template = JST['layout/main'];

    Main.prototype.initialize = function() {
      this.render();
      return this.bindEvents();
    };

    Main.prototype.render = function() {
      var ref1;
      return this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0));
    };

    Main.prototype.bindEvents = function() {
      return this.listenTo(this.model, 'render_records', this.renderRecords);
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

    Menu.prototype.el = '#menu';

    Menu.prototype.template = JST['layout/menu'];

    Menu.prototype.events = {
      'change #isOnline': 'updateOnlineStatus'
    };

    Menu.prototype.initialize = function() {
      this.render();
      return this.bindEvents();
    };

    Menu.prototype.bindEvents = function() {
      return this.listenTo(Tracktime.AppChannel, "isOnline", function(status) {
        return $('#isOnline').prop('checked', status);
      });
    };

    Menu.prototype.updateOnlineStatus = function(event) {
      if ($(event.target).is(":checked")) {
        return Tracktime.AppChannel.command('checkOnline');
      } else {
        return Tracktime.AppChannel.command("serverOffline");
      }
    };

    Menu.prototype.render = function() {
      var ref1;
      return this.$el.html(this.template((ref1 = this.model) != null ? ref1.toJSON() : void 0));
    };

    return Menu;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.AppView.Menu : void 0) || (this.Tracktime.AppView.Menu = Tracktime.AppView.Menu);

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

    RecordsView.prototype.tagName = 'ul';

    RecordsView.prototype.className = 'records-group';

    RecordsView.prototype.initialize = function() {
      this.render();
      return this.listenTo(this.collection, "add remove", this.updateRecordsList);
    };

    RecordsView.prototype.render = function() {
      return _.each(this.collection.where({
        isDeleted: false
      }), (function(_this) {
        return function(record) {
          var recordView;
          recordView = new Tracktime.RecordView({
            model: record
          });
          return _this.$el.append(recordView.el);
        };
      })(this), this);
    };

    RecordsView.prototype.updateRecordsList = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      this.$el.html('');
      return this.render();
    };

    return RecordsView;

  })(Backbone.View);

  (typeof module !== "undefined" && module !== null ? module.exports = Tracktime.RecordsView : void 0) || (this.Tracktime.RecordsView = Tracktime.RecordsView);

}).call(this);

//# sourceMappingURL=app.coffee.js.map
