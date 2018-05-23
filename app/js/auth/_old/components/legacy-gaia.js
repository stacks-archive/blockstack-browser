import React from 'react'

const LegacyGaia = ({ closeModal, appManifest, ...rest }) => {
  const appIcon = appManifest.icons.length
    ? appManifest.icons[0].src
    : '/images/app-icon-hello-blockstack.png'
  return (
    <div>
      <Modal
        isOpen
        onRequestClose={closeModal}
        contentLabel="This is My Modal"
        shouldCloseOnOverlayClick
        style={{ overlay: { zIndex: 10 } }}
        className="container-fluid"
        portalClassName="auth-modal"
      >
        <h3>Sign In Request</h3>
        <div>
          {appManifest.hasOwnProperty('icons') ? (
            <p>
              <Image
                src={appIcon}
                style={{ width: '128px', height: '128px' }}
              />
            </p>
          ) : null}
          <p>
            This application uses an older Gaia storage library, which is no
            longer supported. Once the application updates its library, you will
            be able to use it.
          </p>
        </div>
      </Modal>
    </div>
  )
}
