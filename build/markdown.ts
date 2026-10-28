import MarkdownIt from "markdown-it";
import type Token from "markdown-it/lib/token.mjs";
import type { Plugin } from "vite";

/**
 * 构建期把 .md 渲染成 rich-text 的节点数组
 *
 * 各小程序平台对 rich-text 传 HTML 字符串的支持不一致，节点数组是都支持的写法；
 * rich-text 不加载外部样式表，样式全部写成行内 style；
 * 小程序里也跑不了 KaTeX，公式块转成可读的纯文本。
 */
export default function markdown(): Plugin {
  const md = createRenderer();

  return {
    name: "pjyk:markdown",
    transform(source, id) {
      if (!id.endsWith(".md")) return null;

      const html = `<div style="${ROOT_STYLE}">${md.render(source)}</div>`;
      return { code: `export default ${JSON.stringify(htmlToNodes(html))};`, map: null };
    },
  };
}

export type RichTextNode =
  | { type: "text"; text: string }
  | { name: string; attrs?: Record<string, string>; children?: RichTextNode[] };

const VOID_TAGS = new Set(["hr", "br", "img"]);

const ENTITIES: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
};

/**
 * 解析 markdown-it 输出的 HTML，只处理它会生成的标签、双引号属性和基本实体
 */
export function htmlToNodes(html: string): RichTextNode[] {
  const root: RichTextNode[] = [];
  const stack: RichTextNode[][] = [root];
  const pattern = /<(\/?)([a-z][a-z0-9]*)((?:\s+[a-z-]+="[^"]*")*)\s*\/?>|([^<]+)/gi;

  for (const [, closing, tag, rawAttrs, text] of html.matchAll(pattern)) {
    const children = stack[stack.length - 1]!;

    if (text !== undefined) {
      // 块级标签之间的换行不是正文内容
      if (/^\s*$/.test(text) && text.includes("\n")) continue;
      children.push({
        type: "text",
        text: text.replace(/&(amp|lt|gt|quot|#39);/g, (e) => ENTITIES[e]!),
      });
      continue;
    }

    if (closing) {
      stack.pop();
      continue;
    }

    const attrs: Record<string, string> = {};
    for (const [, key, value] of rawAttrs!.matchAll(/([a-z-]+)="([^"]*)"/gi)) {
      attrs[key!] = value!;
    }

    const name = tag!.toLowerCase();
    const node = { name, attrs, children: [] as RichTextNode[] };
    children.push(node);
    if (!VOID_TAGS.has(name)) stack.push(node.children);
  }

  return root;
}

const ROOT_STYLE = "font-size:15px;line-height:1.75;color:#364153;word-break:break-word";

const TAG_STYLES: Record<string, string> = {
  h1: "margin:0 0 16px;font-size:22px;line-height:1.4;font-weight:700;color:#101828",
  h2: "margin:28px 0 12px;padding-bottom:6px;border-bottom:1px solid #e5e7eb;font-size:18px;line-height:1.4;font-weight:700;color:#101828",
  h3: "margin:20px 0 8px;font-size:16px;line-height:1.4;font-weight:600;color:#1e2939",
  p: "margin:0 0 12px",
  ul: "margin:0 0 12px;padding-left:20px",
  ol: "margin:0 0 12px;padding-left:20px",
  li: "margin:4px 0",
  blockquote:
    "margin:0 0 12px;padding:12px 12px 0;border-left:3px solid #d1d5dc;background-color:#f9fafb;color:#4a5565",
  hr: "margin:24px 0;border:none;border-top:1px solid #e5e7eb",
  table: "width:100%;margin:0 0 12px;border-collapse:collapse;font-size:12px;line-height:1.5",
  th: "padding:6px 4px;border:1px solid #e5e7eb;background-color:#f9fafb;font-weight:600;text-align:left",
  td: "padding:6px 4px;border:1px solid #e5e7eb",
  strong: "font-weight:600;color:#101828",
  em: "font-style:italic",
  code: "padding:1px 4px;border-radius:4px;background-color:#f3f4f6;font-size:13px",
};

const MATH_STYLE =
  "margin:0 0 12px;padding:12px;border-radius:8px;background-color:#f9fafb;text-align:center;font-size:15px;line-height:1.6;color:#101828";

// rich-text 里的链接点不了，只保留链接文字的配色
const LINK_STYLE = "color:#4f39f6";

function createRenderer() {
  const md = new MarkdownIt();

  md.block.ruler.before("fence", "math_block", (state, startLine, endLine, silent) => {
    const lineText = (line: number) =>
      state.src.slice(state.bMarks[line]! + state.tShift[line]!, state.eMarks[line]).trim();

    if (lineText(startLine) !== "$$") return false;
    if (silent) return true;

    let closeLine = startLine + 1;
    while (closeLine < endLine && lineText(closeLine) !== "$$") closeLine++;

    const token = state.push("math_block", "", 0);
    token.block = true;
    token.content = state.getLines(startLine + 1, closeLine, state.tShift[startLine]!, false);
    token.map = [startLine, closeLine + 1];
    state.line = closeLine + 1;
    return true;
  });

  md.core.ruler.push("inline_style", (state) => {
    const apply = (tokens: Token[]) => {
      for (const token of tokens) {
        const style = TAG_STYLES[token.tag];
        if (style && token.nesting !== -1) {
          // 表格对齐方式由 markdown-it 写在 style 里，放在后面以覆盖默认的左对齐
          const existing = token.attrGet("style");
          token.attrSet("style", existing ? `${style};${existing}` : style);
        }
        if (token.children) apply(token.children);
      }
    };
    apply(state.tokens);
  });

  md.renderer.rules.math_block = (tokens, idx) =>
    `<p style="${MATH_STYLE}">${md.utils.escapeHtml(texToText(tokens[idx]!.content))}</p>\n`;
  md.renderer.rules.link_open = () => `<span style="${LINK_STYLE}">`;
  md.renderer.rules.link_close = () => "</span>";

  return md;
}

const TEX_SYMBOLS: Record<string, string> = {
  times: "×",
  cdot: "·",
  pm: "±",
  mu: "μ",
  sigma: "σ",
  sum: "Σ",
};

const SUBSCRIPTS: Record<string, string> = {
  i: "ᵢ",
  j: "ⱼ",
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
};

/**
 * 把文档里用到的 TeX 子集转成纯文本，例如 \frac{z + 3}{6} \times 100 → (z + 3) / 6 × 100
 *
 * 只覆盖 \frac、\text、上下标和常用符号，遇到不认识的命令原样保留命令名。
 */
export function texToText(tex: string): string {
  let i = 0;

  // 读取一个参数：花括号分组返回组内原文，否则返回单个字符
  const readArg = (): string => {
    while (tex[i] === " ") i++;
    if (tex[i] !== "{") return tex[i++] ?? "";

    const start = i;
    let depth = 0;
    for (; i < tex.length; i++) {
      if (tex[i] === "{") depth++;
      else if (tex[i] === "}" && --depth === 0) break;
    }
    i++;
    return tex.slice(start + 1, i - 1);
  };

  let out = "";
  while (i < tex.length) {
    const ch = tex[i]!;

    if (ch === "\\") {
      const name = /^[a-zA-Z]+/.exec(tex.slice(i + 1))?.[0] ?? tex[i + 1] ?? "";
      i += 1 + name.length;
      if (name === "frac") {
        const numerator = texToText(readArg());
        const denominator = texToText(readArg());
        out += `${wrapOperand(numerator)} / ${wrapOperand(denominator)}`;
      } else if (name === "text") {
        out += readArg();
      } else {
        out += TEX_SYMBOLS[name] ?? name;
      }
    } else if (ch === "_" || ch === "^") {
      i++;
      const arg = texToText(readArg());
      out += ch === "_" ? toSubscript(arg) : `^${arg}`;
    } else if (ch === "{") {
      out += texToText(readArg());
    } else {
      out += ch;
      i++;
    }
  }

  return out.replace(/\s+/g, " ").replace(/ - /g, " − ").trim();
}

// 分子分母在括号外还有运算符时加括号，避免除号的作用范围产生歧义
function wrapOperand(text: string): string {
  let depth = 0;
  for (const ch of text) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    else if (depth === 0 && "+-−×/".includes(ch)) return `(${text})`;
  }
  return text;
}

function toSubscript(text: string): string {
  const chars = [...text];
  return chars.every((ch) => ch in SUBSCRIPTS)
    ? chars.map((ch) => SUBSCRIPTS[ch]).join("")
    : `_${text}`;
}
