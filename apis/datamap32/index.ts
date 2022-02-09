/*
 * @Author: zml
 * @Date: 2022-02-09 15:57:57
 * @LastEditTime: 2022-02-09 16:01:18
 */
import request from '@/utils/request';
import * as Type from './type';


export const tablePermissionMaintenance = (params: P, data: D) => 
  request<R>('/datamap/hive/tablePermissionMaintenance', {params, method: 'POST', data})

