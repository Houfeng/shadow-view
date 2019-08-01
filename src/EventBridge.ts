import { BRIDGE_EVENT_NAMES } from "./EventNames";

export function bridge(fromNode: Node, toNode: Node) {
  if (!fromNode || !toNode || fromNode === toNode) return;
  const define = Object.defineProperty;
  BRIDGE_EVENT_NAMES.forEach(eventName => {
    fromNode.addEventListener(eventName, (fromEvent: any) => {
      fromEvent.stopPropagation();
      const Event = fromEvent.constructor;
      const toEvent = new Event(eventName, fromEvent);
      define(toEvent, "path", { get: () => fromEvent.path });
      define(toEvent, "target", { get: () => fromEvent.path[0] });
      define(toEvent, "srcElement", { get: () => fromEvent.path[0] });
      define(toEvent, "toElement", { get: () => fromEvent.path[0] });
      toNode.dispatchEvent(toEvent);
    });
  });
}

export function bridgeShadowRoot(shadowRoot: ShadowRoot) {
  bridge(shadowRoot, shadowRoot.host);
}

export function bridgeShadowHost(shadowHost: Element) {
  bridge(shadowHost.shadowRoot, shadowHost);
}
