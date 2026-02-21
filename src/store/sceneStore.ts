import { create } from "zustand"

export type SceneName = "stone" | "fragments" | "upload" | "gallery" | "profile"

interface SceneStore {
  scene: SceneName
  isTransitioning: boolean
  setScene: (scene: SceneName) => void
  setTransitioning: (v: boolean) => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  scene: "stone",
  isTransitioning: false,
  setScene: (scene) => set({ scene }),
  setTransitioning: (isTransitioning) => set({ isTransitioning }),
}))
