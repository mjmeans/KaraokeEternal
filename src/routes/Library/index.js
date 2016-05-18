import { injectReducer } from '../../store/reducers'
import { requireAuth } from 'components/requireAuth'

export default (store) => ({
  path: 'library',
  /*  Async getComponent is only invoked when route matches   */
  getComponent (nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure([], (require) => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Library = require('./containers/LibraryContainer').default
      const reducer = require('./modules/library').default

      /*  Add the reducer to the store on key 'counter'  */
      injectReducer(store, { key: 'library', reducer })

      /*  Return getComponent   */
      cb(null, requireAuth(Library))

    /* Webpack named bundle   */
  }, 'library')
  }
})
