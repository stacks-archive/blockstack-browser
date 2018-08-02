import prodConfigure from './production'
import devConfigure from './development'

let conf

if (process.env.NODE_ENV === 'production') {
  conf = prodConfigure
} else {
  conf = devConfigure
}

const configure = conf
export default configure
