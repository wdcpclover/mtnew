/**
 * API 配置文件
 */

// 开发环境配置 (本地调试)
const DEV_CONFIG = {
  baseUrl: 'http://localhost:4567',
  apiPath: '/api/moti'
};

// 生产环境配置 (服务器)
const PROD_CONFIG = {
  baseUrl: 'https://www.motizhidi.cn',
  apiPath: '/api/moti'
};

// 当前环境 (可根据小程序的 envVersion 自动判断)
const isDev = true; // 开发时设为 true，上线时改为 false

const config = isDev ? DEV_CONFIG : PROD_CONFIG;

module.exports = {
  // API 基础地址
  BASE_URL: config.baseUrl,
  API_PATH: config.apiPath,

  // 完整 API 地址
  API_BASE: config.baseUrl + config.apiPath,

  // Token 存储 key
  TOKEN_KEY: 'moti_token',
  USER_KEY: 'moti_user',

  // 请求超时时间 (毫秒)
  TIMEOUT: 15000,

  // 分页默认配置
  PAGE_SIZE: 20
};
