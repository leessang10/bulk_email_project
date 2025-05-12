import mjml2html from "mjml-browser";
import {
  DEFAULT_COMPONENT_PROPERTIES,
  DEFAULT_LAYOUT_PROPERTIES,
} from "../constants/defaultProperties";
import type { ComponentItem, LayoutItem } from "../types/editor";

export const convertToMJML = (layouts: LayoutItem[]): string => {
  const mjmlContent = layouts
    .map((layout) => {
      const columns = layout.children.map((component) => {
        return generateMJMLComponent(component);
      });

      if (layout.type === "footer") {
        return `
          <mj-section padding="${
            DEFAULT_LAYOUT_PROPERTIES.padding
          }" background-color="${DEFAULT_LAYOUT_PROPERTIES.backgroundColor}">
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
        <mj-section padding="${
          DEFAULT_LAYOUT_PROPERTIES.padding
        }" background-color="${DEFAULT_LAYOUT_PROPERTIES.backgroundColor}">
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

const generateMJMLComponent = (component: ComponentItem): string => {
  const defaultProps = DEFAULT_COMPONENT_PROPERTIES[component.type];

  switch (component.type) {
    case "text":
      return `
        <mj-text
          color="${component.properties.color || defaultProps.properties.color}"
          font-size="${
            component.properties.fontSize || defaultProps.properties.fontSize
          }"
          align="${
            component.properties.textAlign || defaultProps.properties.textAlign
          }"
          font-weight="${
            component.properties.fontWeight ||
            defaultProps.properties.fontWeight
          }"
          padding="${
            component.properties.padding || defaultProps.properties.padding
          }"
        >
          ${component.content}
        </mj-text>
      `;

    case "image":
      return `
        <mj-image
          src="${component.properties.src || defaultProps.properties.src}"
          alt="${component.properties.alt || defaultProps.properties.alt}"
          width="${component.properties.width || defaultProps.properties.width}"
          height="${
            component.properties.height || defaultProps.properties.height
          }"
          border-radius="${
            component.properties.borderRadius ||
            defaultProps.properties.borderRadius
          }"
          padding="${component.properties.padding || "0px"}"
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
          border-radius="${
            component.properties.borderRadius ||
            defaultProps.properties.borderRadius
          }"
          padding="${
            component.properties.padding || defaultProps.properties.padding
          }"
          width="${component.properties.width || defaultProps.properties.width}"
          min-width="${
            component.properties.minWidth || defaultProps.properties.minWidth
          }"
        >
          ${component.content}
        </mj-button>
      `;

    case "link":
      return `
        <mj-text
          padding="${
            component.properties.padding || defaultProps.properties.padding
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
              text-decoration: ${
                component.properties.textDecoration ||
                defaultProps.properties.textDecoration
              };
              font-size: ${
                component.properties.fontSize ||
                defaultProps.properties.fontSize
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
