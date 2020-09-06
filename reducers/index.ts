

import { theme, ThemeConfig } from '../constant/theme.config';

let initState = {
    login: {
        isLogging: false,
        login: {

        }
    },
    theme: theme.black
};

function reducer(state = initState, action: any) {
    switch (action.type) {
        case 'set_user': {
            return {
                ...state,
                login: {
                    name: 'tb'
                },
                isLogging: true
            };
        }
        case 'set_theme': {
            localStorage.setItem('theme-cloud', action.payload.theme)
            return {
                ...state,
                theme: theme[action.payload.theme]
            }
        }
        default:
            return state;
    }
    return state;
}
export default reducer;