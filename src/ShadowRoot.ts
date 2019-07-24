import { bridgeShadowRoot } from "./EventBridge";
import { IShadowRootOptions } from "./IShadowRootOptions";

export const supportShadow = "attachShadow" in document.createElement("div");

export function attachShadow(host: Element, optinos: IShadowRootOptions) {
  if (!host || !supportShadow) return (host as any) as ShadowRoot;
  const { mode = "open", delegatesFocus = true } = { ...optinos };
  const shadowRoot = host.attachShadow({ mode, delegatesFocus });
  (shadowRoot as any).style = {};
  bridgeShadowRoot(shadowRoot);
  return shadowRoot;
}
