export interface Video {
  id: string;
  local_name: string | null; // filename stored locally
  url: string; // youtube link
  title: string; // video display title
}
