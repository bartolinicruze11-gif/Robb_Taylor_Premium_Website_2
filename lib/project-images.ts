// ─── Images confirmed non-zero bytes ────────────────────────────────────────
const R = {
  trench:   '/images/097886d0-5afa-4463-8890-4489f97ef67a.JPG',   // outdoor trench/excavation
  pipes:    '/images/9de9d513-358e-45b5-b3b7-adce54ecac41.JPG',   // pipe installation
  tanks:    '/images/954c3c9e-1422-440c-a287-cf70157668a7.JPG',   // tanks / water infrastructure

  // WhatsApp on-site photos (visually confirmed good)
  wa04_2:  '/images/WhatsApp_Image_2026-05-04_at_12.13.08_PM_(2).jpeg', // site works
  wa04_3:  '/images/WhatsApp_Image_2026-05-04_at_12.13.08_PM_(3).jpeg', // drainage channel
  wa04_5:  '/images/WhatsApp_Image_2026-05-04_at_12.13.08_PM_(5).jpeg', // site work
  wa21_7:  '/images/WhatsApp_Image_2026-05-21_at_6.49.59_AM_(7).jpeg',  // indoor concrete
  wa21_13: '/images/WhatsApp_Image_2026-05-21_at_6.49.59_AM_(13).jpeg', // indoor works
  wa21_ex: '/images/WhatsApp_Image_2026-05-21_at_6.50.00_AM.jpeg',      // indoor excavation

  // Screenshots (all confirmed bytes)
  ss0421:  '/images/Screenshot_2026-04-21_141004.png',    // site overview
  ss0422:  '/images/Screenshot_2026-04-22_122210.png',    // director photo
  ss0507b: '/images/Screenshot_2026-05-07_152715.png',    // site works
  ss0526a: '/images/Screenshot_2026-05-26_095401.png',    // excavator works (2.4MB)
  ss0526c: '/images/Screenshot_2026-05-26_104809.png',    // construction site
  ss0527a: '/images/Screenshot_2026-05-27_091422.png',    // orange PPE crew (2.8MB)

  // Retaining & piling (confirmed real uploads)
  retWall1: '/images/Screenshot_2026-06-18_073341.png',
  retWall2: '/images/Screenshot_2026-06-18_073341.png',

  // Trenching (new uploads)
  trench_t1: '/images/097886d0-5afa-4463-8890-4489f97ef67a.JPG',
  trench_t2: '/images/WhatsApp_Image_2026-05-21_at_6.49.59_AM_(10).jpeg',

  // Civil construction
  civilConst1: '/images/Screenshot_2026-05-26_104638.png',
  civilConst2: '/images/Screenshot_2026-06-18_073355.png',
  civilConst3: '/images/Screenshot_2026-05-26_104638.png',
  civilConst4: "/images/Screenshot_2026-05-27_091929 copy.png",
  civilConst5: "/images/Screenshot_2026-05-27_091929.png",
  civilConst7: "/images/Screenshot_2026-05-27_091422.png",

  // Earthworks
  earthworksExcavation: '/images/WhatsApp_Image_2026-05-21_at_6.50.00_AM.jpeg',

  // Other real images
  digger:  '/images/Remove_Blue_Sign_Writing_from_Digger_Photo.png',
};

export const projectImages = {
  trench:              R.trench,
  pipes:               R.pipes,
  tanks:               R.tanks,
  aboutHero:           '/images/Screenshot_2026-05-27_091422.png',
  hdpePipework:        R.pipes,
  drainageChannel:     R.wa04_3,
  indoorExcavation:    R.wa21_ex,
  indoorTrench:        R.wa21_ex,
  indoorConcrete:      R.wa21_7,
  indoorRebar:         R.wa21_7,
  outdoorTrenching:    R.trench,
  orangePPECrew:       R.ss0527a,
  robbTaylorExcavator: R.ss0526a,
  internalTrenchRebar: R.wa21_7,
  internalTrenchGrid:  R.wa21_ex,
  indoorBreaker:       R.wa21_7,
  retainingWallComplete: R.retWall1,
  drillingPiling:      R.retWall1,
  trenchingWorks:      R.trench,
  openTrenchExcavation:R.trench,
  hdpeWelding:         R.pipes,
  concretePipeInstall: R.pipes,
  waterStorageTanks:   R.tanks,
  ppeCrew:             R.ss0527a,
  siteOverview:        R.ss0526a,
  excavatorSite:       R.ss0526a,
  drainageChannelRt:   R.wa04_3,
  civilInfra:          R.ss0527a,
  concretePump:        R.wa21_7,
  siteWorks2:          R.wa04_5,
  siteWorks3:          R.ss0526c,
  siteWorks4:          R.ss0526a,
  waterInfra4:         R.tanks,
  waterInfra5:         R.pipes,
  waterInfra6:         R.trench,
  trenchingSite:       R.trench_t1,
};

