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

export interface HnStory {
  type: "story";
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  score: number;
  time: number;
  title: string;
  url?: string;
  text?: string;
}

export interface HnComment {
  type: "comment";
  by: string;
  id: number;
  kids: number[];
  parent: number;
  text: string;
  time: number;
}

export interface HnJob {
  type: "job";
  by: string;
  id: number;
  score: number;
  text: string;
  time: number;
  title: string;
  url: string;
}

export interface HnPoll {
  type: "poll";
  by: string;
  descendants: number;
  id: number;
  kids: number[];
  parts: number[];
  score: number;
  text: string;
  time: number;
  title: string;
}

export interface HnPollopt {
  type: "pollopt";
  by: string;
  id: number;
  poll: number;
  score: number;
  text: string;
  time: number;
}

export type HnItem = HnStory | HnComment | HnJob | HnPoll | HnPollopt;

export async function getValue(path: string) {
  const snapshot = await ref.child(path).once("value");
  console.log(snapshot.val());
  return snapshot.val();
}

export const dl = {
  user: new DataLoader<string, HnUser>(async (ids) => {
    return Promise.all(ids.map((id) => getValue(`user/${id}`)));
  }),
  item: new DataLoader<string, HnItem>(async (ids) => {
    return Promise.all(ids.map((id) => getValue(`item/${id}`)));
  }),
};
