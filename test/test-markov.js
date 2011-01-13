var testCase = require('nodeunit').testCase;

var loadPersonas = require('../markov').loadPersonas;
var chooseOne = require('../markov').chooseOne;

module.exports = testCase({
    test_personas: function(test) {
        loadPersonas(function(personas) {

            // we have defined some personas
            test.ok(personas.length > 0);

            for (var i=0; i<personas.length; i++) {
                var persona = personas[i];

                // the metadata gets parsed correctly
                test.ok(persona.info.name);

                // each persona can tweet
                test.equal(typeof persona.tweet(), 'string');
            }


            test.done();
        });
    },
    
    test_chooseOne: function(test) {
        // chooseOne picks a value from within a list
        test.expect(100);
        list = [1,2,3,4,5,6,7,8,9,10];
        for (var i=0; i<100; i++) {
            test.ok(list.indexOf(chooseOne(list)) > -1);
        }
        test.done();
    }

});
