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

export interface Library {
  _id: string;
  userId: string;
  currentlyReading: CurrentlyReading[];
  bookmarked: LibraryWork[];
}

export const libraryService = {
  async getLibrary(): Promise<Library> {
    const res = await api.get('/library');
    return res.data;
  },
  
  async getChildLibrary(childId: string): Promise<Library> {
    const res = await api.get(`/library/child/${childId}`);
    return res.data;
  },

  async updateProgress(workId: string, progress: number): Promise<Library> {
    const res = await api.post('/library/currently-reading', { workId, progress });
    return res.data;
  },

  async toggleBookmark(workId: string): Promise<Library> {
    const res = await api.post('/library/bookmarks/toggle', { workId });
    return res.data;
  }
};

// Updated documentation for clarity
