import http from '@/http/http.js'

/**
 * indexList
 */
export function IndexAdvertise(params) {
	return http.get("Index/advertise", params);
}