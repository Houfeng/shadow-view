export function getRootNode(node: Node) {
  let root: any = node;
  while (root && !root.host && root.parentNode) root = root.parentNode;
  return root;
}

const { removeChild } = Node.prototype;
Node.prototype.removeChild = function(child) {
  try {
    return removeChild.call(this, child);
  } catch (err) {
    return removeChild.call(child.parentNode, child);
  }
};

const { contains } = Node.prototype;
Node.prototype.contains = function(otherNode) {
  if (!otherNode) return false;
  const root = getRootNode(this);
  const otherRoot = getRootNode(otherNode);
  if (!root || !otherRoot) return false;
  return root === otherRoot
    ? contains.call(this, otherNode)
    : contains.call(this, otherRoot.host);
};

const { compareDocumentPosition } = Node.prototype;
Node.prototype.compareDocumentPosition = function(otherNode) {
  if (!otherNode) return false;
  const root = getRootNode(this);
  const otherRoot = getRootNode(otherNode);
  if (!root || !otherRoot) return false;
  return root === otherRoot
    ? compareDocumentPosition.call(this, otherNode)
    : compareDocumentPosition.call(this, otherRoot.host);
};
