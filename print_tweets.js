var markov = require('./markov');
var fs = require('fs');
var sys = require('sys');

eval(fs.readFileSync('config.js', 'utf-8'));

run = function() {
  markov.loadPersonas(function(personas) {
    for (var i=0; i<settings.repeat; i++) {
      // choose a random persona and print a tweet
      var persona = markov.chooseOne(personas);
      sys.puts('@'+ persona.info.username + ' ' + persona.tweet() + '\n');
    }
  });
};

if (!module.parent) {
    run();
}
