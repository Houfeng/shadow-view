import { bridgeShadowRoot } from "./EventBridge";

export const supportShadow = "attachShadow" in document.createElement("div");

export function attachShadow(host: Element, optinos: ShadowRootInit) {
  if (!host || !supportShadow) return (host as any) as ShadowRoot;
  const shadowRoot = host.attachShadow(optinos);
  bridgeShadowRoot(shadowRoot);
  return shadowRoot;
}
