this["JST"] = this["JST"] || {};

this["JST"]["actions/actions"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"select-action dropdown pull-left\">\n    <button id=\"action_type\" type=\"button\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\" class=\"btn btn-fab btn-warning dropdown-toggle\" title=\"\">\n        <i class=\"\"></i>\n    </button>\n    <ul class=\"dropdown-menu\" role=\"menu\" aria-labelledby=\"dLabel\">\n    </ul>\n</div>\n<div class=\"action-wrapper\">\n\n</div>";
},"useData":true});

this["JST"]["actions/admin_action"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "<div class=\"row navbar "
    + alias3(((helper = (helper = helpers.navbarClass || (depth0 != null ? depth0.navbarClass : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"navbarClass","hash":{},"data":data}) : helper)))
    + " shadow-z-1\" style=\"padding: 1em\">\n    <div class=\"col-md-2\">\n        <a class=\"btn btn-fab "
    + alias3(((helper = (helper = helpers.btnClass || (depth0 != null ? depth0.btnClass : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"btnClass","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias3(((helper = (helper = helpers.formAction || (depth0 != null ? depth0.formAction : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"formAction","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n            <i class=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.className : stack1), depth0))
    + "\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.letter : stack1), depth0))
    + "</i>\n        </a>\n    </div>\n    <div class=\"col-md-2\">\n        <a class=\"btn btn-fab "
    + alias3(((helper = (helper = helpers.btnClassEdit || (depth0 != null ? depth0.btnClassEdit : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"btnClassEdit","hash":{},"data":data}) : helper)))
    + "\" href=\""
    + alias3(((helper = (helper = helpers.formAction || (depth0 != null ? depth0.formAction : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"formAction","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\"Edit "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n            <i class=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.classNameEdit : stack1), depth0))
    + "\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.letter : stack1), depth0))
    + "</i>\n        </a>\n    </div>\n    <div class=\"col-md-6\">\n      <div class=\"navbar-header\">\n          <a class=\"navbar-brand\" href=\"#\">\n            "
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n          </a>\n      </div>\n\n    </div>\n    <div class=\"col-md-2\">\n      <button class=\"btn btn-call-action btn-fab btn-flat btn-fab-mini\" title=\"Call action\" style=\"margin: 10px;\"><i class=\"mdi-action-assignment-turned-in\"></i></button>\n\n    </div>\n</div>";
},"useData":true});

this["JST"]["actions/details/project"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"btn_close_action",{"name":"placeholder","hash":{},"data":data}))
    + "\n"
    + alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"textarea",{"name":"placeholder","hash":{},"data":data}))
    + "\n<div class=\"details-container hidden\">\n  project details\n</div>\n";
},"useData":true});

this["JST"]["actions/details/record"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"btn_close_action",{"name":"placeholder","hash":{},"data":data}))
    + "\n"
    + alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"textarea",{"name":"placeholder","hash":{},"data":data}))
    + "\n\n<div class=\"details-container navbar "
    + alias2(((helper = (helper = helpers.navbarClass || (depth0 != null ? depth0.navbarClass : depth0)) != null ? helper : alias1),(typeof helper === "function" ? helper.call(depth0,{"name":"navbarClass","hash":{},"data":data}) : helper)))
    + " hidden\">\n    <div class=\"row\" style=\"margin: 0\">\n        <div class=\"col-md-2\">\n            "
    + alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"selectday",{"name":"placeholder","hash":{},"data":data}))
    + "\n        </div>\n        <div class=\"col-md-9\">\n            "
    + alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"slider",{"name":"placeholder","hash":{},"data":data}))
    + "\n        </div>\n        <div class=\"col-md-1\">\n            <button href=\"#send-form\" id=\"send-form\" class=\"btn btn-white btn-fab btn-fab-mini pull-right\" style=\"margin: 7px; display: block;\" data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"SAVE-Enter NEWLINE-Shift+Enter\"><i class=\"mdi-action-done pull-left\"></i><!-- Send --></button>\n        </div>\n    </div>\n\n</div>\n\n";
},"useData":true});

this["JST"]["actions/details/search"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<a id=\"detailsNew\" class=\"btn btn-fab btn-link\" href=\"javascript:void(0)\" data-toggle=\"popover\" title=\"Popover title\" data-content=\"And here's some amazing content. It's very engaging. Right?\" data-placement=\"left\" style=\"  position: absolute; top: -0.7em; right: 0;\">\n    <i class=\"mdi-navigation-more-vert\"></i>\n</a>\n<div class=\"badge\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</div>";
},"useData":true});

