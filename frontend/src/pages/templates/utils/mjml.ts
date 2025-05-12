import mjml2html from "mjml-browser";
import {
  DEFAULT_COMPONENT_PROPERTIES,
  DEFAULT_LAYOUT_PROPERTIES,
} from "../constants/defaultProperties";
import type { ComponentItem, LayoutItem } from "../types/editor";

const MJML_BODY_WIDTH = 600; // MJML 기본 body width

const convertPercentageToPx = (
  percentageStr: string,
  columnCount: number = 1
): string => {
  if (!percentageStr.includes("%")) return percentageStr;
  const percentage = parseInt(percentageStr);
  const columnWidth = MJML_BODY_WIDTH / columnCount;
  return `${Math.round((columnWidth * percentage) / 100)}px`;
};

export const convertToMJML = (layouts: LayoutItem[]): string => {
  const mjmlContent = layouts
    .map((layout) => {
      const columns = layout.children.map((component) => {
        return generateMJMLComponent(component, layout.children.length);
      });

      if (layout.type === "footer") {
        return `
          <mj-section 
            padding-left="${DEFAULT_LAYOUT_PROPERTIES.paddingX}"
            padding-right="${DEFAULT_LAYOUT_PROPERTIES.paddingX}"
            padding-top="${DEFAULT_LAYOUT_PROPERTIES.paddingY}"
            padding-bottom="${DEFAULT_LAYOUT_PROPERTIES.paddingY}"
            background-color="${DEFAULT_LAYOUT_PROPERTIES.backgroundColor}"
          >
            <mj-column vertical-align="${
              DEFAULT_LAYOUT_PROPERTIES.verticalAlign
            }">
              ${columns.join("\n")}
            </mj-column>
          </mj-section>
        `;
      }

      const columnWidth = `${100 / layout.children.length}%`;
      return `
        <mj-section 
          padding-left="${DEFAULT_LAYOUT_PROPERTIES.paddingX}"
          padding-right="${DEFAULT_LAYOUT_PROPERTIES.paddingX}"
          padding-top="${DEFAULT_LAYOUT_PROPERTIES.paddingY}"
          padding-bottom="${DEFAULT_LAYOUT_PROPERTIES.paddingY}"
          background-color="${DEFAULT_LAYOUT_PROPERTIES.backgroundColor}"
        >
          ${columns
            .map(
              (column) => `
            <mj-column width="${columnWidth}" vertical-align="${DEFAULT_LAYOUT_PROPERTIES.verticalAlign}">
              ${column}
            </mj-column>
          `
            )
            .join("\n")}
        </mj-section>
      `;
    })
    .join("\n");

  const fullMJML = `
    <mjml>
      <mj-head>
        <mj-attributes>
          <mj-all font-family="Arial, sans-serif" />
          <mj-text font-size="16px" color="#333333" line-height="1.5" align="center" />
          <mj-button background-color="#1a73e8" color="#ffffff" align="center" />
          <mj-image align="center" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        ${mjmlContent}
      </mj-body>
    </mjml>
  `;

  return fullMJML;
};

const generateMJMLComponent = (
  component: ComponentItem,
  columnCount: number = 1
): string => {
  const defaultProps = DEFAULT_COMPONENT_PROPERTIES[component.type];

  switch (component.type) {
    case "text":
      return `
        <mj-text
          color="${component.properties.color || defaultProps.properties.color}"
          font-size="${
            component.properties.fontSize || defaultProps.properties.fontSize
          }"
          font-family="${
            component.properties.fontFamily ||
            defaultProps.properties.fontFamily
          }"
          font-weight="${
            component.properties.fontWeight ||
            defaultProps.properties.fontWeight
          }"
          font-style="${
            component.properties.fontStyle || defaultProps.properties.fontStyle
          }"
          text-decoration="${
            component.properties.textDecoration ||
            defaultProps.properties.textDecoration
          }"
          align="${
            component.properties.textAlign || defaultProps.properties.textAlign
          }"
          padding-left="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-right="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-top="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          padding-bottom="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          border-radius="${
            component.properties.borderRadius ||
            defaultProps.properties.borderRadius
          }"
        >
          ${component.content}
        </mj-text>
      `;

    case "image":
      const width = component.properties.width || defaultProps.properties.width;
      return `
        <mj-image
          src="${component.properties.src || defaultProps.properties.src}"
          alt="${component.properties.alt || defaultProps.properties.alt}"
          width="${convertPercentageToPx(width, columnCount)}"
          align="center"
          padding-left="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-right="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-top="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          padding-bottom="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          border-radius="${
            component.properties.borderRadius ||
            defaultProps.properties.borderRadius
          }"
        />
      `;

    case "button":
      return `
        <mj-button
          background-color="${
            component.properties.backgroundColor ||
            defaultProps.properties.backgroundColor
          }"
          color="${component.properties.color || defaultProps.properties.color}"
          font-family="${
            component.properties.fontFamily ||
            defaultProps.properties.fontFamily
          }"
          font-size="${
            component.properties.fontSize || defaultProps.properties.fontSize
          }"
          font-weight="${
            component.properties.fontWeight ||
            defaultProps.properties.fontWeight
          }"
          font-style="${
            component.properties.fontStyle || defaultProps.properties.fontStyle
          }"
          text-decoration="${
            component.properties.textDecoration ||
            defaultProps.properties.textDecoration
          }"
          align="${
            component.properties.textAlign || defaultProps.properties.textAlign
          }"
          padding-left="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-right="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-top="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          padding-bottom="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          border-radius="${
            component.properties.borderRadius ||
            defaultProps.properties.borderRadius
          }"
          href="${component.properties.href || defaultProps.properties.href}"
        >
          ${component.content}
        </mj-button>
      `;

    case "link":
      return `
        <mj-text
          padding-left="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-right="${
            component.properties.paddingX || defaultProps.properties.paddingX
          }"
          padding-top="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          padding-bottom="${
            component.properties.paddingY || defaultProps.properties.paddingY
          }"
          align="${
            component.properties.textAlign || defaultProps.properties.textAlign
          }"
        >
          <a
            href="${component.properties.href || defaultProps.properties.href}"
            style="
              color: ${
                component.properties.color || defaultProps.properties.color
              };
              font-family: ${
                component.properties.fontFamily ||
                defaultProps.properties.fontFamily
              };
              font-size: ${
                component.properties.fontSize ||
                defaultProps.properties.fontSize
              };
              font-weight: ${
                component.properties.fontWeight ||
                defaultProps.properties.fontWeight
              };
              font-style: ${
                component.properties.fontStyle ||
                defaultProps.properties.fontStyle
              };
              text-decoration: ${
                component.properties.textDecoration ||
                defaultProps.properties.textDecoration
              };
              border-radius: ${
                component.properties.borderRadius ||
                defaultProps.properties.borderRadius
              };
            "
          >
            ${component.content}
          </a>
        </mj-text>
      `;

    default:
      return "";
  }
};

export const convertMJMLToHTML = (mjmlContent: string): string => {
  const { html } = mjml2html(mjmlContent);
  return html;
};
