import { isWebAppBuild } from '../../app/js/utils/window-utils'
import { expect } from 'chai'

describe('window-utils', () => {

  describe('isWebAppBuild', () => {
    describe('when in test environment', () => {
      it('should report false', () => {
        expect(isWebAppBuild()).to.equal(false)  
      })
    })

    describe('when in production environment', () => {
      let tmp_node_env
      before(() => {
        tmp_node_env = process.env.NODE_ENV
        process.env.NODE_ENV = 'production'
      })

      it('should report false', () => {
        expect(isWebAppBuild()).to.equal(false)  
      })

      describe('when WEBAPP is set', () => {
        before(() => {
          process.env.NODE_ENV = 'production'
          process.env.WEBAPP = true
        })

        it('should report true', () => {
          expect(isWebAppBuild()).to.equal(true)  
        })
      })

      after(() => {
        process.env.NODE_ENV = tmp_node_env
      })
    })
  })
})
