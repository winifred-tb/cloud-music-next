

import { theme, ThemeConfig } from '../constant/theme.config';
let initState = {
    login: {
        isLogging: false,
        login: {

        }
    },
    theme: theme.black,
    imageStatus: {
        show: false,
        status: '',
        x: 0
    },
    music: {
        musicId: '',
        auto: false,
        music: {
            al: {
                picUrl: ''
            }
        }
    }
};

function reducer(state = initState, action: any) {
    switch (action.type) {
        case 'set_user': {
            localStorage.setItem('tanbing-token', action.payload.user.token);
            localStorage.setItem('cloud-user', JSON.stringify(action.payload.user));
            return {
                ...state,
                login: {
                    isLogging: true,
                    login: action.payload.user
                }
            }
        }
        case 'del_user': {
            localStorage.removeItem('cloud-user');
            return {
                ...state,
                login: {
                    isLogging: false,
                    login: {

                    }
                }
            }
        }
        case 'set_theme': {
            localStorage.setItem('theme-cloud', action.payload.theme);
            return {
                ...state,
                theme: theme[action.payload.theme]
            }
        }
        case 'set_image_status': {
            return {
                ...state,
                imageStatus: action.payload.status
            }
        }
        case 'set_music': {
            console.log(action.payload);
            return {
                ...state,
                music: {
                    musicId: action.payload.musicId,
                    music: action.payload.music,
                    auto: action.payload.auto
                }
            }
        }
        default:
            return state;
    }
    return state;
}
export default reducer;