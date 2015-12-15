export function getName(profile) {
  var name = ''
  if (profile.givenName || profile.familyName) {
    if (profile.givenName) {
      name = profile.givenName
    }
    if (profile.familyName) {
      name += ' ' + profile.familyName
    }
  } else if (profile.name) {
    name = profile.name
  }
  return name
}

export function getVerifiedAccounts(profile, verifications) {
  var filteredAccounts = []
  if (profile.account) {
    profile.account.forEach(function(account) {
      var proofUrl = ''
      verifications.forEach(function(verification) {
        if (verification.valid && verification.service === account.service
            && verification.identifier === account.identifier) {
          proofUrl = verification.proof_url
        }
      })
      account.proofUrl = proofUrl
      if (account.identifier && account.service) {
        filteredAccounts.push(account)
      }
    })
  }
  return filteredAccounts
}

export function getAvatarUrl(profile) {
  var avatarContentUrl
  if (profile.image) {
    if (profile.image.length > 0) {
      avatarContentUrl = profile.image[0].contentUrl
    }
  }
  return avatarContentUrl
}

export function httpGetAsync(theUrl, callback) {
  var xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
      callback(xmlHttp.responseText)
    }
  }
  xmlHttp.open("GET", theUrl, true)
  xmlHttp.send(null)
}