type GenerateNameMDProps = {
  name: string;
  variant: "Cultures" | "Religions" | "Provinces" | "States" | "Burgs";
};

export const generateNameMD = ({ name, variant }: GenerateNameMDProps) => {
  return `[[${variant}/${name}\\|${name}]]`;
};
