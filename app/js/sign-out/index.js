import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'
import Initial from './views/initial'
import { ShellParent } from '@blockstack/ui'

const VIEWS = {
  INITIAL: 0
}

const views = [Initial]

const SignOut = ({ location }) => {
  const view = 0

  const viewProps = [
    {
      show: VIEWS.INITIAL,
      props: {
        backLabel: 'Cancel'
      }
    }
  ]

  const currentViewProps = viewProps.find(v => v.show === view) || {}

  const componentProps = {
    view,
    backView: () => null,
    location,
    ...currentViewProps.props
  }
  return (
    <>
      <ShellParent
        views={views}
        {...componentProps}
        disableBackOnView={views.length - 1}
      />
    </>
  )
}

SignOut.propTypes = {
  location: PropTypes.object,
  router: PropTypes.object
}

export default withRouter(SignOut)
