import Handlebars from "handlebars";
import { FMG, TProvince } from "azgaar-fmg-parser";
import { generateEntityLinkedMarkdown } from "src/utils";

const template = Handlebars.compile(`---
tags: province
id: {{i}}
burg: {{burgID}}
name: {{rawName}}
state: {{stateID}}
color: "{{color}}"
formName: {{formName}}
fullName: {{fullName}}
---
<div>
  <img style="border:none; box-shadow:none" width="200px" src="https://armoria.herokuapp.com/?coa={{coa}}" />
</div>

|   |   |
|---|---|
| Name      | {{name}}     |
| City      | {{burg}}     |
| Form Name | {{formName}} |
| Full Name | {{fullName}} |
| State     | {{state}}    |
| Color     | {{color}}    |

## Burgs

{{burgs}}

## Notes

`);

type GenerateMarkdownProps = {
  fmg: FMG;
  province: TProvince;
};

export const generateMarkdown = ({ fmg, province }: GenerateMarkdownProps) =>
  template({
    i: province.i,
    color: province.color,
    formName: province.formName,
    fullName: province.fullName,
    coa: JSON.stringify(province.coa),

    burg:
      !province.burgs || province.burgs.length === 0
        ? "N/A"
        : generateEntityLinkedMarkdown({
            entityType: "BURG",
            name: fmg.burgs[province.burg].name,
          }),

    burgID: province.burg,
    rawName: province.name,
    stateID: province.state,

    burgs:
      !province.burgs || province.burgs.length === 0
        ? "N/A"
        : province.burgs
            .map(
              (burgID) =>
                `- ${generateEntityLinkedMarkdown({ entityType: "BURG", name: fmg.burgs[burgID].name })}`,
            )
            .join("\n"),

    name: generateEntityLinkedMarkdown({
      entityType: "PROVINCE",
      name: province.name,
    }),
    state: generateEntityLinkedMarkdown({
      entityType: "STATE",
      name: fmg.states[province.state].name,
    }),
  });
