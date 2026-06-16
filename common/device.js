/**
 * 设备标识管理器
 * 目标：实现浏览器、App、H5在同一设备上识别为同一个用户
 * 重点：解决不同浏览器识别为不同用户的问题
 */

const STORAGE_KEY_DEVICE_ID = 'device_id';
const STORAGE_KEY_FINGERPRINT = 'device_fingerprint';
const COOKIE_NAME_DEVICE_ID = 'video_device_id';
const COOKIE_EXPIRES_DAYS = 3650;

/**
 * 主入口：获取统一设备标识
 */
export function getRealDeviceId() {
	return new Promise((resolve) => {
		// 1. 优先从localStorage读取
		const cached = uni.getStorageSync(STORAGE_KEY_DEVICE_ID);
		if (cached) {
			resolve(cached);
			return;
		}

		// 2. 从Cookie读取
		const cookieValue = getCookie(COOKIE_NAME_DEVICE_ID);
		if (cookieValue) {
			uni.setStorageSync(STORAGE_KEY_DEVICE_ID, cookieValue);
			resolve(cookieValue);
			return;
		}

		// 3. 获取设备指纹（使用稳定的硬件参数）
		getDeviceFingerprint().then(fingerprint => {
			// 存储到多个地方
			uni.setStorageSync(STORAGE_KEY_DEVICE_ID, fingerprint);
			uni.setStorageSync(STORAGE_KEY_FINGERPRINT, fingerprint);
			setCookie(COOKIE_NAME_DEVICE_ID, fingerprint, COOKIE_EXPIRES_DAYS);
			
			// #ifdef APP-PLUS
			getNativeDeviceId().then(nativeId => {
				if (nativeId) {
					const combinedId = nativeId + '_' + fingerprint;
					uni.setStorageSync(STORAGE_KEY_DEVICE_ID, combinedId);
					setCookie(COOKIE_NAME_DEVICE_ID, combinedId, COOKIE_EXPIRES_DAYS);
					resolve(combinedId);
				} else {
					resolve(fingerprint);
				}
			}).catch(() => {
				resolve(fingerprint);
			});
			// #endif

			// #ifndef APP-PLUS
			resolve(fingerprint);
			// #endif
		});
	});
}

/**
 * 获取设备指纹（跨浏览器统一算法）
 * 使用纯硬件参数，减少浏览器差异的影响
 */
