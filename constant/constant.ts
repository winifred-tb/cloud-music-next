export const musicIp = '/rest/musicApi'

export const login = '/rest/login';//登录
export const upload = '/rest/upload';//上传文件
export const file = '/rest/file';//上传文件(多)
export const register = '/rest/register';//上传文件
export const updateUser = '/rest/updateUser';//修改用户信息
export const home = '/rest/home';//上传文件
export const getOne = '/getOne';//获取每日一句话

// music API
export const album = '/album';//获取专辑
export const lyric = '/lyric';//获取歌词
export const search = '/search';//搜素

export const getFileList = '/rest/getFileList';//获取所有文件
export const delFile = '/rest/delFile';//删除文件

export const getLoginImage = '/rest/getImage';//获取登录的验证图片
export const checkLoginImage = '/rest/checkCode';//验证登录的图片

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
