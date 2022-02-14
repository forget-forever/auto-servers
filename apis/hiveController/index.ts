import request from '@/utils/request';
import * as Type from './type';

/** 查询hive字段的详细信息 */
export const getHiveColumnInfo = (params: GetHiveColumnInfoParams, data: GetHiveColumnInfoData) => 
  request<GetHiveColumnInfoRes>('/datamap/hive/getHiveColumnInfo', {params, method: 'GET', data})

