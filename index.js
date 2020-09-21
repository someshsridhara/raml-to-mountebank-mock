// import the mountebank helper library
const mbHelper = require('mountebank-helper');
const raml = require('./raml.json');
// create the skeleton for the imposter (does not post to MB)
const imposter = new mbHelper.Imposter({'imposterPort': 3000});


function addEndpoint(raml) {
    for (let i = 0; i < raml.length; i += 1) {
        let endpoint = {
            'uri': raml[i].completeRelativeUri,
            'verb': raml[i].httpMethod.toUpperCase(),
            'res': {
                'statusCode': raml[i].responses["0"] ? parseInt(raml[i].responses["0"].code) : 200,
                'responseHeaders': {'Content-Type': 'application/json'},
                'responseBody': raml[i].responses["0"].examples["0"] ? raml[i].responses["0"].examples["0"].value : JSON.stringify({})
            }
        };
        imposter.addRoute(endpoint);
    }
}

// start the MB server  and post our Imposter to listen!
function main() {
    addEndpoint(raml);
    mbHelper.startMbServer(2525)
        .then(function () {
            imposter.postToMountebank()
                .then(() => {
                    console.log('Imposter Posted! Go to http://localhost:3000/hello');
                });
        });

}

main();
