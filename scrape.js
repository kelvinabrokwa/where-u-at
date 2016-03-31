var request = require('request');

var formData = {
  term_code: 201620,
  term_subj: 0,
  attr: 0,
  attr2: 0,
  levl: 0,
  status: 0,
  ptrm: 0,
  search: 'Search'
};

var url = 'https://courselist.wm.edu/courselist/courseinfo/searchresults';

request.post({ url: url, formData: formData }, function(err, res, body) {
  if (err) throw err;
  process.stdout.write(body);
});
