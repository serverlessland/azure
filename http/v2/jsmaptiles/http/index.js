const https = require('https');
const Stream = require('stream').Transform;

const envInstance = process.env["WEBSITE_INSTANCE_ID"];
const instance = envInstance ? `AZ:${envInstance}` : "LOCAL:LOCAL";

let count = 0;

async function downloadImage(url) {
  return new Promise((resolve, reject) => {
    https.request(url, function(response) {                                        
      var chunks = [];

      response.on('data', function(chunk) {                                       
        chunks.push(chunk);                                                         
      });                                                                         

      response.on('end', function() {                                             
        resolve(Buffer.concat(chunks));
      });                                                                         
    }).end();
  });
}


module.exports = async function(context) {
  count += 1;

  const image = await downloadImage('https://b.tile.openstreetmap.org/' + context.bindingData.path);

  context.res = { 
    status: 200, 
    body: image,
    isRaw: true,
    headers: {
        "Content-Type": "image/png",
        "X-CB-Name": "Azure_JSNoop",
        "X-CB-Count": count,
        "X-CB-Instance": instance
    } 
  }; 
};
