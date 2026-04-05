'use client'

import { useState, useEffect } from 'react'
import { Search, Grid, List, BookOpen, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface Book {
  id: string
  title: string
  author: string
  cover?: string
  status: 'reading' | 'completed' | 'wishlist'
  progress?: number
  addedDate: string
}

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'reading' | 'completed' | 'wishlist'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch books from backend - replace with your API
    const fetchBooks = async () => {
      try {
        // const res = await fetch('/api/users/library')
        // const data = await res.json()
        // setBooks(data)

        // Mock data - remove when backend is ready
        const mockBooks: Book[] = [
          {
            id: '1',
            title: 'The Midnight Library',
            author: 'Matt Haig',
            status: 'reading',
            progress: 85,
            addedDate: '2024-02-01',
          },
          {
            id: '2',
            title: 'Project Hail Mary',
            author: 'Andy Weir',
            status: 'reading',
            progress: 45,
            addedDate: '2024-01-15',
          },
          {
            id: '3',
            title: 'Fourth Wing',
            author: 'Rebecca Yarros',
            status: 'completed',
            addedDate: '2023-12-20',
          },
          {
            id: '4',
            title: 'Atomic Habits',
            author: 'James Clear',
            status: 'completed',
            addedDate: '2023-11-10',
          },
          {
            id: '5',
            title: 'Iron Widow',
            author: 'Gideon Defoe',
            status: 'wishlist',
            addedDate: '2024-03-01',
          },
          {
            id: '6',
            title: 'The House in the Cerulean Sea',
            author: 'TJ Klune',
            status: 'wishlist',
            addedDate: '2024-02-15',
          },
          {
            id: '7',
            title: 'Legendborn',
            author: 'Kara Thomas',
            status: 'wishlist',
            addedDate: '2024-01-20',
          },
          {
            id: '8',
            title: 'The Silent Patient',
            author: 'Alex Michaelides',
            status: 'completed',
            addedDate: '2023-10-05',
          },
        ]

        setBooks(mockBooks)
      } catch (error) {
        console.error('Failed to fetch books:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBooks()
  }, [])

  // Filter books based on search and status
  useEffect(() => {
    let filtered = books

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((book) => book.status === statusFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredBooks(filtered)
  }, [books, searchQuery, statusFilter])

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      reading: 'Currently Reading',
      completed: 'Completed',
      wishlist: 'Wishlist',
    }
    return labels[status] || status
  }

  const getStatusCount = (status: 'reading' | 'completed' | 'wishlist') => {
    return books.filter((b) => b.status === status).length
  }

  const handleRemoveBook = async (bookId: string) => {
    try {
      // await fetch(`/api/users/library/${bookId}`, { method: 'DELETE' })
      setBooks(books.filter((b) => b.id !== bookId))
    } catch (error) {
      console.error('Failed to remove book:', error)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">My Library</h1>
          <p className="text-muted-foreground">
            You have {books.length} book{books.length !== 1 ? 's' : ''} in your library
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search books by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books ({books.length})</SelectItem>
              <SelectItem value="reading">Currently Reading ({getStatusCount('reading')})</SelectItem>
              <SelectItem value="completed">Completed ({getStatusCount('completed')})</SelectItem>
              <SelectItem value="wishlist">Wishlist ({getStatusCount('wishlist')})</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex gap-2 bg-muted p-1 rounded-lg w-full md:w-auto">
            <Button
              onClick={() => setViewMode('grid')}
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 md:flex-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => setViewMode('list')}
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              className="flex-1 md:flex-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Books Grid/List */}
        {filteredBooks.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredBooks.map((book) => (
                <Card
                  key={book.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow group flex flex-col"
                >
                  {/* Book Cover */}
                  <div className="relative h-64 bg-gradient-to-br from-red-100 to-red-200 overflow-hidden flex items-center justify-center">
                    <BookOpen className="w-12 h-12 text-red-600" />
                  </div>

                  {/* Book Info */}
                  <CardContent className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2 flex-1">
                      {book.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{book.author}</p>

                    {/* Progress Bar */}
                    {book.progress !== undefined && (
                      <div className="mb-3">
                        <div className="w-full bg-muted rounded-full h-2 mb-1">
                          <div
                            className="bg-red-600 h-2 rounded-full transition-all"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{book.progress}% complete</p>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          'text-xs font-medium px-2 py-1 rounded-full',
                          book.status === 'reading'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                            : book.status === 'completed'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100'
                        )}
                      >
                        {getStatusLabel(book.status)}
                      </span>
                      <Button
                        onClick={() => handleRemoveBook(book.id)}
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredBooks.map((book) => (
                <Card key={book.id} className="p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{book.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
                      {book.progress !== undefined && (
                        <div className="w-32 bg-muted rounded-full h-1.5">
                          <div
                            className="bg-red-600 h-1.5 rounded-full"
                            style={{ width: `${book.progress}%` }}
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {book.progress !== undefined && (
                        <span className="text-sm text-muted-foreground min-w-16">{book.progress}%</span>
                      )}
                      <span
                        className={cn(
                          'text-xs font-medium px-3 py-1 rounded-full min-w-28 text-center',
                          book.status === 'reading'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100'
                            : book.status === 'completed'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100'
                              : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100'
                        )}
                      >
                        {getStatusLabel(book.status)}
                      </span>
                      <Button
                        onClick={() => handleRemoveBook(book.id)}
                        variant="ghost"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )
        ) : (
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'No books found matching your search.' : 'Your library is empty.'}
            </p>
            <Button className="bg-red-600 hover:bg-red-700">Add Books</Button>
          </Card>
        )}

        {/* Stats Footer */}
        {filteredBooks.length > 0 && (
          <div className="grid grid-cols-3 gap-4 pt-8 border-t">
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-sm">Currently Reading</p>
              <p className="text-2xl font-bold text-red-600">{getStatusCount('reading')}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-sm">Completed</p>
              <p className="text-2xl font-bold text-green-600">{getStatusCount('completed')}</p>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-muted-foreground text-sm">Wishlist</p>
              <p className="text-2xl font-bold text-yellow-600">{getStatusCount('wishlist')}</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
