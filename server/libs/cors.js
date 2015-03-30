module.exports = function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", "*");
  // res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  // // res.header('Access-Control-Allow-Headers', 'Content-Type');
  // res.header("Access-Control-Allow-Headers", "X-Requested-With");
  // next();
  var oneof = false;
  if(req.headers.origin) {
      res.header('Access-Control-Allow-Origin', req.headers.origin);
      oneof = true;
  }
  if(req.headers['access-control-request-method']) {
      res.header('Access-Control-Allow-Methods', req.headers['access-control-request-method']);
      oneof = true;
  }
  if(req.headers['access-control-request-headers']) {
      res.header('Access-Control-Allow-Headers', req.headers['access-control-request-headers']);
      oneof = true;
  }
  if(oneof) {
      res.header('Access-Control-Allow-Credentials', "true");
      res.header('Access-Control-Max-Age', 60 * 60 * 24 * 365);
  }
  // intercept OPTIONS method
  if (oneof && req.method == 'OPTIONS') {
      res.sendStatus(200);
  }
  else {
      next();
  }
};


