const isDev = process.env.NODE_ENV === 'development'

const configService = {
    // baseApiOrg: 'https://admin.bbkktt.xyz/api/',  // API正式环境
    // imgOrg: 'https://admin.bbkktt.xyz/storage/',  // 正式环境图片地址
    // domain: 'https://mobile.bbkktt.xyz/',  // 域名地址
    // wss: 'wss://admin.bbkktt.xyz/'        // websocket地址

    baseApiOrg: 'https://ad.buenmtdnet.xyz/api/',  // API测试环境
    imgOrg: 'https://ad.buenmtdnet.xyz/storage/',  // 测试环境图片地址
    domain: 'https://mobile.buenmtdnet.xyz/',  // 域名地址
    wss: 'wss://ad.buenmtdnet.xyz/',        // websocket地址
    
  };
  export default configService
