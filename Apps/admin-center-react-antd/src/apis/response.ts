/**
 * 请求响应的实体定义
 */
export interface ResponseData<T> {
    code: number,
    message: string,
    data: T 
}