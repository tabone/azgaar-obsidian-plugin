type GenerateLinkedMarkdownProps = {
  name: string;
  alias?: string;
  directory: string;
};

export const generateLinkedMarkdown = ({
  name,
  directory,
  alias = name,
}: GenerateLinkedMarkdownProps) => {
  return `[[${directory}/${name}\\|${alias}]]`;
};
