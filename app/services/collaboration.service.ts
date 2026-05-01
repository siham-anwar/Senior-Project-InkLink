import { api } from '@/lib/api';

export interface Collaborator {
  _id: string;
  userId: {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
  };
  role: 'owner' | 'editor' | 'viewer';
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface CollaborationInvite {
  _id: string;
  workId: {
    _id: string;
    title: string;
    coverImage?: string;
  };
  invitedBy: {
    _id: string;
    username: string;
  };
  role: string;
  createdAt: string;
}

export const collaborationService = {
  invite: async (workId: string, emailOrUsername: string) => {
    const res = await api.post('/collaboration/invite', { workId, emailOrUsername });
    return res.data;
  },

  listForWork: async (workId: string): Promise<Collaborator[]> => {
    const res = await api.get(`/collaboration/work/${workId}`);
    return res.data;
  },

  getInvites: async (): Promise<CollaborationInvite[]> => {
    const res = await api.get('/collaboration/invites');
    return res.data;
  },

  respondToInvite: async (collabId: string, accept: boolean) => {
    const res = await api.post(`/collaboration/invites/${collabId}/respond`, { accept });
    return res.data;
  },

  getSharedWorks: async (): Promise<any[]> => {
    const res = await api.get('/collaboration/shared-works');
    return res.data;
  },

  remove: async (workId: string, userId: string) => {
    const res = await api.delete(`/collaboration/work/${workId}/collaborator/${userId}`);
    return res.data;
  },
};
