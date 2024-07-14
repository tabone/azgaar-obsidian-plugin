import Handlebars from "handlebars";
import { generateEntityLinkedMarkdown } from "src/utils";
import { FMG, isDefaultReligion, TReligion } from "azgaar-fmg-parser";

const defaultTemplate = Handlebars.compile(`---
tags: religion
id: {{i}}
name: {{name}}
---

|   |   |
|---|---|
| Name | {{name}} |

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

type GenerateMarkdownProps = {
  fmg: FMG;
  religion: TReligion;
};

export const generateMarkdown = ({ fmg, religion }: GenerateMarkdownProps) =>
  isDefaultReligion(religion)
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

        name: generateEntityLinkedMarkdown({
          entityType: "RELIGION",
          name: religion.name,
        }),

        origins: religion.origins.map((religionID) => {
          return generateEntityLinkedMarkdown({
            entityType: "RELIGION",
            name: fmg.religions[religionID].name,
          });
        }),

        culture: generateEntityLinkedMarkdown({
          entityType: "CULTURE",
          name: fmg.cultures[religion.culture].name,
        }),
      });
