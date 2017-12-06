import Group from '../src/Group'
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

test('Global => packString and unpackString results in original string', () => {
    expect(Global.unpackString(Global.packString('I\'ve got \u20ac in my pocket\u203d'))).toBe('I\'ve got \u20ac in my pocket\u203d')
})

test('Global => packInteger and unpackInteger results in original integer', () => {
    expect(Global.unpackInteger(Global.packInteger(0x12345678))).toBe(0x12345678)
})

test('Global => packInteger and unpackInteger results in original integer (2)', () => {
    expect(Global.unpackInteger(Global.packInteger(0x12345678, 4, true), true)).toBe(0x12345678)
})

Group.add('water', 'Water')
Group.add('earth', 'Earth')
Group.add('fire', 'Fire')
Group.add('air', 'Air')

test('Group => check if Group contains four entries', () => {
    expect(Group.getAll().length).toBe(4)
})

test('Group => check if Group water exists', () => {
    expect(Group.get('water')).toBeTruthy()
})

test('Group => check if Group water is actually water', () => {
    expect(Group.get('water').realName).toBe('Water')
})