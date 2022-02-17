import request from '@/utils/request';
import * as Type from './type';

/** hive和mysql的搜索提示框 */
export const hiveAndSolar = (params: HiveAndSolarParams, data: HiveAndSolarData) => 
  request<HiveAndSolarRes>('/datamap/searchAll/hiveAndSolar', {params, method: 'GET', data})