this["JST"]["actions/details/user"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var alias1=helpers.helperMissing, alias2=this.escapeExpression;

  return alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"btn_close_action",{"name":"placeholder","hash":{},"data":data}))
    + "\n"
    + alias2((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"textarea",{"name":"placeholder","hash":{},"data":data}))
    + "\n<div class=\"details-container hidden\">\n  user details\n</div>\n";
},"useData":true});

this["JST"]["actions/listbtn"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression, alias4=this.lambda;

  return "<a class=\"btn btn-fab "
    + alias3(((helper = (helper = helpers.btnClass || (depth0 != null ? depth0.btnClass : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"btnClass","hash":{},"data":data}) : helper)))
    + "\" role=\"menuitem\" tabindex=\"-1\" href=\""
    + alias3(((helper = (helper = helpers.formAction || (depth0 != null ? depth0.formAction : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"formAction","hash":{},"data":data}) : helper)))
    + "\" data-toggle=\"tooltip\" data-placement=\"bottom\" title=\"\" data-original-title=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n  <i class=\""
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.className : stack1), depth0))
    + "\">"
    + alias3(alias4(((stack1 = (depth0 != null ? depth0.icon : depth0)) != null ? stack1.letter : stack1), depth0))
    + "</i>\n</a>";
},"useData":true});

this["JST"]["admin/actions"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<header>\n  <h2 class=\"page-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\n</header>";
},"useData":true});

this["JST"]["admin/actions_header"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"row text-muted\">\n  <div class=\"col-md-2\">Icon Add</div>\n  <div class=\"col-md-2\">Icon Edit</div>\n  <div class=\"col-md-6\">Navbar</div>\n  <div class=\"col-md-2\">Call</div>\n</div>";
},"useData":true});

this["JST"]["admin/dashboard"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<header>\n  <h2 class=\"page-title\">Dashboard</h2>\n</header>";
},"useData":true});

this["JST"]["admin/index"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<header>\n  <h2 class=\"page-title\">Admin Index</h2>\n</header>";
},"useData":true});

this["JST"]["admin/layout/header"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"navbar navbar-material-amber shadow-z-1\" style=\"-webkit-app-region: drag\">\n  <a id=\"menuToggler\" class=\"btn btn-fab btn-link pull-left\" href=\"javascript:void(0)\">\n    <i class=\"mdi-action-view-headline\"></i>\n  </a>\n  <div class=\"container\">\n    <h1>Admin panel</h1>\n  </div>\n</div>\n\n";
},"useData":true});

this["JST"]["admin/projects"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<header>\n  <h2 class=\"page-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\n</header>";
},"useData":true});

this["JST"]["admin/users"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<header>\n  <h2 class=\"page-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\n</header>";
},"useData":true});

this["JST"]["elements/project_definition"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"project_definition\">\n  <a href=\"#define_project\" class=\"project_definition-toggler dropdown-toggle\" data-toggle=\"dropdown\" aria-expanded=\"false\"><span class=\"caption\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</span></a>\n  <ul class=\"dropdown-menu list\" role=\"menu\">\n    <li class=\"input-cont\">\n      <input type=\"search\" class=\"form-control\" placeholder=\"Find Project...\"/>\n    </li>\n\n  </ul>\n</div>";
},"useData":true});

this["JST"]["elements/selectday"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "\n        <li>\n            <button class=\"btn btn-default btn-block\" data-value=\""
    + alias3(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"value","hash":{},"data":data}) : helper)))
    + "\">\n                <ruby>"
    + alias3(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "\n                    <rt>"
    + alias3(((helper = (helper = helpers.day || (depth0 != null ? depth0.day : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"day","hash":{},"data":data}) : helper)))
    + "</rt>\n                </ruby>\n            </button>\n        </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.lambda, alias2=this.escapeExpression;

  return "<a href=\"javascript:void(0)\" class=\"btn btn-block btn-white btn-xs dropdown-toggle\" data-toggle=\"dropdown\" id=\"open-cal\" data-target=\"#\" style=\"padding-left: 15px;\"><i class=\"mdi-action-event pull-left\"></i><div class=\"caption\" style=\"display: inline-block;\"><ruby>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.current : depth0)) != null ? stack1.name : stack1), depth0))
    + "<rt>"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.current : depth0)) != null ? stack1.day : stack1), depth0))
    + "</rt> </ruby></div> <span class=\"caret\"></span></a>\n<ul class=\"dropdown-menu\">\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.days : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "\n    <li><a href=\"javascript:void(0)\" class=\"btn btn-default disabled\">Выбрать дату</a></li>\n</ul>";
},"useData":true});

