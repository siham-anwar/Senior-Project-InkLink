import { Work } from './types'

// Simple in-memory store for demo purposes
// In production, this would be a database
let works: Work[] = []

export function getWorks(): Work[] {
  return [...works]
}

export function addWork(work: Omit<Work, 'id' | 'createdAt' | 'updatedAt'>): Work {
  const newWork: Work = {
    id: crypto.randomUUID(),
    ...work,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  works.push(newWork)
  return newWork
}

export function updateWork(id: string, updates: Partial<Omit<Work, 'id' | 'createdAt'>>): Work | null {
  const index = works.findIndex(w => w.id === id)
  if (index === -1) return null
  
  works[index] = {
    ...works[index],
    ...updates,
    updatedAt: new Date(),
  }
  return works[index]
}

export function getWork(id: string): Work | null {
  return works.find(w => w.id === id) || null
}
