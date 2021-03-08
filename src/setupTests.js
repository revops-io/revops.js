import { mount, render, shallow, configure } from "enzyme"
import chai, { expect } from "chai"
import "raf/polyfill"
import Adapter from "enzyme-adapter-react-16"
import sinon from "sinon"
import sinonChai from "sinon-chai"
chai.use(sinonChai)

configure({ adapter: new Adapter() })

// Fail tests on any warning
console.error = message => {
  throw new Error(message)
}

global.expect = expect
global.sinon = sinon
global.mount = mount
global.render = render
global.shallow = shallow
