export const captureTypes = [
  "raw_thought",
  "task",
  "link",
  "quote",
  "thing_to_buy",
  "book_note",
  "audiobook_note",
  "movie_note",
  "person_note",
  "health_note",
  "project_note",
  "learning_note"
] as const;

export const domains = [
  "projects",
  "learning",
  "relationships",
  "things_to_remember",
  "health"
] as const;

export type CaptureType = (typeof captureTypes)[number];
export type Domain = (typeof domains)[number];

export type Capture = {
  id: string;
  title: string | null;
  body: string;
  capture_type: CaptureType;
  domain: Domain;
  source: string;
  source_url: string | null;
  tags: string[];
  status: "inbox" | "saved" | "archived";
  resurface_on: string | null;
  created_at: string;
  updated_at: string;
};
