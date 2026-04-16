import { api } from '@/lib/api';

export interface LibraryWork {
  _id: string;
  title: string;
  authorId: {
    _id: string;
    username: string;
  };
  coverImage?: string;
  tags?: string[];
}

export interface CurrentlyReading {
  workId: LibraryWork;
  progress: number;
}

export interface ReadingList {
  _id: string;
  name: string;
  description: string;
  works: LibraryWork[];
}

export interface Library {
  _id: string;
  userId: string;
  currentlyReading: CurrentlyReading[];
  bookmarked: LibraryWork[];
  readLists: ReadingList[];
}

export const libraryService = {
  async getLibrary(): Promise<Library> {
    const res = await api.get('/library');
    return res.data;
  },

  async updateProgress(workId: string, progress: number): Promise<Library> {
    const res = await api.post('/library/currently-reading', { workId, progress });
    return res.data;
  },

  async toggleBookmark(workId: string): Promise<Library> {
    const res = await api.post('/library/bookmarks/toggle', { workId });
    return res.data;
  },

  async createReadList(name: string, description: string): Promise<Library> {
    const res = await api.post('/library/read-lists', { name, description });
    return res.data;
  },

  async deleteReadList(listId: string): Promise<Library> {
    const res = await api.delete(`/library/read-lists/${listId}`);
    return res.data;
  },

  async toggleWorkInReadList(listId: string, workId: string): Promise<Library> {
    const res = await api.post(`/library/read-lists/${listId}/toggle-work`, { workId });
    return res.data;
  }
};

// Updated documentation for clarity
