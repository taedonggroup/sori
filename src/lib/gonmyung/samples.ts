// 테스트 샘플 인덱스 — Kevin MacLeod (CC BY 4.0)

export interface TestSample {
  filename: string;
  title: string;
  genre: string;
  path: string;
}

export const TEST_SAMPLES: TestSample[] = [
  { filename: "20260221_asset_Ambient_AlmostinF.mp3", title: "Almost in F", genre: "Ambient", path: "/audio/samples/20260221_asset_Ambient_AlmostinF.mp3" },
  { filename: "20260221_asset_Ambient_AvantJazz.mp3", title: "Avant Jazz", genre: "Ambient", path: "/audio/samples/20260221_asset_Ambient_AvantJazz.mp3" },
  { filename: "20260221_asset_Classical_AirPrelude.mp3", title: "Air Prelude", genre: "Classical", path: "/audio/samples/20260221_asset_Classical_AirPrelude.mp3" },
  { filename: "20260221_asset_Classical_AmazingGrace2011.mp3", title: "Amazing Grace 2011", genre: "Classical", path: "/audio/samples/20260221_asset_Classical_AmazingGrace2011.mp3" },
  { filename: "20260221_asset_Contemporary_AutumnDay.mp3", title: "Autumn Day", genre: "Contemporary", path: "/audio/samples/20260221_asset_Contemporary_AutumnDay.mp3" },
  { filename: "20260221_asset_Horror_Aftermath.mp3", title: "Aftermath", genre: "Horror", path: "/audio/samples/20260221_asset_Horror_Aftermath.mp3" },
  { filename: "20260221_asset_Horror_Anxiety.mp3", title: "Anxiety", genre: "Horror", path: "/audio/samples/20260221_asset_Horror_Anxiety.mp3" },
  { filename: "20260221_asset_Jazz_AcidJazz.mp3", title: "Acid Jazz", genre: "Jazz", path: "/audio/samples/20260221_asset_Jazz_AcidJazz.mp3" },
  { filename: "20260221_asset_Jazz_AirshipSerenity.mp3", title: "Airship Serenity", genre: "Jazz", path: "/audio/samples/20260221_asset_Jazz_AirshipSerenity.mp3" },
  { filename: "20260221_asset_Latin_AsIFigure.mp3", title: "As I Figure", genre: "Latin", path: "/audio/samples/20260221_asset_Latin_AsIFigure.mp3" },
  { filename: "20260221_asset_NewAge_Aretes.mp3", title: "Aretes", genre: "New Age", path: "/audio/samples/20260221_asset_NewAge_Aretes.mp3" },
  { filename: "20260221_asset_NewAge_AtlanteanTwilight.mp3", title: "Atlantean Twilight", genre: "New Age", path: "/audio/samples/20260221_asset_NewAge_AtlanteanTwilight.mp3" },
  { filename: "20260221_asset_Rock_Aitech.mp3", title: "Aitech", genre: "Rock", path: "/audio/samples/20260221_asset_Rock_Aitech.mp3" },
  { filename: "20260221_asset_Rock_Anachronist.mp3", title: "Anachronist", genre: "Rock", path: "/audio/samples/20260221_asset_Rock_Anachronist.mp3" },
  { filename: "20260221_asset_Soundtrack_AMission.mp3", title: "A Mission", genre: "Soundtrack", path: "/audio/samples/20260221_asset_Soundtrack_AMission.mp3" },
  { filename: "20260221_asset_Soundtrack_ASingularPerversion.mp3", title: "A Singular Perversion", genre: "Soundtrack", path: "/audio/samples/20260221_asset_Soundtrack_ASingularPerversion.mp3" },
  { filename: "20260221_asset_VideoGame_8bitDungeonBoss.mp3", title: "8bit Dungeon Boss", genre: "Video Game", path: "/audio/samples/20260221_asset_VideoGame_8bitDungeonBoss.mp3" },
  { filename: "20260221_asset_VideoGame_8bitDungeonLevel.mp3", title: "8bit Dungeon Level", genre: "Video Game", path: "/audio/samples/20260221_asset_VideoGame_8bitDungeonLevel.mp3" },
  { filename: "20260221_asset_World_Accralate.mp3", title: "Accralate", genre: "World", path: "/audio/samples/20260221_asset_World_Accralate.mp3" },
  { filename: "20260221_asset_World_AchaidhCheide.mp3", title: "Achaidh Cheide", genre: "World", path: "/audio/samples/20260221_asset_World_AchaidhCheide.mp3" },
];

// 라이선스 고지
export const SAMPLE_LICENSE = "Music by Kevin MacLeod (incompetech.com) — CC BY 4.0";

// 장르별 대표 샘플 매핑 (create 페이지 시뮬레이션용)
export const GENRE_SAMPLE_MAP: Record<string, string> = {
  ambient: "/audio/samples/20260221_asset_Ambient_AlmostinF.mp3",
  classical: "/audio/samples/20260221_asset_Classical_AirPrelude.mp3",
  jazz: "/audio/samples/20260221_asset_Jazz_AcidJazz.mp3",
  rock: "/audio/samples/20260221_asset_Rock_Aitech.mp3",
  cinematic: "/audio/samples/20260221_asset_Soundtrack_AMission.mp3",
  edm: "/audio/samples/20260221_asset_VideoGame_8bitDungeonBoss.mp3",
  experimental: "/audio/samples/20260221_asset_Horror_Aftermath.mp3",
  folk: "/audio/samples/20260221_asset_World_AchaidhCheide.mp3",
  lofi: "/audio/samples/20260221_asset_NewAge_Aretes.mp3",
  soul: "/audio/samples/20260221_asset_Jazz_AirshipSerenity.mp3",
};