export const serviceImages: Record<string, string> = {
  'civil-construction':   R.ss0526a,
  'earthworks':           R.wa21_ex,
  'retaining-piling':     R.retWall1,
  'trenching':            R.trench,
  'pipe-installation':    R.pipes,
  'site-preparation':     R.ss0527a,
};

export type ProjectPhoto = { src: string; caption: string; category: string; type?: 'image' | 'video' };

export const allProjectPhotos: ProjectPhoto[] = [
  { src: R.ss0526a,     caption: 'Robb & Taylor — Civil Excavation Works', category: 'Civil Construction' },
  { src: R.wa21_ex,     caption: 'Commercial Indoor Excavation',           category: 'Civil Construction' },
  { src: R.wa21_7,      caption: 'Reinforced Concrete Works',              category: 'Civil Construction' },
  { src: R.civilConst5, caption: 'Concrete Pipe Infrastructure',               category: 'Civil Construction' },
  { src: R.civilConst7, caption: 'Indoor Concrete Preparation',         category: 'Civil Construction' },
  { src: R.retWall1,    caption: 'Concrete Retaining Wall Construction',   category: 'Retaining & Piling' },
  { src: R.earthworksExcavation, caption: 'Commercial Excavation Works',                  category: 'Earthworks' },
];

export const servicePhotos: Record<string, ProjectPhoto[]> = {
  'civil-construction': [
    { src: R.ss0526a,     caption: 'Civil Excavation Works',            category: 'Civil Construction' },
    { src: R.civilConst1, caption: 'Civil Construction Works',          category: 'Civil Construction' },
    { src: R.civilConst5, caption: 'Concrete Pipe Infrastructure',          category: 'Civil Construction' },
    { src: R.civilConst7, caption: 'Indoor Concrete Preparation',    category: 'Civil Construction' },
  ],
  'earthworks': [
    { src: R.earthworksExcavation, caption: 'Commercial Excavation Works',          category: 'Earthworks' },
  ],
  'trenching': [
    { src: R.wa21_7,    caption: 'Concrete Trenching Works',          category: 'Trenching' },
    { src: R.trench_t1, caption: 'Utility Trench Excavation',         category: 'Trenching' },
    { src: R.trench_t2, caption: 'Trench Works On Site',              category: 'Trenching' },
  ],
  'pipe-installation': [
    { src: R.pipes,    caption: 'Pipe Installation Works',           category: 'Pipe Installation' },
    { src: R.trench,   caption: 'Pipe Trench Excavation',            category: 'Pipe Installation' },
    { src: R.wa04_5,   caption: 'Site Pipe Works',                   category: 'Pipe Installation' },
  ],
  'retaining-piling': [
    { src: R.retWall1,    caption: 'Concrete Retaining Wall Construction', category: 'Retaining & Piling' },
  ],
  'site-preparation': [
    { src: R.ss0527a,  caption: 'Site Overview & Preparation',       category: 'Site Preparation' },
    { src: R.wa21_ex,  caption: 'Site Establishment & Excavation',   category: 'Site Preparation' },
    { src: R.ss0526a,  caption: 'Civil Site Preparation',            category: 'Site Preparation' },
    { src: R.trench,   caption: 'Site Clearance Works',              category: 'Site Preparation' },
  ],
};
