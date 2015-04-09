this["JST"] = this["JST"] || {};

this["JST"]["blocks/action"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"popover panel panel-warning "
    + escapeExpression(((helper = (helper = helpers.btnClass || (depth0 != null ? depth0.btnClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnClass","hash":{},"data":data}) : helper)))
    + " shadow-z-3\" style=\"z-index: 1010\"><div class=\"arrow\"></div><div class=\"panel-heading\"><h3 class=\"panel-title\">Details for "
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</h3></div><div class=\"panel-body\">And here's some amazing content. It's very engaging. Right? <hr> "
    + escapeExpression(((helper = (helper = helpers.details || (depth0 != null ? depth0.details : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"details","hash":{},"data":data}) : helper)))
    + "</div></div>";
},"useData":true});

this["JST"]["global/app"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<header id=\"header\">\n</header>\n<div class=\"scrollWrapper\">\n  <div class=\"container\" style=\"padding: 0\">\n    <div id=\"main\">\n\n    </div>\n  </div>\n  <footer id=\"footer\">\n  </footer>\n</div>\n";
  },"useData":true});

this["JST"]["layout/footer"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"container\">\n  <div class=\"well\" style=\"margin: 0;\">\n\n\n    <p class=\"hidden\">I'am footer partial</p>\n\n    <p class=\"hidden\">"
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Click on subview"),
    'id': ("click-me"),
    'href': ("#click-me")
  },"data":data})))
    + "</p>\n\n    <p>\n<a href=\"#window-close\" id=\"window-close\" class=\"btn btn-primary\"><i class=\"mdi-navigation-close pull-left\"></i> Close window</a>\n\n    </p>\n\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["layout/header"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"navbar navbar-material-amber shadow-z-1\" style=\"-webkit-app-region: drag\">\n  <a id=\"menuToggler\" class=\"btn btn-fab btn-link pull-left\" href=\"javascript:void(0)\">\n    <i class=\"mdi-action-view-headline\"></i>\n  </a>\n  <div class=\"container\">\n    <div id=\"actions-form\">\n\n    </div>\n  </div>\n</div>\n\n";
  },"useData":true});

this["JST"]["layout/header/actions"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<div class=\"select-action-type-dropdown dropdown pull-left\">\n  <button id=\"action_type\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-fab btn-warning dropdown-toggle\" title=\"SHIFT + ENTER to submit\">\n    <i class=\"\"></i>\n  </button>\n\n  <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n\n\n  </ul>\n</div>\n\n\n<a id=\"detailsNew\" class=\"btn btn-fab btn-link pull-right\" href=\"javascript:void(0)\" data-toggle=\"popover\" title=\"Popover title\" data-content=\"And here's some amazing content. It's very engaging. Right?\" data-placement=\"left\">\n  <i class=\"mdi-navigation-more-vert\"></i>\n</a>\n\n<div class=\"form-control-wrapper\">\n  <textarea class=\"form-control\" name=\"action\"></textarea>\n  <div class=\"floating-label\">Selected Action Hint</div>\n  <span class=\"material-input\"></span>\n\n  <div class=\"controls-container hidden\">\n    <div class=\"row\">\n      <div class=\"col-md-2\">\n\n\n<div class=\"btn-group select-date\">\n    <a href=\"javascript:void(0)\" class=\"btn btn-block btn-default dropdown-toggle\" data-toggle=\"dropdown\" id=\"open-cal\"  data-target=\"#\" style=\"padding-left: 15px;\"><i class=\"mdi-action-event pull-left\"></i><div class=\"caption\" style=\"display: inline-block;\"><ruby>Сегодня<rt>03.01.2015</rt> </ruby></div> <span class=\"caret\"></span></a>\n    <ul class=\"dropdown-menu\">\n        <li><a href=\"javascript:void(0)\" class=\"btn btn-default\">\n          <ruby>Позавчера<rt>01.01.2015</rt> </ruby>\n        </a></li>\n        <li><a href=\"javascript:void(0)\" class=\"btn btn-default\">\n          <ruby>Вчера<rt>02.01.2015</rt> </ruby>\n        </a></li>\n        <li><a href=\"javascript:void(0)\" class=\"btn btn-default\">\n          <ruby>Сегодня<rt>03.01.2015</rt> </ruby>\n        </a></li>\n        <li><a href=\"javascript:void(0)\" class=\"btn btn-default disabled\">Выбрать дату</a></li>\n    </ul>\n</div>\n\n      </div>\n      <div class=\"col-md-8\">\n\n  <div class=\"slider shor btn-primary slider-material-orange\"></div>\n\n      </div>\n      <div class=\"col-md-2\">\n  <button href=\"#send-form\" id=\"send-form\" class=\"btn btn-primary btn-block\"><i class=\"mdi-action-done pull-left\"></i>Send</button>\n      </div>\n    </div>\n  </div>\n\n\n</div>\n\n";
  },"useData":true});

this["JST"]["layout/header/listbtn"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, lambda=this.lambda;
  return "<a class=\"btn btn-fab "
    + escapeExpression(((helper = (helper = helpers.btnClass || (depth0 != null ? depth0.btnClass : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"btnClass","hash":{},"data":data}) : helper)))
    + "\" role=\"menuitem\" tabindex=\"-1\" href=\""
    + escapeExpression(((helper = (helper = helpers.formAction || (depth0 != null ? depth0.formAction : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"formAction","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\""
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n  <i class=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.className : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.letter : stack1), depth0))
    + "</i>\n</a>";
},"useData":true});

this["JST"]["layout/main"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "";
},"useData":true});

