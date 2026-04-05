'use client'

import { useState, useEffect } from 'react'
import { Mail, MapPin, Calendar, Edit2, BookOpen, Flame, Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface UserProfile {
  id: string
  name: string
  email: string
  bio: string
  avatar?: string
  location?: string
  joinedDate: string
  booksRead: number
  hoursRead: number
  currentStreak: number
  favoriteGenres: string[]
}

interface Book {
  id: string
  title: string
  author: string
  cover?: string
  progress?: number
  status: 'reading' | 'completed' | 'wishlist'
}

interface Review {
  id: string
  bookId: string
  bookTitle: string
  rating: number
  content: string
  createdAt: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [editData, setEditData] = useState<UserProfile | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch profile data - replace with your backend URL
    const fetchData = async () => {
      try {
        // const profileRes = await fetch('/api/users/profile')
        // const booksRes = await fetch('/api/users/books')
        // const reviewsRes = await fetch('/api/users/reviews')
        
        // Mock data - remove when backend is ready
        const mockProfile: UserProfile = {
          id: 'user-1',
          name: 'Sarah Chen',
          email: 'sarah.chen@email.com',
          bio: 'Bookworm | Fantasy & Mystery Lover | Coffee enthusiast',
          avatar: '',
          location: 'San Francisco, CA',
          joinedDate: '2024-01-15',
          booksRead: 24,
          hoursRead: 156,
          currentStreak: 12,
          favoriteGenres: ['Fantasy', 'Mystery', 'Sci-Fi'],
        }

        const mockBooks: Book[] = [
          { id: '1', title: 'The Midnight Library', author: 'Matt Haig', progress: 85, status: 'reading' },
          { id: '2', title: 'Project Hail Mary', author: 'Andy Weir', progress: 45, status: 'reading' },
          { id: '3', title: 'Fourth Wing', author: 'Rebecca Yarros', progress: 100, status: 'completed' },
          { id: '4', title: 'Iron Widow', author: 'Gideon Defoe', status: 'wishlist' },
          { id: '5', title: 'The House in the Cerulean Sea', author: 'TJ Klune', status: 'wishlist' },
        ]

        const mockReviews: Review[] = [
          { id: 'r1', bookId: '3', bookTitle: 'The Silent Patient', rating: 5, content: 'An absolute page-turner! The twist ending was mind-bending.', createdAt: '2024-03-15' },
          { id: 'r2', bookId: '2', bookTitle: 'Educated', rating: 4, content: 'Powerful and thought-provoking memoir. Highly recommend.', createdAt: '2024-02-20' },
        ]

        setProfile(mockProfile)
        setEditData(mockProfile)
        setBooks(mockBooks)
        setReviews(mockReviews)
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSaveProfile = async () => {
    if (!editData) return
    try {
      // const res = await fetch('/api/users/profile', {
      //   method: 'PATCH',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editData),
      // })
      // if (res.ok) {
      //   setProfile(editData)
      //   setIsEditing(false)
      // }
      
      // Mock - remove when backend is ready
      setProfile(editData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  if (!profile) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Failed to load profile</div>
  }

  const readingBooks = books.filter((b) => b.status === 'reading')
  const wishlistBooks = books.filter((b) => b.status === 'wishlist')

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Background */}
      <div className="h-32 bg-gradient-to-r from-red-600 to-red-700 relative">
        <div className="absolute -bottom-16 left-8">
          <Avatar className="w-32 h-32 border-4 border-background">
            <AvatarImage src={profile.avatar} alt={profile.name} />
            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="pt-20 px-8 pb-8">
        {/* Profile Header */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editData?.name || ''}
                  onChange={(e) => setEditData(editData ? { ...editData, name: e.target.value } : null)}
                  placeholder="Full name"
                  className="text-3xl font-bold h-auto p-2 bg-background border-2"
                />
                <Textarea
                  value={editData?.bio || ''}
                  onChange={(e) => setEditData(editData ? { ...editData, bio: e.target.value } : null)}
                  placeholder="Bio"
                  className="bg-background border-2 resize-none"
                />
                <Input
                  value={editData?.email || ''}
                  onChange={(e) => setEditData(editData ? { ...editData, email: e.target.value } : null)}
                  placeholder="Email"
                  type="email"
                  className="bg-background border-2"
                />
                <Input
                  value={editData?.location || ''}
                  onChange={(e) => setEditData(editData ? { ...editData, location: e.target.value } : null)}
                  placeholder="Location"
                  className="bg-background border-2"
                />
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-foreground mb-2">{profile.name}</h1>
                <p className="text-muted-foreground mb-4">{profile.bio}</p>
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {profile.email}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {profile.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(profile.joinedDate).toLocaleDateString()}
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveProfile}
                  className="gap-2 bg-red-600 hover:bg-red-700"
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setIsEditing(false)
                    setEditData(profile)
                  }}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Books Read</p>
                <p className="text-2xl font-bold text-foreground">{profile.booksRead}</p>
              </div>
              <BookOpen className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Hours Read</p>
                <p className="text-2xl font-bold text-foreground">{profile.hoursRead}</p>
              </div>
              <Calendar className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Current Streak</p>
                <p className="text-2xl font-bold text-foreground">{profile.currentStreak} days</p>
              </div>
              <Flame className="w-8 h-8 text-red-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div>
              <p className="text-muted-foreground text-sm mb-3">Favorite Genres</p>
              <div className="flex flex-wrap gap-2">
                {profile.favoriteGenres.map((genre) => (
                  <Badge key={genre} variant="secondary">{genre}</Badge>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="reading" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="reading">Currently Reading</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* Currently Reading Tab */}
          <TabsContent value="reading">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {readingBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200">
                      <BookOpen className="w-12 h-12 text-red-600" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                    {book.progress !== undefined && (
                      <>
                        <div className="w-full bg-muted rounded-full h-2 mb-2">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{book.progress}% complete</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Wishlist Tab */}
          <TabsContent value="wishlist">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wishlistBooks.map((book) => (
                <Card key={book.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="relative h-64 bg-muted overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-100 to-red-200 group-hover:scale-105 transition-transform">
                      <BookOpen className="w-12 h-12 text-red-600" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{book.author}</p>
                    <Button className="w-full bg-red-600 hover:bg-red-700" size="sm">
                      Add to Library
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Reviews Tab */}
          <TabsContent value="reviews">
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground">{review.bookTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-muted'}>
                          ★
                        </span>
                      ))}
                  </div>
                  <p className="text-foreground">{review.content}</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
