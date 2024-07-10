import { TBurg } from "azgaar-fmg-parser";
import Handlebars from "handlebars";

const template = Handlebars.compile(`
<div>
  <img style="border:none; box-shadow:none" width="200px" src="https://armoria.herokuapp.com/?coa={{coa}}" />
</div>

|   |   |
|---|---|
| Name       | {{name}} |
| Province   |  |
| State      |  |
| Culture    |  |
| Population |  |
| Features   |  |


  ## Notes
`);

type GenerateBurgMDProps = {
	coa: TBurg["coa"];
	name: TBurg["name"];
};

export const generateBurgMD = ({ coa, name }: GenerateBurgMDProps) => {
	return template({ coa: JSON.stringify(coa), name });
};
