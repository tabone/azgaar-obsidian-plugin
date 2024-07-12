import { FMG, isDefaultCulture, TCulture } from "azgaar-fmg-parser";
import Handlebars from "handlebars";
import { generateNameMD } from "./name.template";

const defaultTemplate = Handlebars.compile(`---
tags: culture
id: {{i}}
name: {{name}}
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
name: {{rawName}}
type: {{type}}
code: {{code}}
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

type GenerateCultureMDProps = {
  fmg: FMG;
  culture: TCulture;
};

export const generateCultureMD = ({ fmg, culture }: GenerateCultureMDProps) => {
  return isDefaultCulture(culture)
    ? defaultTemplate({
        i: culture.i,
        name: culture.name,
        shield: culture.shield,
      })
    : definedTemplate({
        i: culture.i,
        type: culture.type,
        code: culture.code,
        color: culture.color,
        shield: culture.shield,
        expansionism: culture.expansionism,

        rawName: culture.name,

        name: generateNameMD({
          variant: "Cultures",
          name: culture.name,
        }),

        origins: culture.origins
          .map((cultureID) =>
            generateNameMD({
              variant: "Cultures",
              name: fmg.cultures[cultureID].name,
            }),
          )
          .join(", "),
      });
};
