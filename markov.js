var async = require('async'),
    fs = require('fs');

parseTweets = function(startdir, callback) {
    // Given a directory 'tweets' containing a bunch of xml files from twitter,
    // naively extract the text cotent from each tweet.  On completion, call
    // 'callback' with a list of tweets.
    var tweets = [];

    fs.readdir(startdir, function(err, dirs) {
        async.forEach(dirs, 
            function(file, callback) {
                if (file.match(/\.xml$/)) {
                    fs.readFile(startdir+'/'+file, 'UTF-8', function(err, data) {
                        if (err) throw err;
                        var text_re = /<text>(.*?)<\/text>/mg;
                        while (match = text_re.exec(data)) {
                            tweets.push(match[1]);
                        }
                        callback();
                    });
                }
                else callback();
            }, 
            function(err) { 
                if (err) throw err;
                callback(tweets);
            } 
        );
    });
};

exports.loadPersonas = loadPersonas = function(callback) {
    var personas = [];
    fs.readdir('./personas', function(err, dirs) {
        async.forEach(dirs, 
            function(dir, callback) {
                if (err) throw err;
                var persona = new markov();
                persona.info = eval(fs.readFileSync('./personas/'+dir+'/metadata.js', 'UTF-8'));
                persona.loadTweets('./personas/'+dir, function() {
                    personas.push(persona);    
                    callback();
                });
            },
            function(err) {
                if (err) throw err;
                callback(personas);
            }
        );
    });
};

exports.chooseOne = chooseOne = function(list) {
    var index = Math.floor(Math.random() * list.length);
    var choice = list[index];
    return choice;
};

exports.markov = markov = function(options) {
    options = options || {};
    this.histsize = options.histsize || 2;
    this.trans = {};
    this.info = {};

    var self = this;

    this.add = function(state, next) {
        if (! (state in self.trans)) self.trans[state] = [];
        self.trans[state].push(next);
    };

    this.put = function(seq) {
        for (var i=0; i<seq.length; i++) {
            var state = seq.slice(Math.max(0, i-self.histsize), i);
            var next = seq.slice(i, i+1);
            if (next) self.add(state, next);
        }
        self.add(seq.slice(seq.length-self.histsize), '');
    };
        
    this.tweet = function() {
        var seq = chooseOne(self.trans['']),
            tweet = '',
            subseq,
            next;

        tries = 5;
        while (tries) {
            while (true) {
                subseq = seq.slice(Math.max(0, seq.length-self.histsize));
                next = chooseOne(self.trans[subseq]);
                if ( ! next) break;
                seq.push(next);
            }
            tweet = seq.join( ' ');
            if (tweet.length <= 140) break;
            tries -= 1;
        }
        return tweet;
    };

    this.loadTweets = function(startdir, callback) {
        parseTweets(startdir, function(tweets) {
            tweets.map(function(tweet) { self.put(tweet.split(/\s+/)) });
            callback();
        });
    };

    return self;
};

if (!module.parent) {
    var count = 10;
    if (process.argv.length > 2){
        count = process.argv[2];
    }

    loadPersonas(function(personas) {
        tweet = function() {
            var persona = chooseOne(personas);
            console.log('('+persona.info.name+')', persona.tweet() + '\n');
        };
        loop = function() {
            setTimeout(function() {
                tweet();
                loop();
            }, 4000);
        };
        tweet();
        loop();
    });    
}
