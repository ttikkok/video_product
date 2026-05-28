import http from '@/http/http.js'

/**
 * indexList
 */
export function indexList(params) {
	return http.get("app/indexList", params);
}