this["JST"]["layout/menu"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return " checked=\"checked\"";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<header class=\"hidden\">\n  <h2>Menu</h2>\n</header>\n<div class=\"panel panel-info\">\n  <div class=\"well\">\n    <h5>Sync apps over internet only</h5>\n    <div class=\"checkbox\">\n      <label>\n        <input type=\"checkbox\" id=\"isOnline\" ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isOnline : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "> Sync\n\n      </label>\n    </div>\n  </div>\n  <div class=\"panel-heading\"><h3>State</h3></div>\n\n  <div class=\"panel-body\">\n\n    <table class=\"table table-condensed\">\n      <tbody>\n        <tr class=\"active\">\n          <td class=\"when\">Today:</td>\n          <td class=\"time\">0:00</td>\n          <td class=\"pounds\">£0.0</td>\n        </tr>\n        <tr class=\"nonactual\">\n          <td class=\"when\">Yesterday:</td>\n          <td class=\"time\">8:00</td>\n          <td class=\"pounds\">£8.0</td>\n        </tr>\n        <tr class=\"active\">\n          <td class=\"when\">This week:</td>\n          <td class=\"time\">16:00</td>\n          <td class=\"pounds\">£16.0</td>\n        </tr>\n        <tr class=\"nonactual\">\n          <td class=\"when\">Previous week:</td>\n          <td class=\"time\">32:00</td>\n          <td class=\"pounds\">£32.0</td>\n        </tr>\n        <tr class=\"active\">\n          <td class=\"when\">This month:</td>\n          <td class=\"time\">48:00</td>\n          <td class=\"pounds\">£48.0</td>\n        </tr>\n        <tr class=\"nonactual\">\n          <td class=\"when\">Previous month:</td>\n          <td class=\"time\">0:00</td>\n          <td class=\"pounds\">£0.0</td>\n        </tr>\n\n\n      </tbody>\n    </table>\n  </div>\n\n\n</div>\n<div class=\"panel panel-primary\">\n  <div class=\"panel-heading\"><h3>Menu</h3></div>\n\n  <div class=\"panel-body\">\n    <div class=\"list-style-group\">\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Populate"),
    'href': ("#populate"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Slashed"),
    'href': ("#slashed/path"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n    </div>\n  </div>\n\n  <div class=\"panel-body\">\n    <div class=\"list-style-group\">\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("In Progress"),
    'href': ("#records/inprogress"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Not Finished"),
    'href': ("#records/notfinished"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Finished"),
    'href': ("#records/finished"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n    </div>\n  </div>\n\n  <div class=\"panel-body\">\n    <div class=\"list-style-group\">\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Projects 1"),
    'href': ("#project/1"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Projects 2"),
    'href': ("#project/2"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Projects 3"),
    'href': ("#project/3"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n      "
    + escapeExpression(((helpers.link_to || (depth0 && depth0.link_to) || helperMissing).call(depth0, {"name":"link_to","hash":{
    'body': ("Projects 4"),
    'href': ("#project/4"),
    'class': ("list-group-item")
  },"data":data})))
    + "\n    </div>\n  </div>\n\n\n</div>\n";
},"useData":true});

this["JST"]["records/record"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"row\" id=\""
    + escapeExpression(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n\n  <div class=\"col-icon col-md-1 col-sm-2\">\n    <a  class=\"type btn btn-fab btn-fab-mini btn-info\" role=\"menuitem\" tabindex=\"-1\" href=\"#fat\"  data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"Other wroject will be thouched\">\n      <i class=\"mdi-action-group-work\"></i>\n    </a>\n    <a class=\"edit btn btn-fab btn-fab-mini btn-flat pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Edit action\">\n      <i class=\"mdi-editor-mode-edit\"></i>\n    </a>\n  </div>\n\n  <div class=\"col-subject col-md-10 col-sm-9\">\n    <p class=\"date-time text-info\">\n      <span title=\"Record Date\"><i class=\"mdi-action-event\"></i>"
    + escapeExpression(((helper = (helper = helpers.recordDate || (depth0 != null ? depth0.recordDate : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"recordDate","hash":{},"data":data}) : helper)))
    + "</span>\n      &#0160;\n      <span title=\"Record Time\"><i class=\"mdi-action-schedule\"></i>"
    + escapeExpression(((helpers.minuteFormat || (depth0 && depth0.minuteFormat) || helperMissing).call(depth0, (depth0 != null ? depth0.recordTime : depth0), {"name":"minuteFormat","hash":{},"data":data})))
    + "</span>\n    </p>\n    <textarea class=\"subject_edit form-control hidden\" style=\"width: 100%; border: none; padding: 0;\">"
    + escapeExpression(((helper = (helper = helpers.subject || (depth0 != null ? depth0.subject : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"subject","hash":{},"data":data}) : helper)))
    + "</textarea>\n    <div class=\"subject\" style=\"border: none;\">"
    + escapeExpression(((helpers.nl2br || (depth0 && depth0.nl2br) || helperMissing).call(depth0, (depth0 != null ? depth0.subject : depth0), {"name":"nl2br","hash":{},"data":data})))
    + "</div>\n\n    <p class=\"last-update\">\n        <time class=\"text-muted\" datetime=\""
    + escapeExpression(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"date","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helpers.dateFormat || (depth0 && depth0.dateFormat) || helperMissing).call(depth0, (depth0 != null ? depth0.lastAccess : depth0), {"name":"dateFormat","hash":{},"data":data})))
    + "</time>\n    </p>\n\n  </div>\n\n  <div class=\"col-menu col-md-1 col-sm-1\">\n    <ul class=\"actions\">\n      <li><a class=\"delete btn btn-fab btn-danger btn-fab-mini pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Delete action\">\n        <i class=\"mdi-navigation-cancel\"></i>\n      </a></li>\n    </ul>\n  </div>\n</div>";
},"useData":true});