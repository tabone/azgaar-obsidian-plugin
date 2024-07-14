import Handlebars from "handlebars";
import { generateEntityLinkedMarkdown } from "src/utils";
import { FMG, isDefaultState, TState } from "azgaar-fmg-parser";

const defaultTemplate = Handlebars.compile(`---
tags: culture
id: {{i}}
name: {{rawName}}
---

|   |   |
|---|---|
| Name       | {{rawName}} |
| Provinces  | {{provinces}} |
| Neighbours | {{neighbours}} |

## Notes

`);

const definedTemplate = Handlebars.compile(`---
tags: state
id: {{i}}
form: {{form}}
alert: {{alert}}
name: {{rawName}}
color: "{{color}}"
capitalID: {{capitalID}}
culture: {{cultureID}}
formName: {{formName}}
fullName: {{fullName}}
expansionism: {{expansionism}}
---

|   |   |
|---|---|
| Name         | {{name}}         |
| Form         | {{form}}         |
| Form Name    | {{formName}}     |
| Full Name    | {{fullName}}     |
| Type         | {{type}}         |
| Capital      | {{capital}}      |
| Culture      | {{culture}}      |
| Neighbours   | {{neighbours}}   |
| Provinces    | {{provinces}}    |
| Alert        | {{alert}}        |
| Expansionism | {{expansionism}} |
| Color        | {{color}}        |

## Notes

`);

type GenerateMarkdownProps = {
  fmg: FMG;
  state: TState;
};

export const generateMarkdown = ({ fmg, state }: GenerateMarkdownProps) => {
  const provinces = state.provinces
    .reduce<string[]>((provinces, provinceID) => {
      const province = fmg.provinces[provinceID];

      if (province) {
        provinces.push(
          generateEntityLinkedMarkdown({
            name: province.name,
            entityType: "PROVINCE",
          }),
        );
      }

      return provinces;
    }, [])
    .join(", ");

  const neighbours = state.provinces
    .reduce<string[]>((states, stateID) => {
      const state = fmg.states[stateID];

      if (state) {
        states.push(
          generateEntityLinkedMarkdown({
            name: state.name,
            entityType: "STATE",
          }),
        );
      }

      return states;
    }, [])
    .join(", ");

  return isDefaultState(state)
    ? defaultTemplate({
        i: state.i,

        rawName: state.name,

        name: generateEntityLinkedMarkdown({
          name: state.name,
          entityType: "STATE",
        }),

        provinces: provinces.length === 0 ? "N/A" : provinces,
        neighbours: neighbours.length === 0 ? "N/A" : neighbours,
      })
    : definedTemplate({
        i: state.i,
        form: state.form,
        type: state.type,
        alert: state.alert,
        color: state.color,
        formName: state.formName,
        fullName: state.fullName,
        expansionism: state.expansionism,

        rawName: state.name,
        capitalID: state.capital,
        cultureID: state.culture,

        provinces: provinces.length === 0 ? "N/A" : provinces,
        neighbours: neighbours.length === 0 ? "N/A" : neighbours,

        name: generateEntityLinkedMarkdown({
          name: state.name,
          entityType: "STATE",
        }),

        capital: generateEntityLinkedMarkdown({
          name: fmg.burgs[state.capital].name,
          entityType: "BURG",
        }),

        culture: generateEntityLinkedMarkdown({
          name: fmg.cultures[state.culture].name,
          entityType: "CULTURE",
        }),
      });
};
