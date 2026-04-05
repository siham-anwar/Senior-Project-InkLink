import { PostStatus } from './types'

export async function mockPostStory(): Promise<PostStatus> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  // Randomly return one of the three responses
  const responses: PostStatus[] = ['successful', 'Warning', 'Fail']
  const randomIndex = Math.floor(Math.random() * responses.length)
  
  return responses[randomIndex]
}
