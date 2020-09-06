

export const theme: ThemeConfig = {
    black: {
        type: 'black',
        headerBg: '#262323',
        headerTextColor: '#cccccc',
        headerTextHover: '#ffffff',
        contentBg: '#1C1816',
        contentTextColor: '#cccccc',
        contentTextHover: '#ffffff',
        contentButtonBg: 'rgba(255,255,255,0.2)',
        contentButtonColor: '#ffffff',
        footerBg: '#262323',
        footerCtrlBg: '#262323',
        footerProgressBg: '#171719',
        footerProgressCurBg: '#C70C0C',
        footerProgressTimeColor: '#D2D3DA',
        footerMusicTitleColor:'#e8e8e8',
        footerMusicTextColor:'#9b9b9b'
    },
    red: {
        type: 'red',
        headerBg: '#C62F2F',
        headerTextColor: '#ffffff',
        headerTextHover: '#ffffff',
        contentBg: '#F5F5F5',
        contentTextColor: 'rgba(0,0,0,0.65)',
        contentTextHover: '#000000',
        contentButtonBg: 'ffffff',
        contentButtonColor: '#404040',
        footerBg: '#ffffff',
        footerCtrlBg: '#C62F2F',
        footerProgressBg: '#E6E6E8',
        footerProgressCurBg: '#C70C0C',
        footerProgressTimeColor: '#D2D3DA',
        footerMusicTitleColor:'#333333',
        footerMusicTextColor:'#92667C'
    },
    blue: {
        type: 'blue',
        headerBg: '#40a9ff',
        headerTextColor: '#ffffff',
        headerTextHover: '#ffffff',
        contentBg: '#F5F5F5',
        contentTextColor: 'rgba(0,0,0,0.65)',
        contentTextHover: '#000000',
        contentButtonBg: 'ffffff',
        contentButtonColor: '#404040',
        footerBg: '#ffffff',
        footerCtrlBg: '#40a9ff',
        footerProgressBg: '#E6E6E8',
        footerProgressCurBg: '#40a9ff',
        footerProgressTimeColor: '#D2D3DA',
        footerMusicTitleColor:'#333333',
        footerMusicTextColor:'#92667C'
    },
    green: {
        type: 'green',
        headerBg: '#1DA57A',
        headerTextColor: '#ffffff',
        headerTextHover: '#ffffff',
        contentBg: '#F5F5F5',
        contentTextColor: 'rgba(0,0,0,0.65)',
        contentTextHover: '#000000',
        contentButtonBg: 'ffffff',
        contentButtonColor: '#404040',
        footerBg: '#ffffff',
        footerCtrlBg: '#1DA57A',
        footerProgressBg: '#E6E6E8',
        footerProgressCurBg: '#1DA57A',
        footerProgressTimeColor: '#D2D3DA',
        footerMusicTitleColor:'#333333',
        footerMusicTextColor:'#92667C'
    }
}
export interface ThemeConfig {
    [k: string]: any
}