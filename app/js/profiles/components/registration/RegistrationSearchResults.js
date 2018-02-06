import React, { PropTypes } from 'react'
import UsernameResult from './UsernameResult'

const RegistrationSearchResults = props => {
  const {
    searchingUsername,
    nameSuffixes,
    availableNames,
    index,
    showSearchBox
  } = props;

  const renderSearchResults = props.nameSuffixes.map(suffix => {
    const name = `${searchingUsername}.${suffix}`;
    const availability = availableNames[name];
    const isSubdomain = suffix.split('.').length > 1

    return (
      <UsernameResult
        key={ suffix }
        name={ name }
        availability={ availability }
        isSubdomain={ isSubdomain }
        index={ index }
      />
    )
  })

  return (
    <div>
      <h3 className="modal-heading">Available names</h3>
      <div className="modal-body">
        <div className="username-search-result-list">
          {props.searchingUsername && renderSearchResults}
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
RegistrationSearchResults.propTypes = {
  showSearchBox: PropTypes.func.isRequired,
  searchingUsername: PropTypes.string,
  nameSuffixes: PropTypes.array.isRequired,
  availableNames: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired
}

export default RegistrationSearchResults;
