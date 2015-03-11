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
  users.insert({name: 'User 10', user: 20});
  users.insert({name: 'User 11', user: 21});
  users.insert({name: 'User 12', user: 22});

  // console.log(users.data);
  db.saveDatabase();
}

function loki_get(db){
  db.loadDatabase({}, function () {
    var users = db.getCollection('users');
    // var records = users.data.length;
    if (users) {

      console.log('users', users.data);
    }
    else {

      console.log('no users Data');
      console.log('will create');
      loki_add(db);
    }
  });
}

function loki(){
  test('<li>Start loki</li>');
  // console.log('111');
  var loki = require('lokijs'),
  // db = new loki('usersLS');
  db = new loki('users_1.json');
  // loki_add(db);
  loki_get(db);

}

window.onload = function() {
  test('window on load from File');
  loki();
};
