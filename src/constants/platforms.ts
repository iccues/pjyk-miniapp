/**
 * 平台配置，与 pjyk 仓库 web/packages/shared/src/config/platforms.ts 保持一致
 *
 * 小程序 image 对 SVG 的支持不一致，平台图标统一用 static 下的 PNG。
 */
export interface PlatformConfig {
  name: string;
  logo?: string;
  /**
   * 生成动画条目URL的函数
   * @param platformId 平台上的动画ID
   * @returns 完整的URL
   */
  getAnimeUrl?: (platformId: string) => string;
}

const platformConfigs: Record<string, PlatformConfig> = {
  AniList: {
    name: "AniList",
    logo: "/static/platforms/anilist.png",
    getAnimeUrl: (platformId) => `https://anilist.co/anime/${platformId}`,
  },
  Bangumi: {
    name: "Bangumi",
    logo: "/static/platforms/bangumi.png",
    getAnimeUrl: (platformId) => `https://bgm.tv/subject/${platformId}`,
  },
  MyAnimeList: {
    name: "MyAnimeList",
    logo: "/static/platforms/myanimelist.png",
    getAnimeUrl: (platformId) => `https://myanimelist.net/anime/${platformId}`,
  },
};

/**
 * 根据平台名称获取平台配置；后端新增了小程序还不认识的平台时，只显示名称
 */
export function getPlatformConfig(platformName: string): PlatformConfig {
  return platformConfigs[platformName] || { name: platformName };
}
