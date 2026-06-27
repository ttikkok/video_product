const isDev = process.env.NODE_ENV === 'development'

const configService = {
  // 动态线路列表（从接口获取）
  lines: [],
  
  // 默认线路配置（当没有接口数据时使用）
  defaultLine: {
    id: 'default',
    name: '默认线路',
    baseApiOrg: 'https://ad.juzi518.com/api/',
    imgOrg: 'https://ad.juzi518.com/storage/',
    domain: 'https://ad.juzi518.com/',
    wss: 'wss://ad.juzi518.com/'
  },
  
  // 设置线路列表
  setLines(lines) {
    this.lines = lines;
  },
  
  // 获取当前选中的线路配置
  getCurrentLine() {
    const savedLineId = uni.getStorageSync('currentLineId');
    if (savedLineId) {
      const line = this.lines.find(l => l.id === savedLineId);
      if (line) return line;
    }
    return this.lines[0] || this.defaultLine;
  },
  
  // 设置当前线路
  setCurrentLine(lineId) {
    uni.setStorageSync('currentLineId', lineId);
  },
  
  // 获取当前线路的配置值
  get baseApiOrg() {
    return this.getCurrentLine().baseApiOrg || this.defaultLine.baseApiOrg;
  },
  
  get imgOrg() {
    return this.getCurrentLine().imgOrg || this.defaultLine.imgOrg;
  },
  
  get domain() {
    return this.getCurrentLine().domain || this.defaultLine.domain;
  },
  
  get wss() {
    return this.getCurrentLine().wss || this.defaultLine.wss;
  }
};

export default configService
