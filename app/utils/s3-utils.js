import knox from 'knox'

export function uploadObject(credentials, filename, object, callback) {
  let client = knox.createClient(credentials)
  let string = JSON.stringify(object)
  let req = client.put(filename, {
    'Content-Length': Buffer.byteLength(string),
    'Content-Type': 'application/json',
    'x-amz-acl': 'public-read'
  })
  req.on('response', function(res) {
    if (200 == res.statusCode) {
      callback({ url: req.url, err: null, res: res })
    } else {
      callback({ url: null, err: true, res: res })
    }
  })
  req.end(string)
}