this["JST"]["global/app"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<header id=\"header\">\n</header>\n<div class=\"scrollWrapper\">\n  <div class=\"container\" style=\"padding: 0\">\n    <div id=\"main\"></div>\n  </div>\n  <footer id=\"footer\">\n  </footer>\n</div>\n";
},"useData":true});

this["JST"]["global/guest"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<div class=\"scrollWrapper\">\n    <div class=\"container\" style=\"padding: 0\">\n        <div id=\"main\">\n            <div class=\"panel panel-info\" style=\"width: 50%; margin: 0 auto;\">\n                <div class=\"panel-heading\">\n                    <h2>"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\n                    <ul class=\"nav nav-tabs navbar navbar-info\" style=\"margin-bottom: 1em\">\n                        <li class=\"active\"><a href=\"#login\" data-toggle=\"tab\">Log In</a></li>\n                        <li><a href=\"#signin\" data-toggle=\"tab\">Sign In</a></li>\n                        <li class=\"hidden\"><a href=\"#forgotpassword\" data-toggle=\"tab\">Forgot Password</a></li>\n                    </ul>\n                </div>\n                <div class='panel-body'>\n                    <div id=\"myTabContent\" class=\"tab-content\">\n                        <div class=\"tab-pane fade active in\" id=\"login\">\n                            <form class=\"form-horizontal\" method=\"post\" method=\"post\">\n                                <fieldset>\n                                    <legend>Log In</legend>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <input type=\"email\" name=\"email\" id=\"loginEmail\" class=\"form-control input-lg floating-label\" data-hint=\"Test email: irina@webperfectionist.net\" placeholder=\"Email\" value=\"irina@webperfectionist.net\">\n\n                                        </div>\n                                    </div>\n                                    <br>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <input type=\"password\" class=\"form-control input-lg floating-label\" name=\"password\" id=\"loginPassword\" placeholder=\"Password\" data-hint=\"Test password: ******\" value=\"******\">\n                                        </div>\n                                    </div>\n                                    <div class=\"form-group hidden\">\n                                        <label class=\"col-lg-2 control-label\"></label>\n                                        <div class=\"col-lg-10\">\n                                            <div class=\"togglebutton\">\n                                                <label>\n                                                    <input type=\"checkbox\" checked=\"\"> Toggle button\n                                                </label>\n                                            </div>\n                                        </div>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <button type=\"submit\" class=\"btn btn-lg btn-block btn-login btn-info\">Log In</button>\n                                        </div>\n                                    </div>\n                                </fieldset>\n                            </form>\n                        </div>\n                        <div class=\"tab-pane fade\" id=\"signin\">\n                            <form class=\"form-horizontal\" method=\"post\">\n                                <fieldset>\n                                    <legend>Sign In</legend>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-6\">\n                                            <input type=\"text\" name=\"first_name\" id=\"signinFirstName\" class=\"form-control input-lg floating-label\" placeholder=\"First Name\" value=\"\">\n                                        </div>\n                                        <div class=\"col-lg-6\">\n                                            <input type=\"text\" name=\"last_name\" id=\"signinLastName\" class=\"form-control input-lg floating-label\" placeholder=\"Last Name\" value=\"\">\n                                        </div>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <input type=\"email\" name=\"email\" id=\"signinEmail\" class=\"form-control input-lg floating-label\" placeholder=\"Email\" value=\"\">\n                                        </div>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <input type=\"password\" class=\"form-control input-lg floating-label\" name=\"password\" id=\"signinPassword\" placeholder=\"Password\">\n                                        </div>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <input type=\"password\" class=\"form-control input-lg floating-label\" name=\"repassword\" id=\"signinRePassword\" placeholder=\"Repeat Password\">\n                                        </div>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <button type=\"submit\" class=\"btn btn-lg btn-block btn-signin btn-info\">Sign In</button>\n                                        </div>\n                                    </div>\n                                </fieldset>\n                            </form>\n                        </div>\n                        <div class=\"tab-pane fade\" id=\"forgotpassword\">\n                            <form class=\"form-horizontal\" method=\"post\">\n                                <fieldset>\n                                    <legend>Forgot Password</legend>\n                                    <div class=\"form-group\">\n                                        <label for=\"inputEmail\" class=\"col-lg-2 control-label\">Email</label>\n                                        <div class=\"col-lg-10\">\n                                            <input type=\"email\" class=\"form-control\" id=\"inputEmail\" placeholder=\"Email\">\n                                        </div>\n                                    </div>\n                                    <div class=\"form-group\">\n                                        <div class=\"col-lg-12\">\n                                            <button class=\"btn btn-lg btn-block btn-forgotpassword btn-info\">Send</button>\n                                        </div>\n                                    </div>\n                                </fieldset>\n                            </form>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </div>\n    <footer id=\"footer\">\n    </footer>\n</div>";
},"useData":true});

