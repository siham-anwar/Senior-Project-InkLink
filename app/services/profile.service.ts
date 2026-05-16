import { api } from "@/lib/api";

export interface FollowerDto {
  _id: string;
  username: string;
  profilePicture?: string;
}

export interface ProfileData {
  _id: string;
  name: string;
  username: string;
  profilePicture?: string;
  bio?: string;
  followers: FollowerDto[];
  followersCount: number;
  following: FollowerDto[];
  followingCount: number;
  likes: number;
  readingList: any[];
  favoriteBook?: any;
  isCreator: boolean;
  interests: string[];
  creatorDashboard?: string;
}

export const ProfileService = {
  getProfile: async (id: string): Promise<ProfileData> => {
    const res = await api.get(`/profile/${id}`);
    return res.data;
  },

  updateProfile: async (updates: Partial<ProfileData>): Promise<ProfileData> => {
    const res = await api.put(`/profile`, updates);
    return res.data;
  },

  followUser: async (id: string): Promise<any> => {
    const res = await api.post(`/profile/follow/${id}`);
    return res.data;
  }
};
