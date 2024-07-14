import Handlebars from "handlebars";
import { FMG, TBurg, TProvince } from "azgaar-fmg-parser";
import { generateEntityLinkedMarkdown } from "src/utils";

const template = Handlebars.compile(`---
tags: burg
id: {{i}}
type: {{type}}
name: {{rawName}}
state: {{stateID}}
culture: {{cultureID}}
province: {{provinceID}}
population: {{population}}
port: {{port}}
plaza: {{plaza}}
walls: {{walls}}
shanty: {{shanty}}
temple: {{temple}}
capital: {{capital}}
citadel: {{citadel}}
---

<div>
  <img style="border:none; box-shadow:none" width="200px" src="https://armoria.herokuapp.com/?coa={{coa}}" />
</div>

|   |   |
|---|---|
| Name       | {{name}}       |
| State      | {{state}}      |
| Province   | {{province}}   |
| Culture    | {{culture}}    |
| Population | {{population}} |
| Type       | {{type}}       |
| Features   | {{features}}   |

## Notes

`);

type GenerateMarkdownProps = {
  fmg: FMG;
  burg: TBurg;
  burgsProvince: Record<TBurg["i"], TProvince["i"] | undefined>;
};

export const generateMarkdown = ({
  fmg,
  burg,
  burgsProvince,
}: GenerateMarkdownProps) => {
  const provinceID = burgsProvince[burg.i];
  const province = !provinceID ? undefined : fmg.provinces[provinceID];

  return template({
    i: burg.i,
    type: burg.type,
    population: burg.population,
    coa: JSON.stringify(burg.coa),

    port: !!burg.port ? "Yes" : "No",
    plaza: !!burg.plaza ? "Yes" : "No",
    walls: !!burg.walls ? "Yes" : "No",
    shanty: !!burg.shanty ? "Yes" : "No",
    temple: !!burg.temple ? "Yes" : "No",
    capital: !!burg.capital ? "Yes" : "No",
    citadel: !!burg.citadel ? "Yes" : "No",

    features: (
      [
        { key: "port", name: "Port" },
        { key: "plaza", name: "Plaza" },
        { key: "walls", name: "Walls" },
        { key: "shanty", name: "Shanty" },
        { key: "temple", name: "Temple" },
        { key: "capital", name: "Capital" },
        { key: "citadel", name: "Citadel" },
      ] as const
    )
      .filter(({ key }) => !!burg[key])
      .map(({ name }) => name)
      .join(", "),

    rawName: burg.name,
    stateID: burg.state,
    cultureID: burg.culture,
    provinceID: provinceID ?? "N/A",

    name: generateEntityLinkedMarkdown({
      name: burg.name,
      entityType: "BURG",
    }),

    province: !province
      ? "N/A"
      : generateEntityLinkedMarkdown({
          entityType: "PROVINCE",
          name: province.name,
        }) + ` (${province.formName})`,

    culture: generateEntityLinkedMarkdown({
      name: fmg.cultures[burg.culture].name,
      entityType: "CULTURE",
    }),

    state: generateEntityLinkedMarkdown({
      name: fmg.states[burg.state].name,
      entityType: "STATE",
    }),
  });
};
