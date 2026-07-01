import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'light' | 'dark'
  sidebarOpen: boolean
  modalOpen: boolean
  modalContent: string | null
  setTheme: (theme: 'light' | 'dark') => void
  toggleSidebar: () => void
  openModal: (content?: string) => void
  closeModal: () => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      sidebarOpen: false,
      modalOpen: false,
      modalContent: null,
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      openModal: (content) => set({ modalOpen: true, modalContent: content || null }),
      closeModal: () => set({ modalOpen: false, modalContent: null }),
    }),
    {
      name: 'ui-storage',
    }
  )
)
