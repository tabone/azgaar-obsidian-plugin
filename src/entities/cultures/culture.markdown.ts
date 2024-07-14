import Handlebars from "handlebars";
import { generateEntityLinkedMarkdown } from "src/utils";
import { FMG, isDefaultCulture, TCulture } from "azgaar-fmg-parser";

const defaultTemplate = Handlebars.compile(`---
tags: culture
id: {{i}}
name: {{rawName}}
shield: {{shield}}
---

|   |   |
|---|---|
| Name    | {{name}}    |
| Shield  | {{shield}}  |

## Notes

`);

const definedTemplate = Handlebars.compile(`---
tags: culture
id: {{i}}
type: {{type}}
code: {{code}}
name: {{rawName}}
color: "{{color}}"
shield: {{shield}}
expansionism: {{expansionism}}
---

|   |   |
|---|---|
| Name         | {{name}}         |
| Type         | {{type}}         |
| Shield       | {{shield}}       |
| Color        | {{color}}        |
| Origins      | {{origins}}      |
| Code         | {{code}}         |
| Expansionism | {{expansionism}} |

## Notes

`);

type GenerateMarkdownProps = {
  fmg: FMG;
  culture: TCulture;
};

export const generateMarkdown = ({ fmg, culture }: GenerateMarkdownProps) =>
  isDefaultCulture(culture)
    ? defaultTemplate({
        i: culture.i,
        shield: culture.shield,

        rawName: culture.name,

        name: generateEntityLinkedMarkdown({
          name: culture.name,
          entityType: "CULTURE",
        }),
      })
    : definedTemplate({
        i: culture.i,
        type: culture.type,
        code: culture.code,
        color: culture.color,
        shield: culture.shield,
        expansionism: culture.expansionism,

        rawName: culture.name,

        name: generateEntityLinkedMarkdown({
          name: culture.name,
          entityType: "CULTURE",
        }),

        origins: culture.origins
          .map((cultureID) =>
            generateEntityLinkedMarkdown({
              entityType: "CULTURE",
              name: fmg.cultures[cultureID].name,
            }),
          )
          .join(", "),
      });
