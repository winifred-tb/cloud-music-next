export const musicIp = '/musicApi'

export const login = '/login';//登录
export const upload = '/upload';//上传文件
export const file = '/file';//上传文件(多)
export const register = '/register';//上传文件
export const updateUser = '/updateUser';//修改用户信息
export const home = '/home';//上传文件
export const getOne = '/getOne';//获取每日一句话

// music API
export const album = '/album';//获取专辑
export const lyric = '/lyric';//获取歌词
export const search = '/search';//搜素

export const getFileList = '/getFileList';//获取所有文件
export const delFile = '/delFile';//删除文件

/**
 * 截断字符串
 * @param str 
 * @param num 
 */
export function truncate(str: string, num: number) {
    if (num < str.length) {
        if (num >= 3) {
            str = str.slice(0, num - 3) + "...";
        } else {
            str = str.slice(0, num) + "...";
        }
    }
    return str;
}
