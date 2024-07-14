import { ENTITY_DIRECTORIES } from "src/consts";
import { ENTITY_TYPE } from "src/types";
import { generateLinkedMarkdown } from "../generate-linked-markdown";

type GenerateEntityLinkedMarkdownProps = {
  name: string;
  alias?: string;
  entityType: ENTITY_TYPE;
};

export const generateEntityLinkedMarkdown = ({
  name,
  entityType,
  alias = name,
}: GenerateEntityLinkedMarkdownProps) => {
  return generateLinkedMarkdown({
    name,
    alias,
    directory: `${ENTITY_DIRECTORIES[entityType]}`,
  });
};
