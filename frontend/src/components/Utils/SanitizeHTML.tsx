import sanitizeHtml, { IOptions } from "sanitize-html";

const defaultOptions = {
  allowedTags: ["b", "i", "em", "strong", "a", "span"],
  allowedAttributes: {
    a: ["href"],
    span: ["style"],
  },
};

type Props = {
  html: string;
  options?: IOptions;
};

const SanitizeHTML: React.FC<Props> = ({ html, options }) => {
  const sanitizedHtml = sanitizeHtml(html, {
    ...defaultOptions,
    ...options,
  });

  return <p dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />;
};

export default SanitizeHTML;
