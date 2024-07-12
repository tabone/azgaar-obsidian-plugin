import { FMG, TProvince } from "azgaar-fmg-parser";
import Handlebars from "handlebars";
import { generateNameMD } from "./name.template";

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

type GenerateProvinceMDProps = {
  fmg: FMG;
  province: TProvince;
};

export const generateProvinceMD = ({
  fmg,
  province,
}: GenerateProvinceMDProps) => {
  return template({
    i: province.i,
    color: province.color,
    formName: province.formName,
    fullName: province.fullName,
    coa: JSON.stringify(province.coa),

    burg:
      !province.burgs || province.burgs.length === 0
        ? "N/A"
        : generateNameMD({
            variant: "Burgs",
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
                `- ${generateNameMD({ variant: "Burgs", name: fmg.burgs[burgID].name })}`,
            )
            .join("\n"),

    name: generateNameMD({ variant: "Provinces", name: province.name }),
    state: generateNameMD({
      variant: "States",
      name: fmg.states[province.state].name,
    }),
  });
};
