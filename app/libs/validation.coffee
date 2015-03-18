Backbone.Validation.configure
  selector: 'class'
  labelFormatter: 'label'
  # attributes: 'inputNames' # returns the name attributes of bound view input elements
  # forceUpdate: true


_.extend Backbone.Model.prototype, Backbone.Validation.mixin