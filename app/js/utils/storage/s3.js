//import knox from 'knox'

// TODO implement
export function uploadProfileToS3(api, domainName, signedProfileTokenData) {
  throw "S3 storage is not yet implemented"

  let client = knox.createClient(credentials)
  let req = client.put(`${domainName}`, {
    'Content-Length': Buffer.byteLength(string),
    'Content-Type': 'application/json',
    'x-amz-acl': 'public-read'
  })
  req.on('response', function(res) {
    if (200 == res.statusCode) {
      callback({ url: req.url, err: false, res: res })
    } else {
      callback({ url: null, err: true, res: res })
    }
  })
  req.end(string)
}


export function uploadPhotoToS3(api, domainName, photoFile, index) {
  throw "S3 storage is not yet implemented"

}
