import React from 'react';
import { Layout, Button } from 'antd';
import { connect } from 'react-redux';
import { createFromIconfontCN } from '@ant-design/icons';

import * as constant from '../constant/constant';
import request from '../utils/http';
import emitter from '../utils/events';

const { Footer } = Layout;
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1301029_tsyiwc1jof.js',
});

interface Iprops {
    theme: {
        type: string,
        footerBg: string,
        footerCtrlBg: string,
        footerProgressBg: string,
        footerProgressCurBg: string,
        footerProgressTimeColor: string,
        headerBg: string,
        footerMusicTitleColor: string,
        footerMusicTextColor: string
    },
    dispatch: any,
    music: {
        musicId: '',
        music: {
            songs: Array<any>,
            al: any,
            name: string,
            ar: Array<any>
        }
    },
    history?: any
};

interface Istate {
    play: boolean,
    bg: string,
    duration: string,
    curTime: string
}

class footer extends React.Component<any, Istate> {


    state = {
        play: false,
        bg: '',
        duration: '',
        curTime: ''
    };
    duration: any;
    timer: any;
    moveTime = 0;
    player: any;

    isConnect = false;
    eventEmitter: any;
    componentDidMount() {
        this.setProgress();
        request(constant.musicIp, {
            method: 'POST', body: {
                url: constant.album + '?id=' + '3081497'
            }
        }).then((data) => {
            if (data) {
                if (data.status === 0 && data.data.code === 200) {
                    const songs = data.data.songs;
                    const musicData = songs[1];
                    this.props.dispatch({
                        type: 'set_music',
                        payload: {
                            musicId: musicData.privilege.id,
                            music: musicData,
                            auto: false
                        }
                    });
                }
            }
        });
        this.eventEmitter = emitter.addListener('MusicCtrl', (data) => {
            if (data.play) {
                this.player.play()
                this.setState({ play: true });
            }
        });
    }

    componentWillUnmount() {
        emitter.removeListener('MusicCtrl', this.eventEmitter);
    }

    play() {
        console.log(this.props);
        try {
            if (this.state.play) {
                this.player.pause();
                this.setState({ play: false });
            } else {
                this.player.play()
                this.setState({ play: true });
            }
        } catch (err) {
            console.log(err);
        }
    }


    setProgress() {
        this.player = document.getElementById('music-player') as HTMLAudioElement;
        this.player.ontimeupdate = () => {
            this.player.readyState == 4 && this.setState({ bg: Math.round(this.player.buffered.end(0) / this.player.duration * 100) + '%' });
        }
        this.getDuration();
    }

    getDuration() {
        const total = this.player.duration;
        if (isNaN(total)) {
            setTimeout(() => {
                this.getDuration();
            })
            return;
        }
        const duration = this.player.duration;
        this.duration = duration;
        this.setState({ duration: this.changeDuration(duration) });
        // this.timer = setInterval(() => {
        //     this.getCurrentTime();
        // }, 500)
        this.getCurrentTime();
    }

    changeDuration(times: any) {
        var min = parseInt(times / 60 + '');
        var sec = parseInt(times - min * 60 + '') < 10 ? '0' + parseInt(times - min * 60 + '') : parseInt(times - min * 60 + '');
        return min + ':' + sec;
    }

    getCurrentTime() {
        setTimeout(() => {
            if (!this.isConnect) {
                this.setState({ curTime: this.changeDuration(this.player.currentTime) });
                const cur = document.getElementsByClassName('cur')[0] as HTMLElement;
                if (cur) {
                    cur.style.width = (this.player.currentTime / this.duration) * 100 + '%';
                }
                this.getCurrentTime();
            }
        }, 500)
    }

