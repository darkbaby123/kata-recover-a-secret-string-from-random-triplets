const expect = require('expect')
const {
  recoverSecret,
  getOrCreateNode,
  linkNodes,
  removeDupLinks,
  haveIndirectLink,
} = require('./index')

describe('getOrCreateNode', () => {
  it('get node', () => {
    const cache = {
      s: {
        value: 's',
        left: [],
        right: [],
      }
    }
    expect(getOrCreateNode('s', cache)).toBe(cache.s)
  })

  it('create node', () => {
    const cache = {}
    const node = getOrCreateNode('s', cache)
    expect(node).toEqual({
      value: 's',
      left: [],
      right: [],
    })
    expect(cache).toEqual({ s: node })
  })
})

describe('linkNodes', () => {
  it('link two nodes', () => {
    const a = { value: 'a', left: [], right: [] }
    const b = { value: 'b', left: [], right: [] }
    const c = { value: 'c', left: [], right: [] }

    a.right.push(b)
    b.left.push(a)

    linkNodes(a, c)
    expect(a.right).toEqual([b, c])
    expect(c.left).toEqual([a])

    linkNodes(a, b)
    expect(a.right).toEqual([b, c])
    expect(b.left).toEqual([a])
    expect(c.left).toEqual([a])
  })
})

describe('haveIndirectLink', () => {
  it('test', () => {
    const a = { value: 'a', left: [], right: [] }
    const b = { value: 'b', left: [], right: [] }
    const c = { value: 'c', left: [], right: [] }

    a.right.push(b, c)
    b.left.push(a)
    b.right.push(c)
    c.left.push(b, a)

    expect(haveIndirectLink(a, c)).toBe(true)
    expect(haveIndirectLink(a, b)).toBe(false)
  })
})

describe('removeDupLinks', () => {
  it('test', () => {
    const a = { value: 'a', left: [], right: [] }
    const b = { value: 'b', left: [], right: [] }
    const c = { value: 'c', left: [], right: [] }

    a.right.push(b, c)
    b.left.push(a)
    b.right.push(c)
    c.left.push(b, a)

    removeDupLinks(a)
    expect(a.right.length).toBe(1)
    expect(a.right[0]).toBe(b)
    expect(c.left.length).toBe(1)
    expect(c.left[0]).toBe(b)
  })
})

describe('recoverSecret', () => {
  it('recovers "whatisup"', () => {
    const triplets = [
      ['t','u','p'],
      ['w','h','i'],
      ['t','s','u'],
      ['a','t','s'],
      ['h','a','p'],
      ['t','i','s'],
      ['w','h','s'],
    ]
    expect(recoverSecret(triplets)).toEqual('whatisup')
  })

  it('test 3', () => {
    const triplets = [
      ['t','s','f'],
      ['a','s','u'],
      ['m','a','f'],
      ['a','i','n'],
      ['s','u','n'],
      ['m','f','u'],
      ['a','t','h'],
      ['t','h','i'],
      ['h','i','f'],
      ['m','h','f'],
      ['a','u','n'],
      ['m','a','t'],
      ['f','u','n'],
      ['h','s','n'],
      ['a','i','s'],
      ['m','s','n'],
      ['m','s','u'],
    ]
    expect(recoverSecret(triplets)).toEqual('mathisfun')
  })

  it('recovers "congrats"', () => {
    const triplets = [
      ['g','a','s'],
      ['o','g','s'],
      ['c','n','t'],
      ['c','o','n'],
      ['a','t','s'],
      ['g','r','t'],
      ['r','t','s'],
      ['c','r','a'],
      ['g','a','t'],
      ['n','g','s'],
      ['o','a','s'],
    ]
    expect(recoverSecret(triplets)).toEqual('congrats')
  })
})

function printNode(node, ljust = 0) {
  console.log(`${' '.repeat(ljust)}${node.value}`)
  for (const rn of node.right) {
    printNode(rn, ljust + 2)
  }
}
