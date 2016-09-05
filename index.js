function recoverSecret(triplets) {
  const cache = {}

  for (const triplet of triplets) {
    addNodesFromTriplet(triplet, cache)
  }

  const head = getHead(cache)
  removeDupLinks(head)

  return joinNodes(head)
}

function addNodesFromTriplet(triplet, cache) {
  let prevNode
  for (const val of triplet) {
    node = getOrCreateNode(val, cache)
    if (prevNode) linkNodes(prevNode, node)
    prevNode = node
  }
}

function getOrCreateNode(val, cache) {
  let node = cache[val]
  if (node) return node

  cache[val] = node = {
    value: val,
    left: [],
    right: [],
  }
  return node
}

function linkNodes(a, b) {
  if (a.right.includes(b)) return

  a.right.push(b)
  b.left.push(a)
}

function removeDupLinks(node) {
  if (!node.right.length) return

  if (node.right.length > 1) {
    const dup = []
    for (const rn of node.right) {
      if (rn.left.length !== 1 && haveIndirectLink(node, rn)) {
        dup.push(rn)
      }
    }
    for (const n of dup) {
      node.right.splice(node.right.indexOf(n), 1)
      n.left.splice(n.left.indexOf(node), 1)
    }
  }

  for (const rn of node.right) {
    removeDupLinks(rn)
  }
}

function haveIndirectLink(parent, child, indirect = false) {
  if (!parent.right.length) return false
  return parent.right.some(n => {
    return (n === child && indirect) || haveIndirectLink(n, child, true)
  })
}

function getHead(cache) {
  for (const val in cache) {
    const node = cache[val]
    if (!node.left.length) return node
  }
}

function joinNodes(node, str = '') {
  if (!node) return str

  str += node.value
  if (node.right.length > 1) {
    throw new Error(`Node (${node.value}) has more than one child when joining`)
  }
  return joinNodes(node.right[0], str)
}

module.exports = {
  recoverSecret,
  getOrCreateNode,
  linkNodes,
  removeDupLinks,
  haveIndirectLink,
}
