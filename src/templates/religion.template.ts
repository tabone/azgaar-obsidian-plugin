import { FMG, isDefaultReligion, TCulture, TReligion } from "azgaar-fmg-parser";
import Handlebars from "handlebars";
import { generateNameMD } from "./name.template";

const defaultTemplate = Handlebars.compile(`---
tags: religion
id: {{i}}
name: {{name}}
---
|   |   |
|---|---|
| Name      | {{name}}      |

## Notes

`);

const definedTemplate = Handlebars.compile(`---
tags: religion
id: {{i}}
form: {{form}}
type: {{type}}
Code: {{code}}
name: {{rawName}}
culture: {{cultureID}}
expansion: {{expansion}}
expansionism: {{expansionism}}
---
|   |   |
|---|---|
| Name         | {{name}}         |
| Form         | {{form}}         |
| Type         | {{type}}         |
| Deity        | {{deity}}        |
| Color        | {{color}}        |
| Culture      | {{culture}}      |
| Origins      | {{origins}}      |
| Expansion    | {{expansion}}    |
| Code         | {{code}}         |
| expansionism | {{expansionism}} |

## Notes

`);

type GenerateReligionMDProps = {
  fmg: FMG;
  religion: TReligion;
};

export const generateReligionMD = ({
  fmg,
  religion,
}: GenerateReligionMDProps) => {
  return isDefaultReligion(religion)
    ? defaultTemplate({
        i: religion.i,
        name: religion.name,
      })
    : definedTemplate({
        i: religion.i,
        code: religion.code,
        form: religion.form,
        type: religion.type,
        deity: religion.deity,
        color: religion.color,
        expansion: religion.expansion,
        expansionism: religion.expansionism,

        rawName: religion.name,
        cultureID: religion.culture,

        name: generateNameMD({
          variant: "Religions",
          name: religion.name,
        }),

        origins: religion.origins.map((religionID) => {
          return generateNameMD({
            variant: "Religions",
            name: fmg.religions[religionID].name,
          });
        }),

        culture: generateNameMD({
          variant: "Cultures",
          name: fmg.cultures[religion.culture].name,
        }),
      });
};
