'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Edit2, Users, X } from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [profileImage, setProfileImage] = useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop')
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showFollowingList, setShowFollowingList] = useState(false)
  const [userData, setUserData] = useState({
    name: 'Alex Reader',
    username: 'alexreader',
    bio: 'Book lover and aspiring author. Always reading, always learning.',
    following: 342,
  })
  const [editData, setEditData] = useState(userData)

  const mockFollowing = [
    {
      id: 1,
      name: 'Sarah Chen',
      username: 'sarahchen',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop',
      isFollowing: true,
    },
    {
      id: 2,
      name: 'James Miller',
      username: 'jamesmiller',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop',
      isFollowing: true,
    },
    {
      id: 3,
      name: 'Emma Davis',
      username: 'emmadavis',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop',
      isFollowing: true,
    },
    {
      id: 4,
      name: 'Lucas Taylor',
      username: 'lucastaylor',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop',
      isFollowing: true,
    },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    setUserData(editData)
    setIsEditingProfile(false)
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/home" className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Back to home">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <img
              src={profileImage}
              alt={userData.name}
              className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
            />
            <label htmlFor="profile-upload" className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors cursor-pointer">
              <Camera size={20} />
            </label>
            <input
              id="profile-upload"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
          </div>

          {/* Profile Info */}
          {!isEditingProfile ? (
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-1">{userData.name}</h2>
              <p className="text-muted-foreground mb-4">@{userData.username}</p>
              <p className="text-foreground mb-6 max-w-md">{userData.bio}</p>
              <div className="flex items-center justify-center gap-6 mb-6">
                <button
                  onClick={() => setShowFollowingList(true)}
                  className="flex flex-col items-center hover:opacity-80 transition-opacity cursor-pointer"
                >
                  <span className="text-2xl font-bold">{userData.following}</span>
                  <span className="text-xs text-muted-foreground">Following</span>
                </button>
              </div>
              <button
                onClick={() => {
                  setEditData(userData)
                  setIsEditingProfile(true)
                }}
                className="inline-flex items-center gap-2 px-6 py-2 border border-border rounded-lg hover:bg-secondary transition-colors mb-4 font-medium"
              >
                <Edit2 size={18} />
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="w-full max-w-md space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <input
                  type="text"
                  value={editData.username}
                  onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                <textarea
                  value={editData.bio}
                  onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none text-foreground"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {/* Author Dashboard Button */}
          <Link
            href="/dashboard"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Author Dashboard
          </Link>
        </div>

        {/* Following List Section */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-2 mb-6">
            <Users size={24} />
            <h3 className="text-2xl font-bold">Following ({userData.following})</h3>
          </div>
          <div className="space-y-3">
            {mockFollowing.map((author) => (
              <Link
                key={author.id}
                href={`/author/${author.username}`}
                className="flex items-center justify-between p-4 bg-secondary/30 border border-border rounded-lg hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={author.image}
                    alt={author.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold">{author.name}</h4>
                    <p className="text-sm text-muted-foreground">@{author.username}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-primary">Following</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Following List Modal */}
      {showFollowingList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Following</h3>
              <button
                onClick={() => setShowFollowingList(false)}
                className="p-1 hover:bg-secondary rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {mockFollowing.map((author) => (
                <Link
                  key={author.id}
                  href={`/author/${author.username}`}
                  onClick={() => setShowFollowingList(false)}
                  className="flex items-center justify-between p-3 hover:bg-secondary rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={author.image}
                      alt={author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-sm">{author.name}</p>
                      <p className="text-xs text-muted-foreground">@{author.username}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
