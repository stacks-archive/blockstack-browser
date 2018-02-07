import React from 'react'
import UsernameResult from './UsernameResult'

type Props = {
  showSearchBox: Function,
  searchingUsername?: string,
  nameSuffixes: Array<string>,
  availableNames: Object,
  index: number
}

const RegistrationSearchResults = (props: Props) => {
  const {
    searchingUsername,
    nameSuffixes,
    availableNames,
    index,
    showSearchBox
  } = props

  const renderSearchResults = nameSuffixes.map(suffix => {
    const name = `${searchingUsername}.${suffix}`
    const availability = availableNames[name]
    const isSubdomain = suffix.split('.').length > 1

    return (
      <UsernameResult
        key={suffix}
        name={name}
        availability={availability}
        isSubdomain={isSubdomain}
        index={index}
      />
    )
  })

  return (
    <div>
      <h3 className="modal-heading">Available names</h3>
      <div className="modal-body">
        <div className="username-search-result-list">
          {searchingUsername && renderSearchResults}
        </div>

        <button
          onClick={showSearchBox}
          className="btn btn-tertiary btn-block"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default RegistrationSearchResults
