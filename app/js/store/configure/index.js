import prodConfigure from './production'
import devConfigure from './development'

let configure

if (process.env.NODE_ENV === 'production') {
  configure = prodConfigure
} else {
  configure = devConfigure
}

export default configure