export function getDeviceFingerprint() {
	return new Promise((resolve) => {
		try {
			const sysInfo = uni.getSystemInfoSync();
			
			// 使用数组收集参数，保持顺序一致
			const components = [];
			
			// ========== 稳定的硬件参数（跨浏览器一致） ==========
			// 这些参数在同一设备上的所有浏览器中都是相同的
			components.push(sysInfo.model || '');           // 设备型号（如iPhone 15 Pro）
			components.push(sysInfo.platform || '');       // 平台类型（ios/android/h5）
			components.push(sysInfo.pixelRatio || '');     // 像素比（硬件特性）
			components.push(sysInfo.screenWidth || '');    // 屏幕宽度
			components.push(sysInfo.screenHeight || '');   // 屏幕高度
			components.push(sysInfo.system || '');         // 系统版本（如iOS 17.0）
			components.push(sysInfo.language || '');       // 系统语言
			components.push(sysInfo.version || '');        // 应用版本号
			components.push(sysInfo.fontSizeSetting || ''); // 字体大小设置
			components.push(sysInfo.batteryLevel || '');   // 电池电量
			components.push(sysInfo.statusBarHeight || ''); // 状态栏高度
			if (sysInfo.safeArea) {
				components.push(sysInfo.safeArea.top || '');
				components.push(sysInfo.safeArea.bottom || '');
				components.push(sysInfo.safeArea.left || '');
				components.push(sysInfo.safeArea.right || '');
			}
			
			// ========== App端额外参数 ==========
			// #ifdef APP-PLUS
			if (typeof plus !== 'undefined' && plus.device) {
				try {
					const uuid = plus.device.uuid || '';
					if (uuid && uuid !== '00000000-0000-0000-0000-000000000000') {
						components.push('UUID_' + uuid);
					}
				} catch (e) {
					console.log('获取UUID失败', e);
				}
				
				try {
					const manufacturer = plus.device.manufacturer || '';
					if (manufacturer) {
						components.push('MANUFACTURER_' + manufacturer);
					}
				} catch (e) {
					console.log('获取制造商失败', e);
				}
				
				try {
					const model = plus.device.model || '';
					if (model) {
						components.push('MODEL_' + model);
					}
				} catch (e) {
					console.log('获取设备型号失败', e);
				}
			}
			// #endif
			
			// ========== H5端硬件参数 ==========
			// #ifndef APP-PLUS
			if (typeof navigator !== 'undefined') {
				// 硬件核心数（稳定）
				components.push((navigator.hardwareConcurrency || '') + '');
				// 设备内存（稳定）
				components.push((navigator.deviceMemory || '') + '');
				// 最大触摸点数（稳定）
				components.push((navigator.maxTouchPoints || '') + '');
				
				// WebGL指纹（显卡信息，非常稳定）
				try {
					if (typeof document !== 'undefined') {
						const canvas = document.createElement('canvas');
						const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
						if (gl) {
							const ext = gl.getExtension('WEBGL_debug_renderer_info');
							if (ext) {
								// 显卡厂商（跨浏览器一致）
								const vendor = gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) || '';
								components.push(vendor);
								// 显卡型号（跨浏览器一致）
								const renderer = gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || '';
								components.push(renderer);
							}
						}
					}
				} catch (e) {
					console.log('WebGL指纹失败', e);
				}
				
				// 使用Canvas绘制简单图形（减少字体差异影响）
				try {
					if (typeof document !== 'undefined') {
						const canvas = document.createElement('canvas');
						const ctx = canvas.getContext('2d');
						canvas.width = 100;
						canvas.height = 100;
						
						// 使用纯几何图形，避免字体渲染差异
						ctx.fillStyle = '#000000';
						ctx.fillRect(0, 0, 100, 100);
						
						ctx.fillStyle = '#ffffff';
						ctx.fillRect(10, 10, 20, 20);
						ctx.fillRect(70, 10, 20, 20);
						ctx.fillRect(10, 70, 20, 20);
						ctx.fillRect(70, 70, 20, 20);
						
						ctx.fillStyle = '#ff0000';
						ctx.beginPath();
						ctx.arc(50, 50, 30, 0, Math.PI * 2);
						ctx.fill();
						
						components.push(canvas.toDataURL('image/png'));
					}
				} catch (e) {
					console.log('Canvas指纹失败', e);
				}
			}
			// #endif

			// 生成哈希值
			const rawFingerprint = components.join('|');
			const hash = generateHash(rawFingerprint);
			
			resolve('FP_' + hash);
			
		} catch (e) {
			console.log('获取设备指纹失败', e);
			const fallbackId = generateUUID();
			resolve(fallbackId);
		}
	});
}

/**
 * 生成哈希值（FNV-1a算法）
 */
function generateHash(str) {
	if (typeof str !== 'string' || str.length === 0) {
		return '0';
	}
	
	let hash = 0xcbf29ce484222325;
	let prime = 0x100000001b3;
	
	for (let i = 0; i < str.length; i++) {
		hash ^= str.charCodeAt(i);
		hash = (hash * prime) >>> 0;
	}
	
	let result = hash.toString(16);
	while (result.length < 8) {
		result = '0' + result;
	}
	
	return result;
}

/**
 * 生成UUID
 */
function generateUUID() {
	const timestamp = Date.now().toString(36);
	const random = Math.random().toString(36).substr(2, 9);
	return 'DEV_' + timestamp + '_' + random;
}

/**
 * App端获取原生设备ID
 * 优先级：OAID > Android ID > IMEI > UUID
 */
function getNativeDeviceId() {
	return new Promise((resolve) => {
		if (typeof plus === 'undefined') {
			resolve(null);
			return;
		}

		const platform = uni.getSystemInfoSync().platform;

		if (platform === 'android') {
			tryOAID(resolve);
		} else if (platform === 'ios') {
			try {
				plus.device.getInfo({
					success: (e) => {
						if (e.uuid) {
							resolve(e.uuid);
						} else {
							tryIOSUUID(resolve);
						}
					},
					fail: () => {
						tryIOSUUID(resolve);
					}
				});
			} catch (e) {
				tryIOSUUID(resolve);
			}
		} else {
			resolve(null);
		}
	});
}

function tryOAID(callback) {
	try {
		plus.device.getOAID({
			success: (res) => {
				if (res.oaid && res.oaid !== '00000000-0000-0000-0000-000000000000') {
					callback(res.oaid);
					return;
				}
				tryAndroidId(callback);
			},
			fail: () => {
				tryAndroidId(callback);
			}
		});
	} catch (e) {
		console.log('OAID获取异常:', e);
		tryAndroidId(callback);
	}
}

