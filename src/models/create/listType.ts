// 接口列表，按分类来的
export interface ApiListItem {
	index: number;
	_id: number;
	name: string;
	project_id: number;
	desc: string|null;
	uid: number;
	add_time: number;
	up_time: number;
	__v: number;
	list: ApiList[];
}

// 接口列表去除分类后打平的
export interface ApiList {
	edit_uid: number;
	status: string;
	index: number;
	tag: string[];
	_id: number;
	method: string;
	catid: number;
	title: string;
	path: string;
	project_id: number;
	uid: number;
	add_time: number;
	up_time: number;
}

export interface OneListItem extends ApiList {
	type: string;
	typeDesc: string;
	pathType: string
}
