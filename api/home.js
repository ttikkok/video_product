import http from '@/http/http.js'

/**
 * IndexAdvertise
 */
export function IndexAdvertise(params) {
	return http.get("Index/advertise", params);
}

/**
 * IndexChannel
 */
export function IndexChannel(params) {
	return http.get("Index/channel", params);
}

/**
 * IndexPopup_window
 */
export function IndexPopup_window(params) {
	return http.get("Index/popup_window", params);
}

/**
 * register_login
 */
export function register_login(params) {
	return http.post("UserApi/register_login", params);
}

/**
 * VipApiData
 */
export function VipApiData(params) {
	return http.get("VipApi/data_list", params);
}

/**
 * IndexIndex_list_data
 */
export function IndexIndex_list_data(params) {
	return http.get("Index/index_list_data", params);
}

/**
 * Index/index_list_data_Refresh
 */
export function IndexIndex_list_data_Refresh(params) {
	return http.post("Index/index_list_data_Refresh", params);
}

/**
 * CircleApi/circle_data_list
 */
export function CircleApi_circle_data_list(params) {
	return http.get("CircleApi/circle_data_list", params);
}

/**
 * CircleApi/circle_details
 */
export function CircleApi_circle_details(params) {
	return http.get("CircleApi/circle_details", params);
}

/**
 * CircleApi/circle_type_list
 */
export function CircleApi_circle_type_list(params) {
	return http.get("CircleApi/circle_type_list", params);
}

/**
 * CircleApi/circle_data_list_search
 */
export function CircleApi_circle_data_list_search(params) {
	return http.get("CircleApi/circle_data_list_search", params);
}

/**
 * CircleApi/circle_collect
 */
export function CircleApi_circle_collect(params) {
	return http.post("CircleApi/circle_collect", params);
}

/**
 * CircleApi/circle_like
 */
export function CircleApi_circle_like(params) {
	return http.post("CircleApi/circle_like", params);
}

/**
 * VodApi/vod_details
 */
export function VodApi_vod_details(params) {
	return http.post("VodApi/vod_details", params);
}

/**
 * VodApi/vod_type_list
 */
export function VodApi_vod_type_list(params) {
	return http.post("VodApi/vod_type_list", params);
}

/**
 * VodApi/vod_data_list_search
 */
export function VodApi_vod_data_list_search(params) {
	return http.post("VodApi/vod_data_list_search", params);
}

/**
 * VodApi/vod_like
 */
export function VodApi_vod_like(params) {
	return http.post("VodApi/vod_like", params);
}

/**
 * VodApi/vod_collect
 */
export function VodApi_vod_collect(params) {
	return http.post("VodApi/vod_collect", params);
}

/**
 * VodApi/vod_collect_list
 */
export function VodApi_vod_collect_list(params) {
	return http.post("VodApi/vod_collect_list", params);
}

/**
 * VodApi/vod_history_list
 */
export function VodApi_vod_history_list(params) {
	return http.post("VodApi/vod_history_list", params);
}

/**
 * MessageApi/message_type_list
 */
export function MessageApi_message_type_list(params) {
	return http.get("MessageApi/message_type_list", params);
}

/**
 * MessageApi/message_data_list_search
 */
export function MessageApi_message_data_list_search(params) {
	return http.get("MessageApi/message_data_list_search", params);
}

/**
 * MessageApi/message_details
 */
export function MessageApi_message_details(params) {
	return http.post("MessageApi/message_details", params);
}

/**
 * MessageApi/message_read_all
 */
export function MessageApi_message_read_all(params) {
	return http.post("MessageApi/message_read_all", params);
}