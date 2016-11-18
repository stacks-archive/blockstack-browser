import knox from 'knox'

export function uploadToS3(credentials, filename, string, callback) {
  let client = knox.createClient(credentials)
  let req = client.put(filename, {
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

export function uploadToBlockstackLabsS3(filename, data, callback) {
  fetch('https://api.onename.com/v1/upload', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: filename,
      value: data
    })
  })
    .then((response) => response.text())
    .then((responseText) => JSON.parse(responseText))
    .then((responseJson) => {
      if (responseJson.hasOwnProperty('url')) {
        callback({ url: responseJson.url, err: false, res: responseJson })
      } else {
        callback({ url: null, err: true, res: responseJson })
      }
    })
    .catch((error) => {
      console.warn(error)
    })
}

export function uploadFile(api, filename, data, callback) {
  let uploadDirectlyToS3 = false

  if (api.hostedDataLocation === 'self-hosted-S3' &&
      api.s3ApiKey.length > 0 &&
      api.s3ApiSecret.length > 0 &&
      api.s3Bucket.length > 0) {
    uploadDirectlyToS3 = true
  }

  if (uploadDirectlyToS3) {
    const credentials = {
      key: api.s3ApiKey,
      secret: api.s3ApiSecret,
      bucket: api.s3Bucket
    }
    uploadToS3(credentials, filename, data, callback)
  } else {
    uploadToBlockstackLabsS3(filename, data, callback)
  }
}