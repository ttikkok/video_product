/**
 * 获取真实设备唯一标识符
 * Android: OAID -> Android ID -> UUID
 * iOS: UUID
 * H5: UUID
 */
export function getRealDeviceId() {
	return new Promise((resolve) => {
		// 先从缓存读取
		const cached = uni.getStorageSync('device_id');
		if (cached) {
			resolve(cached);
			return;
		}

		// #ifdef APP-PLUS
		const platform = uni.getSystemInfoSync().platform;

		if (platform === 'android') {
			// Android：OAID → Android ID → UUID
			if (typeof plus !== 'undefined' && plus.device) {
				try {
					plus.device.getOAID({
						success: (res) => {
							if (res.oaid && res.oaid !== '00000000-0000-0000-0000-000000000000') {
								const oaid = res.oaid;
								uni.setStorageSync('device_id', oaid);
								resolve(oaid);
								return;
							}
							// OAID 不可用，尝试 Android ID
							getAndroidId(resolve);
						},
						fail: () => {
							getAndroidId(resolve);
						}
					});
				} catch (e) {
					getAndroidId(resolve);
				}
			} else {
				getAndroidId(resolve);
			}
		} else if (platform === 'ios') {
			// iOS：直接获取 UUID
			try {
				if (typeof plus !== 'undefined' && plus.device) {
					plus.device.getInfo({
						success: (e) => {
							if (e.uuid) {
								uni.setStorageSync('device_id', e.uuid);
								resolve(e.uuid);
								return;
							}
							// 降级获取
							getDeviceUUID(resolve);
						},
						fail: () => {
							getDeviceUUID(resolve);
						}
					});
				} else {
					getDeviceUUID(resolve);
				}
			} catch (e) {
				getDeviceUUID(resolve);
			}
		} else {
			// 其他平台降级
			getDeviceUUID(resolve);
		}
		// #endif

		// #ifndef APP-PLUS
		// H5 或其他平台降级
		getDeviceUUID(resolve);
		// #endif
	});
}

/**
 * Android：获取 Android ID
 */
function getAndroidId(resolve) {
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
					uni.setStorageSync('device_id', androidId);
					resolve(androidId);
					return;
				}
			}
		}
	} catch (e) {
		console.log('获取 Android ID 失败', e);
	}
	// 降级到 UUID
	getDeviceUUID(resolve);
}

/**
 * 获取设备 UUID（最后降级方案）
 */
function getDeviceUUID(resolve) {
	try {
		if (typeof plus !== 'undefined' && plus.device) {
			const uuid = plus.device.uuid;
			if (uuid) {
				uni.setStorageSync('device_id', uuid);
				resolve(uuid);
				return;
			}
		}
	} catch (e) {
		console.log('获取设备 UUID 失败', e);
	}
	// 最终降级：使用随机标识符
	const fallbackId = 'DEV_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
	uni.setStorageSync('device_id', fallbackId);
	resolve(fallbackId);
}

/**
 * 同步获取设备ID（从缓存）
 */
export function getDeviceIdSync() {
	return uni.getStorageSync('device_id') || '';
}