this["JST"]["layout/footer"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"container\">\n  <div class=\"well\" style=\"margin: 0;\">\n\n\n    <p class=\"hidden\">I'am footer partial</p>\n\n    <p class=\"hidden\">"
    + this.escapeExpression((helpers.link_to || (depth0 && depth0.link_to) || helpers.helperMissing).call(depth0,{"name":"link_to","hash":{"body":"Click on subview","id":"click-me","href":"#click-me"},"data":data}))
    + "</p>\n\n    <p>\n<a href=\"#window-close\" id=\"window-close\" class=\"btn btn-primary\"><i class=\"mdi-navigation-close pull-left\"></i> Close window</a>\n\n    </p>\n\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["layout/header"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<div class=\"navbar navbar-material-amber shadow-z-1\" style=\"-webkit-app-region: drag\">\n  <a id=\"menuToggler\" class=\"btn btn-fab btn-link pull-left\" href=\"javascript:void(0)\">\n    <i class=\"mdi-action-view-headline\"></i>\n  </a>\n  <div id=\"actions-form\">\n\n  </div>\n</div>\n\n";
},"useData":true});

this["JST"]["layout/main"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "";
},"useData":true});

this["JST"]["layout/menu"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    return " checked=\"checked\" ";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, alias1=this.escapeExpression, alias2=helpers.helperMissing;

  return "<div class=\"well\">\n    <h5>Sync apps over internet only</h5>\n    <div class=\"checkbox\">\n        <label>\n            <input type=\"checkbox\" id=\"isOnline\" "
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.isOnline : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "> Sync\n        </label>\n    </div>\n</div>\n\n<div class=\"panel-group\" id=\"accordion\" role=\"tablist\" aria-multiselectable=\"true\">\n    <div class=\"panel panel-default\">\n        <a class=\"btn btn-info btn-block\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#user-section\" aria-expanded=\"true\" aria-controls=\"user-section\" role=\"tab\" id=\"headingUser\">\n      User\n    </a>\n        <div id=\"user-section\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingUser\">\n            <div class=\"list-style-group\">\n                <a class=\"list-group-item\" href=\"#records/user/"
    + alias1(this.lambda(((stack1 = (depth0 != null ? depth0.authUser : depth0)) != null ? stack1.id : stack1), depth0))
    + "\">My records</a>\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Settings","href":"#user","class":"list-group-item"},"data":data}))
    + "\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Rates","href":"#user/rates","class":"list-group-item"},"data":data}))
    + "\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Logout","href":"#user/logout","class":"list-group-item"},"data":data}))
    + "\n            </div>\n        </div>\n    </div>\n    <div class=\"panel panel-default\">\n        <a class=\"btn btn-primary btn-block\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#projects-section\" aria-expanded=\"true\" aria-controls=\"projects-section\" role=\"tab\" id=\"headingProjects\">\n      Projects\n    </a>\n        <div id=\"projects-section\" class=\"panel-collapse collapse in\" role=\"tabpanel\" aria-labelledby=\"headingProjects\">\n            <div class=\"list-style-group\">\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"All Records","href":"#records","class":"list-group-item"},"data":data}))
    + "\n                <div class=\"list-group-item\" style=\"padding: 0\">\n                    <input type=\"search\" class=\"form-control input-search\" placeholder=\"Find Project\" style=\"padding: 10px 15px; height: 38px; margin-bottom: 0;\" />\n                    <ul class=\"dropdown-menu menu-projects\" role=\"menu\" style=\"width: 100%;\">\n                    </ul>\n\n                </div>\n\n            </div>\n        </div>\n    </div>\n    <div class=\"panel panel-default\">\n        <a class=\"btn btn-material-purple btn-block\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#reports-section\" aria-expanded=\"true\" aria-controls=\"reports-section\" role=\"tab\" id=\"headingReports\">\n      Reports\n    </a>\n        <div id=\"reports-section\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingReports\">\n            <div class=\"list-style-group\">\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Reports list","href":"#reports","class":"list-group-item"},"data":data}))
    + "\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Report 1","href":"#reports/1","class":"list-group-item"},"data":data}))
    + "\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Report 2","href":"#reports/2","class":"list-group-item"},"data":data}))
    + "\n            </div>\n        </div>\n    </div>\n    <div class=\"panel panel-default\">\n        <a class=\"btn btn-warning btn-block\" data-toggle=\"collapse\" data-parent=\"#accordion\" href=\"#admin-section\" aria-expanded=\"true\" aria-controls=\"admin-section\" role=\"tab\" id=\"headingAdmin\">\n      Admin\n    </a>\n        <div id=\"admin-section\" class=\"panel-collapse collapse\" role=\"tabpanel\" aria-labelledby=\"headingAdmin\">\n            <div class=\"list-style-group\">\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Dashboard","href":"#admin/dashboard","class":"list-group-item"},"data":data}))
    + "\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Users list","href":"#admin/users","class":"list-group-item"},"data":data}))
    + "\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Projects list","href":"#admin/projects","class":"list-group-item"},"data":data}))
    + "\n                "
    + alias1((helpers.link_to || (depth0 && depth0.link_to) || alias2).call(depth0,{"name":"link_to","hash":{"body":"Actions list","href":"#admin/actions","class":"list-group-item"},"data":data}))
    + "\n            </div>\n        </div>\n    </div>\n    <div class=\"panel panel-default\">\n        <a class=\"btn btn-material-yellow btn-block\" data-parent=\"#accordion\" href=\"#user/rates\" aria-expanded=\"true\" aria-controls=\"stats-section\" role=\"tab\" id=\"headingStats\">\n      Stats\n    </a>\n        <div id=\"stats-section\" role=\"tabpanel\" aria-labelledby=\"headingStats\">\n            <table class=\"table table-condensed\">\n                <tbody>\n                    <tr class=\"active\">\n                        <td class=\"when\">Today:</td>\n                        <td class=\"time\">0:00</td>\n                        <td class=\"pounds\">£0.0</td>\n                    </tr>\n                    <tr class=\"nonactual\">\n                        <td class=\"when\">Yesterday:</td>\n                        <td class=\"time\">8:00</td>\n                        <td class=\"pounds\">£8.0</td>\n                    </tr>\n                    <tr class=\"active\">\n                        <td class=\"when\">This week:</td>\n                        <td class=\"time\">16:00</td>\n                        <td class=\"pounds\">£16.0</td>\n                    </tr>\n                    <tr class=\"nonactual\">\n                        <td class=\"when\">Previous week:</td>\n                        <td class=\"time\">32:00</td>\n                        <td class=\"pounds\">£32.0</td>\n                    </tr>\n                    <tr class=\"active\">\n                        <td class=\"when\">This month:</td>\n                        <td class=\"time\">48:00</td>\n                        <td class=\"pounds\">£48.0</td>\n                    </tr>\n                    <tr class=\"nonactual\">\n                        <td class=\"when\">Previous month:</td>\n                        <td class=\"time\">0:00</td>\n                        <td class=\"pounds\">£0.0</td>\n                    </tr>\n                </tbody>\n            </table>\n        </div>\n    </div>\n</div>";
},"useData":true});

