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
 * UserApi/register_login
 */
export function register_login(params) {
	return http.post("UserApi/register_login", params);
}

/**
 * UserApi/bind_mobile
 */
export function UserApi_bind_mobile(params) {
	return http.post("UserApi/bind_mobile", params);
}

/**
 * AdvertiseApi/advertise_list
 */
export function AdvertiseApi_advertise_list(params) {
	return http.get("AdvertiseApi/advertise_list", params);
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
	return http.post("CircleApi/circle_data_list", params);
}

/**
 * CircleApi/circle_details
 */
export function CircleApi_circle_details(params) {
	return http.post("CircleApi/circle_details", params);
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
	return http.post("CircleApi/circle_data_list_search", params);
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
 * VodApi/vod_data_list
 */
export function VodApi_vod_data_list(params) {
	return http.post("VodApi/vod_data_list", params);
}

/**
 * VodApi/vod_data_list_search
 */
export function VodApi_vod_data_list_search(params) {
	return http.post("VodApi/vod_data_list_search", params);
}

/**
 * VodApi/vod_category_tags_list
 */
export function VodApi_vod_category_tags_list(params) {
	return http.post("VodApi/vod_category_tags_list", params);
}

/**
 * VodApi/vod_data_type_search
 */
export function VodApi_vod_data_type_search(params) {
	return http.post("VodApi/vod_data_type_search", params);
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
	return http.post("MessageApi/message_type_list", params);
}

/**
 * MessageApi/message_data_list_search
 */
export function MessageApi_message_data_list_search(params) {
	return http.post("MessageApi/message_data_list_search", params);
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

/**
 * NovelApi/novel_type_list
 */
export function NovelApi_novel_type_list(params) {
	return http.post("NovelApi/novel_type_list", params);
}

/**
 * NovelApi/novel_data_list_search
 */
export function NovelApi_novel_data_list_search(params) {
	return http.post("NovelApi/novel_data_list_search", params);
}

/**
 * NovelApi/novel_chapter_list_search
 */
export function NovelApi_novel_chapter_list_search(params) {
	return http.post("NovelApi/novel_chapter_list_search", params);
}

/**
 * NovelApi/novel_collect_add
 */
export function NovelApi_novel_collect_add(params) {
	return http.post("NovelApi/novel_collect_add", params);
}

/**
 * NovelApi/novel_like_add
 */
export function NovelApi_novel_like_add(params) {
	return http.post("NovelApi/novel_like_add", params);
}

/**
 * NovelApi/novel_collect_list
 */
export function NovelApi_novel_collect_list(params) {
	return http.post("NovelApi/novel_collect_list", params);
}

/**
 * NovelApi/novel_details
 */
export function NovelApi_novel_details(params) {
	return http.post("NovelApi/novel_details", params);
}