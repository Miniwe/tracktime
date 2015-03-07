'use strict';

// var findpath = require('node-webkit').findpath;
// var nwpath = findpath();
// document.write(nwpath);

function test(msg) {
  var el = document.getElementById('status');
  if (el && msg) {
    el.innerHTML = msg;
  }
}

function loki_add(db){
  var users = db.addCollection('users', {indices:['name']});
  users.insert({name: 'User 0', user: 10});
  users.insert({name: 'User 1', user: 11});
  users.insert({name: 'User 2', user: 12});

  // console.log(users.data);
  db.saveDatabase();
}

function loki_get(db){
  db.loadDatabase({}, function () {
    var users = db.getCollection('users')
    console.log('users', users.data);
  });
}

function loki(){
  test('<li>Start loki</li>');
  // console.log('111');
  var loki = require('lokijs'),
  db = new loki('users_1.json');
  // loki_add(db);
  loki_get(db);

}

window.onload = function() {
  test('window on load from File');
  loki();
};
