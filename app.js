var markov = require('./markov');
var request = require('request');
var http = require('http');

settings = {url: '/blip',
            port: 3000,
            host: 'localhost'};

sendTweet = function(persona, callback) {
    var tweet = persona.tweet();

    console.log("send:", tweet);
    var ublog = http.createClient(settings.port, settings.hots);
    var request = ublog.request('POST', '/blip', 
        {'host': settings.host,
         'Content-Type': '/application/json'});

    request.write(JSON.stringify({
        name: persona.info.name,
        text: tweet}), 
        'UTF-8');
    request.end();
}; 

run = function(interval, maximum) {
    interval = interval || 10;
    maximum = maximum || 1000;
    passes = 0;
    markov.loadPersonas(function(personas) {

        send = function(){
            sendTweet(markov.chooseOne(personas), function(code) {
                console.log("code:", code);
            });
        };

        loop = function() {
            send();
            if (passes < maximum) {
                passes += 1;
                setTimeout(loop, interval);
            }    
        };

        loop();

    });        
};

if (!module.parent) {
    run();
}