this["JST"]["projects/admin_project"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"row\" id=\""
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n\n  <div class=\"col-icon col-md-1 col-sm-2\">\n    <a  class=\"type btn btn-fab btn-fab-mini btn-material-blue\" role=\"menuitem\" tabindex=\"-1\" href=\"#fat\"  data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n      <i class=\"mdi-content-add-circle-outline\"></i>\n    </a>\n    <a class=\"edit btn btn-fab btn-fab-mini btn-flat pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Edit action\">\n      <i class=\"mdi-editor-mode-edit\"></i>\n    </a>\n  </div>\n\n  <div class=\"col-subject col-md-10 col-sm-9\">\n\n    "
    + alias3((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"textarea",{"name":"placeholder","hash":{},"data":data}))
    + "\n    <div class=\"subject\" style=\"border: none;\">"
    + alias3((helpers.nl2br || (depth0 && depth0.nl2br) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"nl2br","hash":{},"data":data}))
    + "</div>\n\n    <p class=\"last-update\">\n        <time class=\"text-muted\" datetime=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.dateFormat || (depth0 && depth0.dateFormat) || alias1).call(depth0,(depth0 != null ? depth0.updatedAt : depth0),{"name":"dateFormat","hash":{},"data":data}))
    + "</time>\n    </p>\n\n  </div>\n\n  <div class=\"col-menu col-md-1 col-sm-1\">\n    <ul class=\"actions\">\n      <li><a class=\"delete btn btn-fab btn-danger btn-fab-mini pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Delete action\">\n        <i class=\"mdi-navigation-cancel\"></i>\n      </a></li>\n    </ul>\n  </div>\n</div>";
},"useData":true});

