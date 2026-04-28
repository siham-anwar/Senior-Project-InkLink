
'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import {
  AdminModerationService,
  type AdminModerationQueueStatus,
  type AdminWorkDetailsDto,
  type AdminWorkQueueItemDto,
} from '@/app/services/admin-moderation.service'
import { useAuthStore } from '@/app/store/authstore'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Spinner } from '@/components/ui/spinner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { extractApiErrorMessage } from '@/lib/api'
import { ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'

function stripHtmlToPreview(html: string, maxLen = 360) {
  const text = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (text.length <= maxLen) return text
  return `${text.slice(0, maxLen)}…`
}

function statusBadgeVariant(
  status: AdminWorkQueueItemDto['status'],
): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (status === 'rejected') return 'destructive'
  if (status === 'needs_admin_review') return 'secondary'
  if (status === 'approved') return 'default'
  return 'outline'
}

export default function AdminModerationPage() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  const [filter, setFilter] = useState<AdminModerationQueueStatus>('needs_admin_review')
  const [queue, setQueue] = useState<AdminWorkQueueItemDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [detailOpen, setDetailOpen] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detail, setDetail] = useState<AdminWorkDetailsDto | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error('Admin access required')
      router.replace('/dashboard')
    }
  }, [user, router])

  const loadQueue = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const items = await AdminModerationService.listReviewQueue(filter)
      setQueue(items)
    } catch (e) {
      setError(extractApiErrorMessage(e, 'Failed to load moderation queue'))
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    if (user?.role === 'admin') {
      void loadQueue()
    }
  }, [user?.role, loadQueue])

  const openDetail = async (workId: string) => {
    setDetailOpen(true)
    setDetail(null)
    setDetailLoading(true)
    try {
      const d = await AdminModerationService.getWorkDetails(workId)
      setDetail(d)
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Failed to load work details'))
      setDetailOpen(false)
    } finally {
      setDetailLoading(false)
    }
  }

  const removeFromQueue = (id: string) => {
    setQueue((prev) => prev.filter((w) => w.id !== id))
  }

  const handleApprove = async (id: string) => {
    setActionId(id)
    try {
      await AdminModerationService.approveWork(id)
      toast.success('Work approved')
      removeFromQueue(id)
      if (detail?.id === id) setDetailOpen(false)
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Approve failed'))
    } finally {
      setActionId(null)
    }
  }

  const handleReject = async (id: string) => {
    setActionId(id)
    try {
      await AdminModerationService.rejectWork(id)
      toast.success('Work rejected')
      removeFromQueue(id)
      if (detail?.id === id) setDetailOpen(false)
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Reject failed'))
    } finally {
      setActionId(null)
    }
  }

  const handleFlag = async (id: string) => {
    setActionId(id)
    try {
      const updated = await AdminModerationService.flagWork(id)
      toast.success('Flagged for review')
      if (filter === 'rejected') {
        removeFromQueue(id)
      } else {
        setQueue((prev) => prev.map((w) => (w.id === id ? { ...w, ...updated } : w)))
      }
      if (detail?.id === id) {
        setDetail((d) => (d ? { ...d, ...updated, chapters: d.chapters } : d))
      }
    } catch (e) {
      toast.error(extractApiErrorMessage(e, 'Flag failed'))
    } finally {
      setActionId(null)
    }
  }

  const summaryPreview = useMemo(() => {
    if (!detail?.summary) return '—'
    return stripHtmlToPreview(detail.summary, 200)
  }, [detail?.summary])

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner className="size-8 text-primary" />
      </div>
    )
  }

  if (user.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-amber-50/30 to-white">
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#2d2d2d] lg:text-5xl">
              Moderation
            </h1>
            <p className="mt-3 text-lg text-gray-600">
              Review AI-flagged works, approve, reject, or flag for manual follow-up.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="rounded-full border-amber-100 text-[#8B1A1A] hover:border-[#8B1A1A]/30 hover:bg-white"
          >
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>

        <Card className="border-amber-100 bg-white">
          <CardHeader className="flex flex-col gap-4 border-b border-amber-100 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-lg text-[#2d2d2d]">Review queue</CardTitle>
              <CardDescription className="text-gray-600">
                Filter by status. Scores reflect the last automated moderation run on this work.
              </CardDescription>
            </div>
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as AdminModerationQueueStatus)}
            >
              <TabsList>
                <TabsTrigger value="needs_admin_review">Needs review</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
                <TabsTrigger value="all">All flagged</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4 border-red-200 bg-red-50 text-red-900">
                <AlertTitle>Could not load queue</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner className="size-8 text-[#8B1A1A]" />
              </div>
            ) : queue.length === 0 ? (
              <Empty className="border border-dashed border-amber-200 bg-amber-50/50 py-12">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <ShieldAlert className="text-amber-700" />
                  </EmptyMedia>
                  <EmptyTitle className="text-[#2d2d2d]">Nothing in this queue</EmptyTitle>
                  <EmptyDescription className="text-gray-600">
                    When content needs human review or is rejected by automation, it will appear here.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-amber-100 hover:bg-transparent">
                    <TableHead className="text-gray-600">Work</TableHead>
                    <TableHead className="text-gray-600">Author</TableHead>
                    <TableHead className="text-gray-600">Status</TableHead>
                    <TableHead className="text-gray-600">Confidence</TableHead>
                    <TableHead className="text-gray-600">Updated</TableHead>
                    <TableHead className="text-right text-gray-600">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queue.map((row) => (
                    <TableRow key={row.id} className="border-b border-amber-100 hover:bg-amber-50/50">
                      <TableCell className="max-w-[220px]">
                        <button
                          type="button"
                          onClick={() => void openDetail(row.id)}
                          className="text-left font-medium text-[#8B1A1A] hover:underline"
                        >
                          {row.title}
                        </button>
                        {row.moderationReason && (
                          <p className="mt-1 line-clamp-2 text-xs text-gray-600">
                            {row.moderationReason}
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-gray-700">
                        {row.authorUsername || row.authorId || '—'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusBadgeVariant(row.status)}>{row.status}</Badge>
                      </TableCell>
                      <TableCell className="text-sm tabular-nums text-gray-700">
                        {typeof row.moderationConfidence === 'number'
                          ? row.moderationConfidence.toFixed(2)
                          : '—'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm text-gray-600">
                        {(() => {
                          const raw = row.moderationUpdatedAt || row.updatedAt
                          if (!raw) return '—'
                          const d = new Date(raw)
                          return Number.isNaN(d.getTime())
                            ? '—'
                            : formatDistanceToNow(d, { addSuffix: true })
                        })()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            disabled={actionId === row.id}
                            onClick={() => void handleApprove(row.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={actionId === row.id}
                            onClick={() => void handleReject(row.id)}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-100 text-[#8B1A1A] hover:bg-amber-50"
                            disabled={actionId === row.id}
                            onClick={() => void handleFlag(row.id)}
                          >
                            Flag
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          showCloseButton
          className="flex max-h-[90vh] max-w-[calc(100%-2rem)] flex-col border-amber-100 bg-white sm:max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle className="text-[#2d2d2d]">{detail?.title ?? 'Work details'}</DialogTitle>
            <DialogDescription className="text-gray-600">
              {detail?.authorUsername || detail?.authorId
                ? `Author: ${detail.authorUsername || detail.authorId}`
                : 'Author unknown'}
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex justify-center py-12">
              <Spinner className="size-8 text-[#8B1A1A]" />
            </div>
          ) : detail ? (
            <>
              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <p className="text-xs font-medium text-gray-600">Work status</p>
                  <Badge className="mt-1" variant={statusBadgeVariant(detail.status)}>
                    {detail.status}
                  </Badge>
                </div>
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <p className="text-xs font-medium text-gray-600">Model confidence</p>
                  <p className="mt-1 tabular-nums font-medium text-[#2d2d2d]">
                    {typeof detail.moderationConfidence === 'number'
                      ? detail.moderationConfidence.toFixed(3)
                      : '—'}
                  </p>
                </div>
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 sm:col-span-2">
                  <p className="text-xs font-medium text-gray-600">Safety</p>
                  <p className="mt-1 text-[#2d2d2d]">
                    childSafe:{' '}
                    <span className="font-medium">{String(detail.childSafe ?? '—')}</span>
                    {' · '}
                    adultSafe:{' '}
                    <span className="font-medium">{String(detail.adultSafe ?? '—')}</span>
                  </p>
                  {detail.moderationReason && (
                    <p className="mt-2 text-gray-700">{detail.moderationReason}</p>
                  )}
                </div>
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3 sm:col-span-2">
                  <p className="text-xs font-medium text-gray-600">Summary</p>
                  <p className="mt-2 text-[#2d2d2d]">{summaryPreview}</p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[#2d2d2d]">Chapters</p>
                <ScrollArea className="h-[min(40vh,320px)] rounded-md border border-amber-100">
                  <div className="space-y-3 p-3">
                    {(detail.chapters || []).map((ch) => (
                      <div
                        key={ch.id}
                        className="rounded-lg border border-amber-100 bg-white p-3 text-sm"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-medium text-[#2d2d2d]">{ch.title}</span>
                          {ch.moderationStatus && (
                            <Badge variant="outline" className="text-xs">
                              {ch.moderationStatus}
                            </Badge>
                          )}
                        </div>
                        {typeof ch.moderationConfidence === 'number' && (
                          <p className="mt-1 text-xs text-gray-600">
                            Confidence {ch.moderationConfidence.toFixed(2)}
                          </p>
                        )}
                        <p className="mt-2 whitespace-pre-wrap text-xs text-gray-700">
                          {stripHtmlToPreview(ch.contentText || '', 500) || '—'}
                        </p>
                      </div>
                    ))}
                    {(!detail.chapters || detail.chapters.length === 0) && (
                      <p className="text-sm text-gray-600">No chapters.</p>
                    )}
                  </div>
                </ScrollArea>
              </div>

              <DialogFooter className="gap-2 border-t border-amber-100 pt-4 sm:justify-end">
                <Button
                  variant="outline"
                  className="border-amber-100 text-[#8B1A1A] hover:bg-amber-50"
                  disabled={actionId === detail.id}
                  onClick={() => void handleFlag(detail.id)}
                >
                  Flag
                </Button>
                <Button
                  variant="destructive"
                  disabled={actionId === detail.id}
                  onClick={() => void handleReject(detail.id)}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  disabled={actionId === detail.id}
                  onClick={() => void handleApprove(detail.id)}
                >
                  Approve
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
