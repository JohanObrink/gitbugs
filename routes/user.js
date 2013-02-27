
/*
 * GET users listing.
 */
exports.index = function(req, res) {
  res.view('user');
};

exports.list = function(req, res){
  res.send("respond with a resource");
};
