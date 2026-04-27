'use client';

import { useState, useMemo } from 'react';
import { Search, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
  bio: string;
  joinDate: string;
  profileImage: string;
}

const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Sarah Anderson',
    email: 'sarah.anderson@email.com',
    bio: 'Fiction writer and novelist. Passionate about storytelling.',
    joinDate: 'Jan 15, 2023',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
  },
  {
    id: '2',
    name: 'James Mitchell',
    email: 'james.mitchell@email.com',
    bio: 'Tech blogger and writer. Love sharing knowledge.',
    joinDate: 'Feb 22, 2023',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    id: '3',
    name: 'Emily Chen',
    email: 'emily.chen@email.com',
    bio: 'Poetry enthusiast and creative writing mentor.',
    joinDate: 'Mar 10, 2023',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
  {
    id: '4',
    name: 'Michael Rodriguez',
    email: 'michael.r@email.com',
    bio: 'Journalist covering tech and culture.',
    joinDate: 'Apr 05, 2023',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
  {
    id: '5',
    name: 'Lisa Thompson',
    email: 'lisa.thompson@email.com',
    bio: 'Self-help author and wellness writer.',
    joinDate: 'May 18, 2023',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
  },
  {
    id: '6',
    name: 'David Brown',
    email: 'david.brown@email.com',
    bio: 'Fiction writer exploring sci-fi and fantasy genres.',
    joinDate: 'Jun 12, 2023',
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
  },
  {
    id: '7',
    name: 'Sophia Martinez',
    email: 'sophia.m@email.com',
    bio: 'Travel writer and adventure enthusiast.',
    joinDate: 'Jul 20, 2023',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
  },
  {
    id: '8',
    name: 'Alex Johnson',
    email: 'alex.johnson@email.com',
    bio: 'Business writer and entrepreneur coach.',
    joinDate: 'Aug 08, 2023',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
  },
];

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-4">
            <Link
              href="/admin"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-foreground">Users Management</h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Manage all users on the InkLink platform
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, or bio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Showing {filteredUsers.length} of {users.length} users
          </p>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="rounded-xl border border-border bg-card p-6 hover:border-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left side - User info */}
                  <div className="flex gap-4 flex-1">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="h-16 w-16 rounded-lg object-cover border border-border"
                      />
                    </div>

                    {/* User Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {user.name}
                      </h3>
                      <p className="text-sm text-accent font-medium mb-2">{user.email}</p>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {user.bio}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Joined {user.joinDate}
                      </p>
                    </div>
                  </div>

                  {/* Right side - Delete button */}
                  <button
                    onClick={() => handleDeleteUser(user.id)}
                    className="flex-shrink-0 p-2.5 rounded-lg bg-card hover:bg-destructive/10 hover:text-accent transition-colors border border-border hover:border-accent"
                    title="Delete user"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No users found matching your search.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