this["JST"]["projects/project"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"row\" id=\""
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n\n  <div class=\"col-icon col-md-1 col-sm-2\">\n    <a  class=\"type btn btn-fab btn-fab-mini btn-material-blue\" role=\"menuitem\" tabindex=\"-1\" href=\"#fat\"  data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n      <i class=\"mdi-content-add-circle-outline\"></i>\n    </a>\n  </div>\n\n  <div class=\"col-subject col-md-10 col-sm-9\">\n\n    <div class=\"subject\" style=\"border: none;\">"
    + alias3((helpers.nl2br || (depth0 && depth0.nl2br) || alias1).call(depth0,(depth0 != null ? depth0.name : depth0),{"name":"nl2br","hash":{},"data":data}))
    + "</div>\n\n    <p class=\"last-update\">\n        <time class=\"text-muted\" datetime=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.dateFormat || (depth0 && depth0.dateFormat) || alias1).call(depth0,(depth0 != null ? depth0.updatedAt : depth0),{"name":"dateFormat","hash":{},"data":data}))
    + "</time>\n    </p>\n\n  </div>\n\n  <div class=\"col-menu col-md-1 col-sm-1\">\n  </div>\n</div>";
},"useData":true});

this["JST"]["records/record"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"row\" id=\""
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n\n  <div class=\"col-icon col-md-1 col-sm-2\">\n    <a  class=\"type btn btn-fab btn-fab-mini btn-material-lime\" role=\"menuitem\" tabindex=\"-1\" href=\"#fat\"  data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\"Project not defined\">\n      <i class=\"mdi-action-bookmark-outline\"></i>\n    </a>\n    <a class=\"edit btn btn-fab btn-fab-mini btn-flat pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Edit action\">\n      <i class=\"mdi-editor-mode-edit\"></i>\n    </a>\n  </div>\n\n  <div class=\"col-subject col-md-10 col-sm-9\">\n    <p class=\"record-info text-info\">\n      <button class=\"btn btn-xs btn-info\" role='do-active' title=\"Make active\" status-start=\"Start\" status-stop=\"Stop\"></button>\n      <a href=\"#records"
    + alias3((helpers.filteredHref || (depth0 && depth0.filteredHref) || alias1).call(depth0,{"name":"filteredHref","hash":{"user":(depth0 != null ? depth0.user : depth0),"filter":(depth0 != null ? depth0.filter : depth0)},"data":data}))
    + "\" class='record-info-user' title=\"User\"><i class=\"mdi-action-face-unlock\"></i><span>"
    + alias3(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"user","hash":{},"data":data}) : helper)))
    + "</span>&#0160;</a>\n      <a href=\"#records"
    + alias3((helpers.filteredHref || (depth0 && depth0.filteredHref) || alias1).call(depth0,{"name":"filteredHref","hash":{"project":(depth0 != null ? depth0.project : depth0),"filter":(depth0 != null ? depth0.filter : depth0)},"data":data}))
    + "\" class='record-info-project' title=\"Project\"><i class=\"mdi-content-add-circle\"></i><span>"
    + alias3(((helper = (helper = helpers.project || (depth0 != null ? depth0.project : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"project","hash":{},"data":data}) : helper)))
    + "</span>&#0160;</a>\n      <time datetime=\""
    + alias3(((helper = (helper = helpers.recordDate || (depth0 != null ? depth0.recordDate : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"recordDate","hash":{},"data":data}) : helper)))
    + "\" title=\"Record Date\"><i class=\"mdi-action-event\"></i>"
    + alias3((helpers.dateFormat || (depth0 && depth0.dateFormat) || alias1).call(depth0,(depth0 != null ? depth0.recordDate : depth0),{"name":"dateFormat","hash":{},"data":data}))
    + "<!--  / "
    + alias3(((helper = (helper = helpers.recordDate || (depth0 != null ? depth0.recordDate : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"recordDate","hash":{},"data":data}) : helper)))
    + " --></time>\n      &#0160;\n      <span title=\"Record Time\" class=\"recordTime\"><i class=\"mdi-action-schedule\"></i><span class=\"value\">"
    + alias3((helpers.minuteFormat || (depth0 && depth0.minuteFormat) || alias1).call(depth0,(depth0 != null ? depth0.recordTime : depth0),{"name":"minuteFormat","hash":{},"data":data}))
    + "</span><span class=\"hidden\"> / "
    + alias3(((helper = (helper = helpers.recordTime || (depth0 != null ? depth0.recordTime : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"recordTime","hash":{},"data":data}) : helper)))
    + "</span></span>\n\n      <!-- &#0160;\n      "
    + alias3(((helper = (helper = helpers.user || (depth0 != null ? depth0.user : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"user","hash":{},"data":data}) : helper)))
    + " / "
    + alias3(((helper = (helper = helpers.project || (depth0 != null ? depth0.project : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"project","hash":{},"data":data}) : helper)))
    + " -->\n    </p>\n    "
    + alias3((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"textarea",{"name":"placeholder","hash":{},"data":data}))
    + "\n    <div class=\"subject\" style=\"border: none;\">"
    + alias3((helpers.nl2br || (depth0 && depth0.nl2br) || alias1).call(depth0,(depth0 != null ? depth0.subject : depth0),{"name":"nl2br","hash":{},"data":data}))
    + "</div>\n\n    <p class=\"last-update\">\n        <time class=\"text-muted\" datetime=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.dateFormat || (depth0 && depth0.dateFormat) || alias1).call(depth0,(depth0 != null ? depth0.updatedAt : depth0),{"name":"dateFormat","hash":{},"data":data}))
    + "<span class=\"hidden\"> / "
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</span></time>\n    </p>\n\n  </div>\n\n  <div class=\"col-menu col-md-1 col-sm-1\">\n    <ul class=\"actions\">\n      <li><a class=\"delete btn btn-fab btn-danger btn-fab-mini pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Delete action\">\n        <i class=\"mdi-navigation-cancel\"></i>\n      </a></li>\n    </ul>\n  </div>\n</div>";
},"useData":true});

