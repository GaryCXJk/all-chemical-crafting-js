import * as Global from '../src/Global'
import Group, { GroupException } from '../src/Group'
import Attribute, { AttributeException } from '../src/Attribute'
import Component, { ComponentException } from '../src/Component'

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

Group.add('earth', 'Earth')
Group.add('water', 'Water')

test('Group => has two entries', () => {
    expect(Group.getAll().length).toBe(2)
})

test('Group => has Earth', () => {
    expect(Group.get('earth')).toBeDefined()
})

test('Group => doesn\'t have Air yet', () => {
    expect(Group.get('air')).toBeNull()
})

test('Group => has three entries after Air, and four after Fire has been added', () => {
    Group.add('air', 'Air')
    expect(Group.getAll().length).toBe(3)
    Group.add('fire', 'Fire')
    expect(Group.getAll().length).toBe(4)
})

test('Group => adding Water again throws an exception', () => {
    expect(() => {
        Group.add('water')
    }).toThrow()
})

test('Group => adding Water again throws a GroupException', () => {
    expect(() => {
        Group.add('water')
    }).toThrow(GroupException)
})

Attribute.add('hot', 'Hot')
Attribute.add('cold', 'Cold')

test('Attribute => has two entries', () => {
    expect(Attribute.getAll().length).toBe(2)
})

test('Attribute => has Cold', () => {
    expect(Attribute.get('cold')).toBeDefined()
})

test('Attribute => doesn\'t have Round', () => {
    expect(Attribute.get('round')).toBeNull()
})

test('Attribute => add four more entries, making it six in total', () => {
    Attribute.add('solid', 'Solid')
    Attribute.add('liquid', 'Liquid')
    Attribute.add('gas', 'Gas')
    Attribute.add('plasma', 'Plasma')
    expect(Attribute.getAll().length).toBe(6)
})

test('Attribute => adding Hot again throws an exception', () => {
    expect(() => {
        Attribute.add('hot')
    }).toThrow()
})

test('Attribute => adding Hot again throws an AttributeException', () => {
    expect(() => {
        Attribute.add('hot')
    }).toThrow(AttributeException)
})

Component.add('water', 'Water', 'water')
Component.add('ice', 'Ice', 'water')
Component.add('steam', 'Steam', 'water')

test('Component => has four entries', () => {
    Component.add('fire', 'Fire', 'fire')
    expect(Component.getAll().length).toBe(4)
})

test('Component => adding component without group causes error', () => {
    expect(() => {
        Component.add('stone', 'Stone')
    }).toThrow()
})

test('Component => adding component after setting a group won\'t cause error', () => {
    expect(() => {
        Component.setDefaultGroup('earth')
        Component.add('stone', 'Stone')
    }).not.toThrow()
})