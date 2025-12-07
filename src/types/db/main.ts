// otp_codes
export interface Otp_codesType {
  gmail: string;
  otp_code: string;
  time: string;
  id: number;
  temporaryKey: string;
}

// story

interface ads {
  adId: number;
  title: string;
  brand: string;
  link: string;
}

export const STORY_FIELDS = {
  id: "id",
  sender_id: "sender_id",
  category: "category",
  likes_length: "likes_length",
  comments_length: "comments_length",
  ads: "ads",
  description: "description",
  views: "views",
  video_address: "video_address",
  image_address: "image_address",
  profile_image_address: "profile_image_address",
  show_story: "show_story",
  send_date: "send_date",
} as const;

export type StoriesType = {
  [K in keyof typeof STORY_FIELDS]: K extends "send_date"
    ? Date | undefined
    : K extends "show_story"
    ? boolean | undefined
    : K extends "ads"
    ? ads[] | undefined
    : number | string;
};
