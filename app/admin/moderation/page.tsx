
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-neutral-900 dark:text-white lg:text-5xl">
              Moderation
            </h1>
            <p className="mt-3 text-lg font-medium text-neutral-500 dark:text-neutral-400">
              Review AI-flagged works and enforce community standards.
            </p>
          </div>
          <Button
            variant="outline"
            asChild
            className="rounded-2xl border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
          >
            <Link href="/admin">Back to dashboard</Link>
          </Button>
        </div>

        <Card className="rounded-[2rem] border-neutral-200 bg-white shadow-xl shadow-neutral-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none overflow-hidden">
          <CardHeader className="flex flex-col gap-4 border-b border-neutral-100 dark:border-neutral-800 p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl font-black text-neutral-900 dark:text-white">Review queue</CardTitle>
              <CardDescription className="text-neutral-500 dark:text-neutral-400 mt-1">
                Scores reflect the last automated moderation run.
              </CardDescription>
            </div>
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as AdminModerationQueueStatus)}
              className="bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger value="needs_admin_review" className="rounded-lg font-bold uppercase tracking-widest text-[10px]">Needs review</TabsTrigger>
                <TabsTrigger value="rejected" className="rounded-lg font-bold uppercase tracking-widest text-[10px]">Rejected</TabsTrigger>
                <TabsTrigger value="all" className="rounded-lg font-bold uppercase tracking-widest text-[10px]">All flagged</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent className="p-0">
            {error && (
              <div className="m-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-600 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400">
                {error}
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-24">
                <Spinner className="size-10 text-primary" />
              </div>
            ) : queue.length === 0 ? (
              <div className="py-32 text-center">
                <div className="mx-auto w-16 h-16 rounded-3xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-6">
                  <ShieldAlert className="text-neutral-400 size-8" />
                </div>
                <h3 className="text-xl font-black text-neutral-900 dark:text-white">Queue Clear</h3>
                <p className="text-neutral-500 dark:text-neutral-400 mt-2">No items currently need attention.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-transparent bg-neutral-50/50 dark:bg-neutral-800/30">
                      <TableHead className="py-4 px-8 font-black uppercase tracking-widest text-[10px] text-neutral-500">Work</TableHead>
                      <TableHead className="py-4 px-8 font-black uppercase tracking-widest text-[10px] text-neutral-500">Author</TableHead>
                      <TableHead className="py-4 px-8 font-black uppercase tracking-widest text-[10px] text-neutral-500">Status</TableHead>
                      <TableHead className="py-4 px-8 font-black uppercase tracking-widest text-[10px] text-neutral-500">Confidence</TableHead>
                      <TableHead className="py-4 px-8 font-black uppercase tracking-widest text-[10px] text-neutral-500">Updated</TableHead>
                      <TableHead className="py-4 px-8 font-black uppercase tracking-widest text-[10px] text-neutral-500 text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {queue.map((row) => (
                      <TableRow key={row.id} className="border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/50 transition-colors">
                        <TableCell className="py-6 px-8 max-w-[280px]">
                          <button
                            type="button"
                            onClick={() => void openDetail(row.id)}
                            className="text-left font-black text-neutral-900 dark:text-white hover:text-primary transition-colors block truncate"
                          >
                            {row.title}
                          </button>
                          {row.moderationReason && (
                            <p className="mt-2 line-clamp-1 text-xs font-bold text-rose-500/80 italic">
                              {row.moderationReason}
                            </p>
                          )}
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <span className="font-bold text-primary/80">@{row.authorUsername || 'unknown'}</span>
                        </TableCell>
                        <TableCell className="py-6 px-8">
                          <Badge variant={statusBadgeVariant(row.status)} className="rounded-lg font-black uppercase tracking-widest text-[10px]">{row.status}</Badge>
                        </TableCell>
                        <TableCell className="py-6 px-8 font-black text-neutral-600 dark:text-neutral-400 tabular-nums">
                          {typeof row.moderationConfidence === 'number'
                            ? row.moderationConfidence.toFixed(2)
                            : '—'}
                        </TableCell>
                        <TableCell className="py-6 px-8 text-xs font-bold text-neutral-400">
                          {(() => {
                            const raw = row.moderationUpdatedAt || row.updatedAt
                            if (!raw) return '—'
                            const d = new Date(raw)
                            return Number.isNaN(d.getTime())
                              ? '—'
                              : formatDistanceToNow(d, { addSuffix: true })
                          })()}
                        </TableCell>
                        <TableCell className="py-6 px-8 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <Button
                              size="sm"
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest rounded-xl"
                              disabled={actionId === row.id}
                              onClick={() => void handleApprove(row.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              className="font-black text-[10px] uppercase tracking-widest rounded-xl"
                              disabled={actionId === row.id}
                              onClick={() => void handleReject(row.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
        <DialogContent
          className="flex max-h-[90vh] max-w-4xl flex-col border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 rounded-[2.5rem] overflow-hidden"
        >
          <DialogHeader className="p-8 border-b border-neutral-100 dark:border-neutral-800">
            <DialogTitle className="text-3xl font-black tracking-tight text-neutral-900 dark:text-white">{detail?.title ?? 'Work details'}</DialogTitle>
            <DialogDescription className="text-primary font-black uppercase tracking-widest text-xs mt-2">
              Author: @{detail?.authorUsername || 'unknown'}
            </DialogDescription>
          </DialogHeader>

          {detailLoading ? (
            <div className="flex justify-center py-24">
              <Spinner className="size-10 text-primary" />
            </div>
          ) : detail ? (
            <>
              <div className="grid gap-4 p-8 sm:grid-cols-3">
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Work status</p>
                  <Badge variant={statusBadgeVariant(detail.status)} className="font-black uppercase tracking-widest text-[10px]">
                    {detail.status}
                  </Badge>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Model Confidence</p>
                  <p className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                    {typeof detail.moderationConfidence === 'number'
                      ? detail.moderationConfidence.toFixed(3)
                      : '—'}
                  </p>
                </div>
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-800/50">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Safety Score</p>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest">Child: {String(detail.childSafe)}</Badge>
                    <Badge variant="outline" className="font-black text-[9px] uppercase tracking-widest">Adult: {String(detail.adultSafe)}</Badge>
                  </div>
                </div>
                
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 p-5 dark:border-neutral-800 dark:bg-neutral-800/50 sm:col-span-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-2">Summary Insight</p>
                  <p className="text-sm font-medium leading-relaxed text-neutral-700 dark:text-neutral-300 italic">"{summaryPreview}"</p>
                </div>
              </div>

              <div className="px-8 pb-8 flex-1 overflow-hidden flex flex-col">
                <p className="mb-4 text-xs font-black uppercase tracking-widest text-neutral-400">Chapters ({detail.chapters?.length || 0})</p>
                <ScrollArea className="flex-1 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/50">
                  <div className="space-y-4 p-4">
                    {(detail.chapters || []).map((ch) => (
                      <div
                        key={ch.id}
                        className="rounded-2xl border border-neutral-100 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900 shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-black text-neutral-900 dark:text-white">{ch.title}</span>
                          <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest">
                            Score: {ch.moderationConfidence?.toFixed(2) || '—'}
                          </Badge>
                        </div>
                        <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-600 dark:text-neutral-400 line-clamp-3">
                          {stripHtmlToPreview(ch.contentText || '', 500) || 'No text content available.'}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <DialogFooter className="p-8 border-t border-neutral-100 dark:border-neutral-800 gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl border-neutral-200 font-black uppercase tracking-widest text-[10px] dark:border-neutral-800 dark:bg-neutral-900"
                  disabled={actionId === detail.id}
                  onClick={() => void handleFlag(detail.id)}
                >
                  Flag Manual
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px] px-8"
                  disabled={actionId === detail.id}
                  onClick={() => void handleReject(detail.id)}
                >
                  Reject
                </Button>
                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black uppercase tracking-widest text-[10px] px-8"
                  disabled={actionId === detail.id}
                  onClick={() => void handleApprove(detail.id)}
                >
                  Approve Entry
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}
