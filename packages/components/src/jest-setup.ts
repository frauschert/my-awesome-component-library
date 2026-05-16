import '@testing-library/jest-dom'
import 'jest-axe/extend-expect'
import { TextEncoder, TextDecoder } from 'util'

// Polyfill TextEncoder/TextDecoder for qrcode library in Jest
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder as typeof global.TextDecoder
