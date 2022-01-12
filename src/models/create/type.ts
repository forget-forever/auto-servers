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
	list: OneListItem[];
}

export interface OneListItem {
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