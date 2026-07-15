import { StateCreator } from 'zustand';
import { EditorStore, ProfileState } from '../types';

export const createProfileSlice: StateCreator<EditorStore, [], [], ProfileState> = (set) => ({
  fullName: "Your Name",
  professionText: "Profession / Short Bio",
  bioText: "",
  locationText: "Indonesia",
  avatarUrl: "",
  subdomain: "",
  isLive: true,
  dbData: {},
  userPlan: 'FREE',
  planExpiredAt: null,

  setFullName: (val) => set({ fullName: val }),
  setProfessionText: (val) => set({ professionText: val }),
  setBioText: (val) => set({ bioText: val }),
  setLocationText: (val) => set({ locationText: val }),
  setAvatarUrl: (val) => set({ avatarUrl: val }),
  setSubdomain: (val) => set({ subdomain: val }),
  setIsLive: (val) => set({ isLive: val }),
  setDbData: (val) => set({ dbData: val }),
  setUserPlan: (val) => set({ userPlan: val }),
  setPlanExpiredAt: (val) => set({ planExpiredAt: val }),
});
