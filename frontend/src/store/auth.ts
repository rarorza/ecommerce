import { create } from 'zustand'
import { mountStoreDevtool } from 'simple-zustand-devtools'
import { persist } from 'zustand/middleware'
import { IUserDataJwt } from '../shared/user.interface'
interface IAuthStore {
  allUserData: IUserDataJwt | null
  loading: boolean
  user: () => IUserDataJwt | null
  setUser: (user: IUserDataJwt | null) => void
  setLoading: (loading: boolean) => void
  isLoggedIn: () => boolean
}

const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      allUserData: null,
      loading: false,

      user: () => ({
        user_id: get().allUserData?.user_id || null,
        username: get().allUserData?.username || null,
      }),

      setUser: (user) => set({ allUserData: user }),
      setLoading: (loading) => set({ loading }),
      isLoggedIn: () => get().allUserData !== null,
    }),
    {
      name: 'auth-storage',
      getStorage: () => localStorage,
    },
  ),
)

if (import.meta.env.DEV) {
  // if in dev environment
  mountStoreDevtool('Store', useAuthStore)
}

export { useAuthStore }
