import { mergeAttributes } from "@tiptap/core";
import Image from "@tiptap/extension-image";
import type { Node } from "@tiptap/pm/model";

function applyImgSizing(dom: HTMLElement, node: Node) {
  const img = dom.querySelector("img");
  if (!img) return;
  const w = node.attrs.width;
  const h = node.attrs.height;
  if (w != null && w !== "") {
    img.style.width = typeof w === "number" ? `${w}px` : String(w);
  } else {
    img.style.removeProperty("width");
  }
  if (h != null && h !== "") {
    img.style.height = typeof h === "number" ? `${h}px` : String(h);
  } else {
    img.style.removeProperty("height");
  }
}

export const BlogImage = Image.extend({
  name: "image",

  addOptions() {
    const parent = this.parent!();
    return {
      ...parent,
      HTMLAttributes: { class: "rounded-lg" },
      resize: {
        enabled: true,
        minWidth: 100,
        minHeight: 72,
        alwaysPreserveAspectRatio: true,
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      uploadMarker: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-upload-marker"),
        renderHTML: (attributes) =>
          attributes.uploadMarker ? { "data-upload-marker": attributes.uploadMarker } : {},
      },
      dataUploading: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-uploading"),
        renderHTML: (attributes) =>
          attributes.dataUploading ? { "data-uploading": attributes.dataUploading } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: this.options.allowBase64 ? "img[src]" : 'img[src]:not([src^="data:"])',
        getAttrs: (element) => {
          if (!(element instanceof HTMLElement)) return false;
          const el = element as HTMLImageElement;
          const src = el.getAttribute("src");
          if (!src) return false;

          const parseAttrPx = (v: string | null) => {
            if (!v) return null;
            const n = parseInt(v, 10);
            return Number.isFinite(n) ? n : null;
          };

          let width = parseAttrPx(el.getAttribute("width"));
          let height = parseAttrPx(el.getAttribute("height"));

          const sw = el.style?.width;
          const sh = el.style?.height;
          if (width == null && sw) {
            const m = /^([\d.]+)px$/.exec(sw.trim());
            if (m) width = Math.round(parseFloat(m[1]));
          }
          if (height == null && sh) {
            const m = /^([\d.]+)px$/.exec(sh.trim());
            if (m) height = Math.round(parseFloat(m[1]));
          }

          return {
            src,
            alt: el.getAttribute("alt"),
            title: el.getAttribute("title"),
            width,
            height,
          };
        },
      },
    ];
  },

  renderHTML({ node }) {
    const { src, alt, title, width: w, height: h } = node.attrs;
    const styleParts: string[] = ["max-width: 100%"];

    if (w != null && w !== "") {
      styleParts.push(`width: ${typeof w === "number" ? `${w}px` : String(w)}`);
    } else {
      styleParts.push("width: auto");
    }

    if (h != null && h !== "") {
      styleParts.push(`height: ${typeof h === "number" ? `${h}px` : String(h)}`);
    } else {
      styleParts.push("height: auto");
    }

    return [
      "img",
      mergeAttributes(this.options.HTMLAttributes, {
        src: src ?? undefined,
        alt: alt ?? undefined,
        title: title ?? undefined,
        width: w != null && w !== "" ? String(w) : undefined,
        height: h != null && h !== "" ? String(h) : undefined,
        style: styleParts.join("; "),
        loading: "lazy",
        decoding: "async",
      }),
    ];
  },

  addNodeView() {
    const parentFactory = this.parent?.();
    if (!parentFactory) return null;

    return (props) => {
      const nodeView = parentFactory(props);
      const originalUpdate = nodeView.update?.bind(nodeView);
      if (originalUpdate) {
        nodeView.update = (node, decorations, innerDecorations) => {
          const ok = originalUpdate(node, decorations, innerDecorations);
          if (ok) {
            applyImgSizing(nodeView.dom as HTMLElement, node);
          }
          return ok;
        };
      }
      queueMicrotask(() => {
        applyImgSizing(nodeView.dom as HTMLElement, props.node);
      });
      return nodeView;
    };
  },
});
