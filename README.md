# Best practices

```js
var recoverSecret = function(triplets) {
  var nodes = []
  var graph = {}
  var sortedlist = []

  function visit(node) {
    if (sortedlist.indexOf(node) < 0) {
      (graph[node] || []).forEach(function (node2) { visit(node2) })
      sortedlist.unshift(node)
    }
  }

  triplets.forEach(function (triplet) {
    triplet.forEach(function (node) {
      if (nodes.indexOf(node) < 0) nodes.push(node);
    })
    graph[triplet[0]] = (graph[triplet[0]] || []).concat(triplet[1])
    graph[triplet[1]] = (graph[triplet[1]] || []).concat(triplet[2])
  })

  while (nodes.length) visit(nodes.pop());
  return sortedlist.join('');
}
```

先把 triplets 转换成 graph ，用来表达每个字符的所有后续字符，然后用 visit 方法来递归遍历所有字符，然后从最后一个字符开始倒序加入 nodes 数组，最终还原完整的字符串。


# Clever

```js
var recoverSecret = function(triplets) {
  for(var [first] of triplets) {
    if (triplets.every(tuple => tuple.indexOf(first) <= 0)) {
      triplets.filter(([item]) => item == first).forEach(tuple => tuple.shift());
      return first + recoverSecret(triplets.filter(tuple => tuple.length > 0));
    }
  }
  return '';
}
```

思路是找到最终字符串中的第一个字符，然后把这个字符从 triplets 列表中去掉，递归整个过程就可以还原完整的字符串。

这两种思路都是是一致的，即 “找到第一个或者最后一个字符，递归这个过程，拼接出完整字符串”。实现方面就各有千秋，有的是直接改 triplets ，有的是建立一个中间数据类型方便处理。


看其他答案学到两招为数组去重的方法：

```js
Array.from(new Set(arr))
arr.filter((n, i) = arr.indexOf(n) === i)
```
