import { bridgeShadowRoot } from "./EventBridge";
import { IShadowRootOptions } from "./IShadowRootOptions";

(() => {
  const { removeChild } = Node.prototype;
  Node.prototype.removeChild = function(child) {
    try {
      return removeChild.call(this, child);
    } catch (err) {
      return removeChild.call(child.parentNode, child);
    }
  };
})();

export const supportShadow = "attachShadow" in document.createElement("div");

export function attachShadow(host: Element, optinos: IShadowRootOptions) {
  if (!host || !supportShadow) return (host as any) as ShadowRoot;
  const { mode = "open", delegatesFocus = true } = { ...optinos };
  const shadowRoot = host.attachShadow({ mode, delegatesFocus });
  (shadowRoot as any).style = {};
  bridgeShadowRoot(shadowRoot);
  return shadowRoot;
}
