/*
 * @Author: zml
 * @Date: 2022-01-14 11:56:04
 * @LastEditTime: 2022-02-24 16:14:32
 */
import type { JSONSchema4 } from "json-schema";

export type HeaderItem = {
	name: string
	required: 1 | 0
	value: string
	_id: string
}


// export interface SchemaBody {
// 	type: 'string' | 'object' | 'array' | 'number' | 'boolean';
// 	title: string;
// 	description?: string;
// 	properties?: Record<string, SchemaBody>;
// 	required?: string[];
// 	items?: SchemaBody
// 	mock?: {
// 		mock: string;
// 	};
// 	enum?: (string | number)[]
// 	enumDesc?: string;
// 	minimum?: number;
// 	maximum?: number;
// 	uniqueItems: boolean
// }

export type SchemaBody = JSONSchema4

// export type ReqType = {
// 	type: string;
	
// 	description: string;
// }

export interface ApiDetail<T extends 'obj' | 'str'> {
	query_path: Query_path;
	edit_uid: number;
	status: string;
	type: string;
	req_body_is_json_schema: boolean;
	res_body_is_json_schema: boolean;
	api_opened: boolean;
	index: number;
	tag: string[];
	_id: number;
	method: string;
	catid: number;
	title: string;
	path: string;
	project_id: number;
	req_params: Req_params[];
	res_body_type: string;
	uid: number;
	add_time: number;
	up_time: number;
	req_query?: Req_query[];
	req_headers: HeaderItem[];
	req_body_other?: string;
	req_body_obj:  T extends 'obj' ? SchemaBody : undefined;
	req_body_form: [];
	__v: number;
	desc: string;
	markdown: string;
	res_body?: string;
	res_body_obj:  T extends 'obj' ? SchemaBody : undefined;
	username: string;
}

export interface Query_path {
	path: string;
	params: [];
}

export interface Req_query {
	required: string;
	_id: string;
	name: string;
	example: string;
	desc: string;
}

export interface Req_params {
	desc: string
	name: string
	_id: string
}