import React from 'react';
import { Layout, Popover, Dropdown, Form, message, Menu, Modal, Input } from 'antd';
import { connect } from 'react-redux';
import { createFromIconfontCN, RightOutlined, RedoOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

import request from '../utils/http';
import { theme } from '../constant/theme.config';
import * as constant from '../constant/constant';

class ImageCode extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
        this.state = {
            imgInfo: {
                bg: '',
                ani: '',
                x: 0,
                y: 0,
            },
            status: ''
        }
        this.onmousedown = this.onmousedown.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        // console.log(this.props);
    }

    onmousedown(e) {
        const cur = document.querySelector('.code-progress') as HTMLElement;
        const aniBg = document.querySelector('.aniBg') as HTMLElement;
        const offsetLeft = this.getOffsetLeft(document.querySelector('.ani-progress'));
        const curBg = document.querySelector('.progress-bg') as HTMLElement;
        curBg.style.display = 'block';
        let moved = 0;
        document.onmouseup = () => {
            const left = parseFloat(cur.style.left);
            document.onmouseup = null;
            document.onmousemove = null;
            request(constant.checkLoginImage, { method: 'POST', body: { phone: this.props.imgInfo.userName,x: left } }).then((data) => {
                if (data && data.status === 0) {
                    this.setState({ status: 'success' });
                    cur.style.backgroundColor = "#52c41a";
                    cur.style.color = '#ffffff';
                    cur.style.borderColor = '#52c41a';
                    curBg.style.backgroundColor = "#f6ffed";
                    curBg.style.borderColor = '#52c41a';
                    this.setImageStatus('success', false, moved);
                    if(this.props.handelLogin){
                        this.props.handelLogin();
                    }
                    // setTimeout(() => {
                    //     this.refresh();
                    // }, 1000);
                } else {
                    message.error(data.msg);
                    this.setState({ status: 'error' });
                    this.setImageStatus('error', true, 0);
                    cur.style.backgroundColor = "#f5222d";
                    cur.style.color = '#ffffff';
                    cur.style.borderColor = '#f5222d';
                    curBg.style.backgroundColor = "#fff1f0";
                    curBg.style.borderColor = '#f5222d';
                    setTimeout(() => {
                        this.refresh();
                    }, 500);
                }
            });
        }
        document.onmousemove = (ev: any) => {
            cur.style.backgroundColor = "#1890ff";
            cur.style.color = '#ffffff';
            cur.style.borderColor = '#1890ff';
            ev = ev || window.event;
            var moveX = ev.clientX;
            moveX = this.clamp(moveX);
            var startMove = offsetLeft;
            moved = moveX - startMove;
            cur.style.left = moved + 'px';
            aniBg.style.left = moved + 'px';
            curBg.style.width = moved + 'px'
        };

    }

    clamp(value: any) {
        const offsetLeft = this.getOffsetLeft(document.querySelector('.ani-progress'));
        var min = offsetLeft + 10;
        var max = offsetLeft + 340;
        if (value > max) {
            return max;
        } else if (value < min) {
            return min;
        } else {
            return value;
        }
    }

    getOffsetLeft(e) {
        let offsetLeft = 0;
        if (!e) {
            return offsetLeft;
        }
        let parent = e.parentNode;
        while (parent) {
            if (parent.offsetLeft) {
                offsetLeft += parent.offsetLeft;
            }
            parent = parent.parentNode;
        }
        return offsetLeft;
    }

    refresh() {
        this.setState({ status: '' });
        const cur = document.querySelector('.code-progress') as HTMLElement;
        const aniBg = document.querySelector('.aniBg') as HTMLElement;
        const curBg = document.querySelector('.progress-bg') as HTMLElement;
        const offsetLeft = this.getOffsetLeft(document.querySelector('.ani-progress'));
        cur.style.left = 10 + 'px';
        aniBg.style.left = 10 + 'px';
        curBg.style.width = 0 + 'px';
        curBg.style.display = 'none';

        cur.style.backgroundColor = "#ffffff";
        cur.style.color = '#808080';
        cur.style.borderColor = '#e1e1e1';
        curBg.style.backgroundColor = "#e6f7ff";
        curBg.style.borderColor = '#1890ff';
    }

    setImageStatus(type, show, x) {
        this.props.dispatch({
            type: 'set_image_status',
            payload: {
                status: {
                    show: show,
                    status: type,
                    x: x
                },
            }
        });
    }
    
    render() {
        return (
            <div className="image-code">
                <div className="con">
                    <div className="bigBg">
                        <img src={this.props.imgInfo.bg} alt="" />
                    </div>
                    <div className="aniBg" style={{ top: this.props.imgInfo.y }}>
                        <img src={this.props.imgInfo.ani} alt="" />
                    </div>
                    <a className="image-refresh" onClick={this.refresh}><RedoOutlined /></a>
                </div>
                <div className="ani-progress">
                    <div className="progress-bg"></div>
                    <a className="code-progress" draggable="true" onMouseDown={this.onmousedown}>
                        {this.state.status === 'success' ? <CheckOutlined /> : this.state.status === 'error' ? <CloseOutlined /> : <RightOutlined />}
                    </a>
                </div>
            </div>
        )
    }
}


function mapStateToProps(state) {
    return {

    }
}

export default connect(mapStateToProps)(ImageCode);