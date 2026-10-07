// Placeholder comments shipped with earlier builds and saved into visitors' browsers.
const PLACEHOLDER_COMMENT_AUTHORS = ["Kazi Farhan (Founder VP)", "Zafar Chowdury (Life Member)"];

export interface NewsComment {
  author: string;
  text: string;
  date: string;
}

export function withoutPlaceholderComments(comments: NewsComment[] | undefined): NewsComment[] {
  return (comments || []).filter((c) => c && !PLACEHOLDER_COMMENT_AUTHORS.includes(c.author));
}
