export interface GalleryLayoutProps {
  projects: any[];
  subdomain: string;
  isEditor: boolean;
  customTexts: any;
  setActiveProject: (project: any) => void;
  getLayoutParts: (index: number) => { spanClass: string; aspectClass: string };
  premiumEase: readonly [number, number, number, number];
  systemTime?: string;
  profile?: any;
  links?: any[];
  email?: string;
}