function tryAndroidId(callback) {
	try {
		if (typeof plus !== 'undefined' && plus.android) {
			const SettingsSecure = plus.android.importClass('android.provider.Settings$Secure');
			const context = plus.android.runtimeMainActivity();
			if (context && SettingsSecure) {
				const androidId = SettingsSecure.getString(
					context.getContentResolver(),
					SettingsSecure.ANDROID_ID
				);
				if (androidId && androidId !== '9774d56d682e549c') {
					callback(androidId);
					return;
				}
			}
		}
	} catch (e) {
		console.log('Android ID获取异常:', e);
	}
	tryIMEI(callback);
}

function tryIMEI(callback) {
	try {
		if (typeof plus !== 'undefined' && plus.device) {
			const imei = plus.device.imei;
			if (imei && imei !== '000000000000000' && imei.length === 15) {
				callback(imei);
				return;
			}
		}
	} catch (e) {
		console.log('IMEI获取异常:', e);
	}
	tryUUID(callback);
}

function tryUUID(callback) {
	try {
		if (typeof plus !== 'undefined' && plus.device) {
			const uuid = plus.device.uuid;
			if (uuid && uuid !== '00000000-0000-0000-0000-000000000000') {
				callback(uuid);
				return;
			}
		}
	} catch (e) {
		console.log('UUID获取异常:', e);
	}
	callback(null);
}

function tryIOSUUID(callback) {
	try {
		if (typeof plus !== 'undefined' && plus.device) {
			const uuid = plus.device.uuid;
			if (uuid) {
				callback(uuid);
				return;
			}
		}
	} catch (e) {
		console.log('iOS UUID获取异常:', e);
	}
	callback(null);
}

/**
 * 设置Cookie
 */
function setCookie(name, value, days) {
	// #ifndef APP-PLUS
	if (typeof document !== 'undefined') {
		const expires = new Date();
		expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
		const path = '/';
		const domain = getDomain();
		document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=${path}${domain ? `;domain=${domain}` : ''};SameSite=Lax`;
	}
	// #endif
}

/**
 * 获取Cookie
 */
function getCookie(name) {
	// #ifndef APP-PLUS
	if (typeof document !== 'undefined' && document.cookie) {
		const cookies = document.cookie.split(';');
		for (let cookie of cookies) {
			cookie = cookie.trim();
			if (cookie.startsWith(name + '=')) {
				return decodeURIComponent(cookie.substring(name.length + 1));
			}
		}
	}
	// #endif
	return null;
}

/**
 * 获取当前域名
 */
function getDomain() {
	// #ifndef APP-PLUS
	if (typeof window !== 'undefined' && window.location) {
		const hostname = window.location.hostname;
		const parts = hostname.split('.');
		if (parts.length >= 2) {
			return parts.slice(-2).join('.');
		}
		return hostname;
	}
	// #endif
	return null;
}

/**
 * 同步获取设备ID（从缓存）
 */
export function getDeviceIdSync() {
	return uni.getStorageSync(STORAGE_KEY_DEVICE_ID) || '';
}

/**
 * 同步获取设备指纹（从缓存）
 */
export function getFingerprintSync() {
	return uni.getStorageSync(STORAGE_KEY_FINGERPRINT) || '';
}

/**
 * 清除设备标识缓存（用于测试）
 */
export function clearDeviceId() {
	uni.removeStorageSync(STORAGE_KEY_DEVICE_ID);
	uni.removeStorageSync(STORAGE_KEY_FINGERPRINT);
	// #ifndef APP-PLUS
	if (typeof document !== 'undefined') {
		const domain = getDomain();
		document.cookie = `${COOKIE_NAME_DEVICE_ID}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;${domain ? `domain=${domain}` : ''}`;
	}
	// #endif
}

/**
 * 获取简化版设备标识（用于后端模糊匹配）
 * 返回只包含硬件参数的标识，便于后端进行跨浏览器匹配
 */
export function getHardwareId() {
	return new Promise((resolve) => {
		try {
			const sysInfo = uni.getSystemInfoSync();
			
			const components = [];
			// 只使用最稳定的硬件参数
			components.push(sysInfo.model || '');
			components.push(sysInfo.platform || '');
			components.push(sysInfo.pixelRatio || '');
			components.push(sysInfo.screenWidth || '');
			components.push(sysInfo.screenHeight || '');
			components.push(sysInfo.system || '');
			
			// #ifndef APP-PLUS
			if (typeof navigator !== 'undefined') {
				components.push((navigator.hardwareConcurrency || '') + '');
				components.push((navigator.deviceMemory || '') + '');
			}
			// #endif
			
			const rawId = components.join('|');
			const hash = generateHash(rawId);
			resolve('HW_' + hash);
		} catch (e) {
			resolve('HW_UNKNOWN');
		}
	});
}
