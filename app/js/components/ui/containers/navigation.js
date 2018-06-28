import React from 'react'
import PropTypes from 'prop-types'
import { StyledNavigation } from '@components/ui/components/navigation'

class Navigation extends React.PureComponent {
  render() {
    return (
      <StyledNavigation>
        <StyledNavigation.Wrapper>
          <StyledNavigation.Section>Home</StyledNavigation.Section>
          <StyledNavigation.Section>
            IDS Wallet Settings
          </StyledNavigation.Section>
        </StyledNavigation.Wrapper>
      </StyledNavigation>
    )
  }
}

export { Navigation }
