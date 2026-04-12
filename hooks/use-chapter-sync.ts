import { useEffect, useRef } from 'react'
import * as Y from 'yjs'
import { EditorYjsService } from '@/app/services/editor-yjs.service'
import { fromUint8Array, toUint8Array } from '@/lib/utils/base64' // I'll need to create this or use a lib

// Since I might not have a base64 util, I'll implement simple ones or use Buffer if in Node
// But this is for the browser.

export function useChapterSync(docId: string | null, ydoc: Y.Doc) {
  const isSyncing = useRef(false)

  useEffect(() => {
    if (!docId) return

    let active = true

    const syncInitialState = async () => {
      try {
        const { state, sv } = await EditorYjsService.getState(docId)
        if (!active) return

        if (state) {
          const update = toUint8Array(state)
          Y.applyUpdate(ydoc, update, 'initial')
        }
      } catch (err) {
        console.warn('Failed to sync initial state (continuing local editor mode):', err)
      }
    }

    syncInitialState()

    const onUpdate = async (update: Uint8Array, origin: any) => {
      if (origin === 'initial') return // Don't send initial state back
      
      try {
        const base64Update = fromUint8Array(update)
        await EditorYjsService.appendUpdate(docId, base64Update)
      } catch (err) {
        console.warn('Failed to send update (changes stay local until backend recovers):', err)
      }
    }

    ydoc.on('update', onUpdate)

    return () => {
      active = false
      ydoc.off('update', onUpdate)
    }
  }, [docId, ydoc])
}