this["JST"]["records/records"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var stack1, helper, alias1=helpers.helperMissing, alias2=this.escapeExpression, alias3="function", alias4=this.lambda;

  return "    <li>\n      <a class=\"removeFilter\" href=\"#records"
    + alias2((helpers.filteredHref || (depth0 && depth0.filteredHref) || alias1).call(depth0,{"name":"filteredHref","hash":{"exclude":(data && data.key),"filter":((stack1 = (data && data.root)) && stack1.filter)},"data":data}))
    + "\" data-exclude=\""
    + alias2(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "\" data-value=\""
    + alias2(alias4(depth0, depth0))
    + "\" title=\"Remove filter "
    + alias2(((helper = (helper = helpers.key || (data && data.key)) != null ? helper : alias1),(typeof helper === alias3 ? helper.call(depth0,{"name":"key","hash":{},"data":data}) : helper)))
    + "\">\n        <i class=\"mdi-content-remove-circle\"></i>\n        <span class='caption'>"
    + alias2(alias4(depth0, depth0))
    + "</span>\n      </a>\n    </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<header class=\"page-title clearfix\">\n  <ul class=\"nav nav-pills pull-left\">\n    <li>\n      <h2>\n        "
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\n      </h2>\n    </li>\n"
    + ((stack1 = helpers.each.call(depth0,(depth0 != null ? depth0.filter : depth0),{"name":"each","hash":{},"fn":this.program(1, data, 0),"inverse":this.noop,"data":data})) != null ? stack1 : "")
    + "  </ul>\n</header>\n\n<footer>\n  <div class=\"btn btn-block btn-primary btn-lg btn-loadmore\">Load more...</div>\n</footer>";
},"useData":true});

this["JST"]["reports/report"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<header>\n  <h2 class=\"page-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\n</header>";
},"useData":true});

this["JST"]["reports/reports"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper;

  return "<header>\n  <h2 class=\"page-title\">"
    + this.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "</h2>\n</header>";
},"useData":true});

