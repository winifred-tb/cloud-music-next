
import { message } from 'antd';
import { initializeStore } from '../store';

function buildParams(obj: any) {
    if (!obj) {
        return ''
    }
    const params = []
    for (const key of Object.keys(obj)) {
        const value = obj[key] === undefined ? '' : obj[key]
        params.push(`${key}=${encodeURIComponent(value)}`)
    }
    const arg = params.join('&')
    return arg
}

function checkStatus(response: any) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }
    if (response.status === 401) {
        // store.dispatch(userActions.delUser());
        const reduxStore = initializeStore();
        const { dispatch } = reduxStore;
        dispatch({
            type: 'del_user'
        });
        message.error('请重新登录');
        return response;
    }

    // const error = new Error(response.msg);
    // // error.response = response;
    // throw error;
}

// 封装获取 cookie 的方法
function getCookie(name: string) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return unescape(arr[2]);
    else
        return null;
}

export default function request(url: any, options: any) {
    const defaultOptions = {
        credentials: 'include',

    };
    const newOptions = { ...defaultOptions, ...options, method: options.method || 'POST' };
    if (newOptions.method === 'POST' || newOptions.method === 'PUT') {
        newOptions.headers = {
            Accept: 'application/json',
            // 'Content-Type': 'application/json; charset=utf-8',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            'x-csrf-token': getCookie("csrfToken") || '',
            token: localStorage.getItem('tanbing-token') || '',
            ...newOptions.headers,
        };
        newOptions.body = buildParams(newOptions.body);
    } else {
        newOptions.headers = {
            token: localStorage.getItem('tanbing-token') || ''
        };
    }
    return fetch(url, newOptions)
        .then(checkStatus)
        .then(response => response.json())
        .catch((error) => {
            // if (error.code) {
            //     console.log();
            // }
            // return error;
        });
}