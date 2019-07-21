import { Topic } from "./topic";

export interface Lo {
  properties: { [prop: string]: string };
  version: string;
  type: string;
  shortTitle: string;
  title: string;
  img: string;
  video: string;
  pdf: string;
  summary: string;
  contentMd: string;
  route: string;
  id: string;
  hide: boolean;
  los: Lo[];
  parent: Topic;
}