this["JST"]["users/admin_user"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"row\" id=\""
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n\n  <div class=\"col-icon col-md-1 col-sm-2\">\n    <a  class=\"type btn btn-fab btn-fab-mini btn-material-amber\" role=\"menuitem\" tabindex=\"-1\" href=\"#fat\"  data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n      <i class=\"mdi-social-person-outline\"></i>\n    </a>\n    <a class=\"edit btn btn-fab btn-fab-mini btn-flat pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Edit action\">\n      <i class=\"mdi-editor-mode-edit\"></i>\n    </a>\n  </div>\n\n  <!-- <div class=\"col-subject col-md-1 col-sm-1\">\n    <img src=\"http://www.gravatar.com/avatar/"
    + alias3(((helper = (helper = helpers.hash || (depth0 != null ? depth0.hash : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"hash","hash":{},"data":data}) : helper)))
    + "?s=100\" alt=\"\" style=\"width:100%; border-radius: 50px;\" />\n  </div> -->\n  <div class=\"col-subject col-md-10 col-sm-9\">\n\n    <!-- "
    + alias3((helpers.placeholder || (depth0 && depth0.placeholder) || alias1).call(depth0,"textarea",{"name":"placeholder","hash":{},"data":data}))
    + " -->\n    <div class=\"subject\" style=\"border: none;\">\n      "
    + alias3((helpers.nl2br || (depth0 && depth0.nl2br) || alias1).call(depth0,(depth0 != null ? depth0.first_name : depth0),{"name":"nl2br","hash":{},"data":data}))
    + " "
    + alias3((helpers.nl2br || (depth0 && depth0.nl2br) || alias1).call(depth0,(depth0 != null ? depth0.last_name : depth0),{"name":"nl2br","hash":{},"data":data}))
    + "\n      &nbsp;<a href=\"mailto:"
    + alias3(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"email","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.email || (depth0 != null ? depth0.email : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"email","hash":{},"data":data}) : helper)))
    + "</a>\n      <br />\n      DPR: "
    + alias3(((helper = (helper = helpers.default_pay_rate || (depth0 != null ? depth0.default_pay_rate : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"default_pay_rate","hash":{},"data":data}) : helper)))
    + "\n    </div>\n\n    <p class=\"last-update\">\n        <time class=\"text-muted\" datetime=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.dateFormat || (depth0 && depth0.dateFormat) || alias1).call(depth0,(depth0 != null ? depth0.updatedAt : depth0),{"name":"dateFormat","hash":{},"data":data}))
    + "</time>\n    </p>\n\n  </div>\n\n  <div class=\"col-menu col-md-1 col-sm-1\">\n    <ul class=\"actions\">\n      <li><a class=\"delete btn btn-fab btn-danger btn-fab-mini pull-right\" href=\"javascript:void(0)\" data-toggle=\"tooltip\" data-placement=\"left\" title=\"\" data-original-title=\"Delete action\">\n        <i class=\"mdi-navigation-cancel\"></i>\n      </a></li>\n    </ul>\n  </div>\n</div>";
},"useData":true});

this["JST"]["users/details"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<header>\n  <h2 class=\"page-title\">User Details</h2>\n</header>";
},"useData":true});

this["JST"]["users/rates"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    return "<header>\n  <h2 class=\"page-title\">User Rates</h2>\n</header>";
},"useData":true});

this["JST"]["users/user"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<div class=\"row\" id=\""
    + alias3(((helper = (helper = helpers._id || (depth0 != null ? depth0._id : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"_id","hash":{},"data":data}) : helper)))
    + "\">\n\n  <div class=\"col-icon col-md-1 col-sm-2\">\n    <a  class=\"type btn btn-fab btn-fab-mini btn-material-amber\" role=\"menuitem\" tabindex=\"-1\" href=\"#fat\"  data-toggle=\"tooltip\" data-placement=\"right\" title=\"\" data-original-title=\""
    + alias3(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"title","hash":{},"data":data}) : helper)))
    + "\">\n      <i class=\"mdi-social-person-outline\"></i>\n    </a>\n  </div>\n\n  <div class=\"col-subject col-md-10 col-sm-9\">\n\n    <div class=\"subject\" style=\"border: none;\">"
    + alias3((helpers.nl2br || (depth0 && depth0.nl2br) || alias1).call(depth0,(depth0 != null ? depth0.first_name : depth0),{"name":"nl2br","hash":{},"data":data}))
    + "</div>\n\n    <p class=\"last-update\">\n        <time class=\"text-muted\" datetime=\""
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3((helpers.dateFormat || (depth0 && depth0.dateFormat) || alias1).call(depth0,(depth0 != null ? depth0.updatedAt : depth0),{"name":"dateFormat","hash":{},"data":data}))
    + "</time>\n    </p>\n\n  </div>\n\n  <div class=\"col-menu col-md-1 col-sm-1\">\n  </div>\n</div>";
},"useData":true});