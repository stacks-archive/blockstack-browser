import React from 'react'
import UsernameResultSubdomain from './UsernameResultSubdomain'
import UsernameResultDomain from './UsernameResultDomain'
import roundTo from 'round-to'
import { PRICE_BUFFER } from './RegistrationSelectView'

type Props = {
  name: string,
  index: number,
  availability?: Object,
  isSubdomain: boolean
}

const UsernameResult = (props: Props) => {
  const {
    name,
    index,
    availability,
    isSubdomain
  } = props

  const {
    available,
    checkingPrice,
    checkingAvailability
  } = availability || {}

  let price = (availability && availability.price) || 0
  price = roundTo.up(price + PRICE_BUFFER, 6)

  const renderChecking = () => (
    <div className="account-check">
      <h4>Checking {name}...</h4>
    </div>
  )

  const resultTaken = (
    <div className="username-search-result">
      <h4>{name}</h4>
      <button
        className="btn btn-primary btn-block"
        disabled
      >
        {name} is already taken
      </button>
    </div>
  )

  const renderResult = () => (isSubdomain ? (
    <UsernameResultSubdomain
      name={name}
      index={index}
    />
  ) : (
    <UsernameResultDomain
      checkingPrice={checkingPrice}
      name={name}
      price={price}
      index={index}
    />
  ))

  const renderAvailability = () => (available ? renderResult() : resultTaken)

  const isLoading = !availability || checkingAvailability
  return isLoading ? renderChecking() : renderAvailability()
}

export default UsernameResult