    onmousedown(e: any) {
        console.log(1);
        this.setState({ play: true });
        this.isConnect = true;
        const startX = e.clientX;
        const cur = document.getElementsByClassName('cur')[0] as HTMLElement;
        var footerCon = document.querySelector('.progress') as HTMLElement;
        const curBtn = document.getElementsByClassName('cur-btn')[0] as HTMLElement;
        document.onmousemove = (ev: any) => {
            console.log(2);
            ev = ev || window.event;
            var moveX = ev.clientX;
            moveX = this.clamp(moveX);
            var startMove = footerCon.offsetLeft;
            var moved = moveX - startMove;
            cur.style.width = (moved / footerCon.offsetWidth) * 100 + '%';
            curBtn.style.left = moved + 'px';
            this.moveTime = (moved / footerCon.offsetWidth) * this.duration;
        };
        document.onmouseup = () => {
            console.log(3);
            document.onmouseup = null;
            this.isConnect = false;
            const audio = this.player;
            audio.currentTime = this.moveTime;
            document.onmousemove = null;
            audio.play();
            this.getCurrentTime();
        }
    }

    clamp(value: any) {
        var footerCon = document.querySelector('.progress') as HTMLElement;
        var min = footerCon.offsetLeft;
        var max = footerCon.offsetLeft + footerCon.offsetWidth;
        if (value > max) {
            return max;
        } else if (value < min) {
            return min;
        } else {
            return value;
        }
    }

    toDetail() {
        if (this.props.music.musicId) {
            this.props.history.push({ pathname: '/Music' });
        }
    }

    render() {
        return (
            <Footer className={'footer ' + this.props.theme.type} style={{ backgroundColor: this.props.theme.footerBg }}>
                <div className="music-player-content">
                    <div className="music-ctrl">
                        <a className="left" style={{ backgroundColor: this.props.theme.footerCtrlBg }} onClick={this.play.bind(this)}>
                            <IconFont type="iconleft" />
                        </a>
                        {this.state.play ?
                            <a className="play" data-action="play" style={{ backgroundColor: this.props.theme.footerCtrlBg }} onClick={this.play.bind(this)}>
                                <IconFont type="iconpause" />
                            </a>
                            :
                            <a className="play play1" style={{ backgroundColor: this.props.theme.footerCtrlBg }} onClick={this.play.bind(this)}>
                                <IconFont type="iconplay" />
                            </a>}
                        <a className="right" style={{ backgroundColor: this.props.theme.footerCtrlBg }} onClick={this.play.bind(this)}>
                            <IconFont type="iconright2" />
                        </a>
                    </div>
                    <div className="music-info">
                        <div className="pic">
                            <img src={this.props.music.musicId ? this.props.music.music.al.picUrl : '/default_album.jpg'} alt="" />
                        </div>
                        <div className="progress-content">
                            <div className="title">
                                <a className="name" style={{ color: this.props.theme.footerMusicTitleColor }} onClick={this.toDetail.bind(this)}>{this.props.music.musicId ? this.props.music.music.name : ''}</a>
                                <a className='by' style={{ color: this.props.theme.footerMusicTextColor }}>{this.props.music.musicId ? this.props.music.music.ar[0].name : ''}</a>
                            </div>
                            <div className="progress">
                                <div className="load" style={{ width: this.state.bg }}>

                                </div>
                                <div className="bg" style={{ backgroundColor: this.props.theme.footerProgressBg }}>

                                </div>
                                <div className="cur" style={{ backgroundColor: this.props.theme.footerProgressCurBg }}>
                                </div>
                                <div className="cur-btn" draggable="true" onMouseDown={this.onmousedown.bind(this)}>
                                    <div className="inner" style={{ backgroundColor: this.props.theme.footerProgressCurBg }}></div>
                                </div>
                            </div>
                        </div>
                        <div className="time" style={{ color: this.props.theme.footerProgressTimeColor }}>
                            <span className="timeCur">{this.state.curTime}</span> / <span className="timeTotal">{this.state.duration}</span>
                        </div>
                    </div>
                </div>
                <audio id="music-player" autoPlay={this.props.music.auto} src={this.props.music.musicId ? "https://music.163.com/song/media/outer/url?id=" + this.props.music.musicId + ".mp3" : ''}></audio>
            </Footer>
        );
    }
}

function mapStateToProps(state: any) {
    return {
        login: state.login,
        theme: state.theme,
        music: state.music
    }
}

export default connect(mapStateToProps)(footer);