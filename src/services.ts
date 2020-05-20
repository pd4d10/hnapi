import firebase from "firebase";
import DataLoader from "dataloader";

firebase.initializeApp({
  databaseURL: "https://hacker-news.firebaseio.com",
});

const ref = firebase.database().ref("/v0");

export interface HnUser {
  about?: string;
  created: number;
  delay?: number;
  id: string;
  karma: number;
  submitted?: number[];
}

export interface HnCommonItem {
  id: number;
  time: number;
  deleted?: boolean;
  dead?: boolean;
}

export interface HnStory extends HnCommonItem {
  type: "story";
  by: string;
  descendants: number[];
  kids: number[];
  score: number;
  title: string;
  url?: string;
  text?: string;
}

export interface HnComment extends HnCommonItem {
  type: "comment";
  by: string;
  kids: number[];
  parent: number;
  text: string;
}

export interface HnJob extends HnCommonItem {
  type: "job";
  by: string;
  score: number;
  text: string;
  title: string;
  url: string;
}

export interface HnPoll extends HnCommonItem {
  type: "poll";
  by: string;
  descendants: number;
  kids: number[];
  parts: number[];
  score: number;
  text: string;
  title: string;
}

export interface HnPollopt extends HnCommonItem {
  type: "pollopt";
  by: string;
  poll: number;
  score: number;
  text: string;
}

export type HnItem = HnStory | HnComment | HnJob | HnPoll | HnPollopt;

export async function getValue(path: string) {
  const snapshot = await ref.child(path).once("value");
  console.log(path, snapshot.val());
  return snapshot.val();
}

export const createDataLoader = () => ({
  user: new DataLoader<string, HnUser>(
    async (ids) => {
      return Promise.all(ids.map((id) => getValue(`user/${id}`)));
    },
    { cache: false }
  ),
  item: new DataLoader<number, HnItem>(
    async (ids) => {
      return Promise.all(ids.map((id) => getValue(`item/${id}`)));
    },
    { cache: false }
  ),
});

export type MyContext = {
  dl: ReturnType<typeof createDataLoader>;
};
