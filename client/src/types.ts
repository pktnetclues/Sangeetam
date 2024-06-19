interface UserType {
  userId: number;
  name: string;
  email: string;
  isApproved: boolean;
  isAdmin: boolean;
  isDeleted: boolean;
  status: boolean;
}
interface AudioType {
  audioId: number;
  album: string;
  singerName: string;
  writerName: string;
  thumbnail: string;
  audioUrl: string;
  isApproved: boolean;
  createdAt: string;
}
interface VideoType {
  videoId: number;
  category: string;
  title: string;
  createdBy: string;
  thumbnail: string;
  videoUrl: string;
  createdAt: string;
}

export type { UserType, AudioType, VideoType };
