import React, { PropTypes } from 'react'
import UsernameResultSubdomain from './UsernameResultSubdomain'
import UsernameResultDomain from './UsernameResultDomain'
import roundTo from 'round-to'
import { PRICE_BUFFER } from './RegistrationSelectView'
import { Link } from 'react-router'

const UsernameResult = (props) => {
  const {
    name,
    index,
    availability = {},
    isSubdomain
  } = props;
  const {
    checkingPrice,
    available,
    checkingAvailability
  } = availability;

  let price = availability.price || 0;
  price = roundTo.up(price, 6) + PRICE_BUFFER

  const renderChecking = () => (
    <div className="account-check">
      <h4>Checking {name}...</h4>
    </div>
  );

  const resultTaken = (
    <div className='username-search-result'>
      <h4>{name}</h4>
      <button
        className="btn btn-primary btn-block"
        disabled
      >
        {name} is already taken
      </button>
    </div>
  )

  const renderResult = () => isSubdomain ? (
    <UsernameResultSubdomain
      name={ name }
      index={ index }
    />
  ) : (
    <UsernameResultDomain
      checkingPrice={ checkingPrice }
      name={ name }
      price={ price }
      index={ index }
    />
  )

  const renderAvailability = () => (available ? renderResult() : resultTaken);
  return checkingAvailability ? renderChecking() : renderAvailability();
}
UsernameResult.propTypes = {
  name: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  availability: PropTypes.object,
  isSubdomain: PropTypes.bool.isRequired
}

export default UsernameResult;
