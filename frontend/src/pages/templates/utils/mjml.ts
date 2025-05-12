import mjml2html from "mjml-browser";
import type { ComponentItem, LayoutItem } from "../types/editor";

export const convertToMJML = (layouts: LayoutItem[]): string => {
  const mjmlContent = layouts
    .map((layout) => {
      const columns = layout.children.map((component) => {
        return generateMJMLComponent(component);
      });

      if (layout.type === "footer") {
        return `
          <mj-section>
            <mj-column>
              ${columns.join("\n")}
            </mj-column>
          </mj-section>
        `;
      }

      const columnWidth = `${100 / layout.children.length}%`;
      return `
        <mj-section>
          ${columns
            .map(
              (column) => `
            <mj-column width="${columnWidth}">
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
          <mj-text font-size="16px" color="#333333" line-height="1.5" />
          <mj-button background-color="#1a73e8" color="#ffffff" />
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
  switch (component.type) {
    case "text":
      return `
        <mj-text
          color="${component.properties.color}"
          font-size="${component.properties.fontSize}"
          align="${component.properties.textAlign}"
        >
          ${component.content}
        </mj-text>
      `;

    case "image":
      return `
        <mj-image
          src="${component.properties.src}"
          alt="${component.properties.alt}"
          width="${component.properties.width}"
          height="${component.properties.height}"
        />
      `;

    case "button":
      return `
        <mj-button
          background-color="${component.properties.backgroundColor}"
          color="${component.properties.color}"
          border-radius="${component.properties.borderRadius}"
          padding="${component.properties.padding}"
        >
          ${component.content}
        </mj-button>
      `;

    case "link":
      return `
        <mj-text>
          <a
            href="${component.properties.href}"
            style="color: ${component.properties.color}; text-decoration: none;"
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
