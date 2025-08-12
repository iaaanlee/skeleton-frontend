export { promptService } from './promptService'
export type { 
  Prompt, 
  PromptListResponse, 
  CreatePromptRequest, 
  CreatePromptResponse,
  UpdatePromptRequest,
  UpdatePromptResponse
} from './promptService'

// React Query hooks
export { useActivePrompts, useAllPrompts, usePromptById } from './promptQuery'
export { useCreatePrompt, useUpdatePrompt, useDeletePrompt } from './promptMutation'
