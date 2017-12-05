import * as Global from '../src/Global'

test('Global => packInteger set 0 character', () => {
    expect(Global.packInteger(0, 1)).toBe(String.fromCharCode(0))
})

test('Global => packInteger reverse hex code 0x656667 to 0x676665', () => {
    expect(Global.packInteger(0x656667, 3)).toBe('gfe')
})

test('Global => packInteger keep hex code 0x656667', () => {
    expect(Global.packInteger(0x656667, 3, true)).toBe('efg')
})