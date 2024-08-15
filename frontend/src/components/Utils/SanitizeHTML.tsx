import sanitizeHtml, { IOptions } from "sanitize-html";

const defaultOptions = {
  allowedTags: ["b", "i", "em", "strong", "a", "span", "br"],
  allowedAttributes: {
    a: ["href"],
    span: ["style"],
  },
};

type Props = {
  html: string;
  options?: IOptions;
};

export const sanitize = ({ html, options }: Props) => {
  return sanitizeHtml(html, {
    ...defaultOptions,
    ...options,
  });
};

const SanitizeHTML: React.FC<Props> = ({ html, options }) => {
  const sanitizedHtml = sanitize({ html, options });

  return <p dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SanitizeHTML;
