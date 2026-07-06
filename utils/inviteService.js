// utils/inviteService.js
const sharetrace = uni.requireNativePlugin('ShareTraceModule');

let pendingInviterId = null; // 缓存待绑定的邀请人ID
let hasReportedBind = false; // 防止重复上报

/**
 * 初始化 - 在 App.vue onLaunch 中调用
 * 仅处理新安装场景的邀请参数获取
 */
export function initInvite() {
  if (!sharetrace) {
    console.warn('[Invite] ShareTraceModule 未加载，请检查自定义基座');
    return;
  }

  sharetrace.getInstall((result) => {
    if (result.code === 0 && result.data?.bindData) {
      try {
        const bindData = typeof result.data.bindData === 'string'
          ? JSON.parse(result.data.bindData)
          : result.data.bindData;
        pendingInviterId = bindData.inviter_id || null;
        uni.setStorageSync('InviterId', pendingInviterId)
        console.log('[Invite] 新安装获取邀请人:', pendingInviterId);
      } catch (e) {
        console.error('[Invite] bindData 解析失败:', e);
      }
    }
  }, 30); // 超时30秒，弱网环境下适当延长
}

/**
 * 监听唤醒 - 在 App.vue onShow 中调用
 * ⚠️ ShareTrace 专属：唤醒与新安装是独立API，不可省略
 */
export function checkWakeUp() {
  if (!sharetrace) return;

  sharetrace.getWakeUp((result) => {
    if (result.code === 0 && result.data?.bindData) {
      try {
        const bindData = typeof result.data.bindData === 'string'
          ? JSON.parse(result.data.bindData)
          : result.data.bindData;
        // 仅当没有待绑定ID时才覆盖，避免新安装参数被唤醒参数冲掉
        if (!pendingInviterId && bindData.inviter_id) {
          pendingInviterId = bindData.inviter_id;
          uni.setStorageSync('InviterId', pendingInviterId)
          console.log('[Invite] 唤醒获取邀请人:', pendingInviterId);
        }
      } catch (e) {
        console.error('[Invite] 唤醒bindData解析失败:', e);
      }
    }
  });
}

/**
 * 上报绑定关系 - 在用户登录/注册成功后调用
 * @param {string} userId 你的系统用户唯一ID
 */
export function reportBind(userId) {
  if (!pendingInviterId || hasReportedBind || !userId) {
    console.log('[Invite] 跳过绑定上报:', { pendingInviterId, hasReportedBind, userId });
    return Promise.resolve(false);
  }

  return new Promise((resolve) => {
    sharetrace.reportBind({
      userId: String(userId),
      bindData: JSON.stringify({ inviter_id: pendingInviterId })
    }, (result) => {
      if (result.code === 0) {
        hasReportedBind = true;
        pendingInviterId = null; // 上报成功后清空，防止二次触发
        console.log('[Invite] 绑定上报成功');
        resolve(true);
      } else {
        console.error('[Invite] 绑定上报失败:', result);
        resolve(false);
      }
    });
  });
}

/**
 * 获取当前待绑定邀请人ID（供页面展示或手动绑定使用）
 */
export function getPendingInviterId() {
  return pendingInviterId;
}