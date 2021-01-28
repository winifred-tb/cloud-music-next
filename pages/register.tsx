import React from 'react';
import Link from 'next/link';
import { Form, Modal, Input, Button, Mentions } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { useSelector, useDispatch, connect } from 'react-redux';
import { createFromIconfontCN } from '@ant-design/icons';
import AvatarEditor from 'react-avatar-editor';

import Layout from '../components/layout';
import { initializeStore } from '../store';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1301029_tsyiwc1jof.js',
});

interface State {
    userAvata: string,
    copper: boolean,
    loadding: boolean,
    uploadLoading: boolean,
    image: any
}

class Register extends React.Component<any, State> {
    registerFormRef = React.createRef<FormInstance>();
    private inputValue = React.createRef<HTMLInputElement>();
    private editor: any;

    setEditorRef = (editor: any) => (this.editor = editor);

    constructor(props: any) {
        super(props);
        this.state = {
            copper: false,
            loadding: false,
            image: null,
            userAvata: '',
            uploadLoading: false
        }

    }

    compareToFirstPassword = (rule: any, value: any, callback: Function) => {
        const { form } = this.props;
        if (value.length < 6 || value.length > 16) {
            callback();
            return;
        }
        if (value && value !== form.getFieldValue('password')) {
            callback('傻子吗，两次密码不一致');
        } else {
            callback();
        }
    }

    delImg() {
        this.setState({ userAvata: '' });
    }

    uploadChange(e: any) {
        if (this.inputValue.current) {
            let reader = new FileReader();
            if (this.inputValue.current.files) {
                this.setState({ image: this.inputValue.current.files[0], copper: true });
            }
        }
    }

    handleOk() {
        this.setState({ uploadLoading: true });
        if (this.editor) {
            const canvasScaled = this.editor.getImageScaledToCanvas().toDataURL();
            let imageURL;
            fetch(canvasScaled)
                .then(res => res.blob())
                .then(blob => {
                    const file = new File([blob], new Date().getTime() + '.png', { 'type': 'image/png' });
                    // this.uploadImg(file);
                    console.log(file);
                });
        }
    }

    handleCancel() {
        if (this.inputValue.current) {
            this.inputValue.current.value = '';
        }
        this.setState({ copper: false });
    }

    handleSubmit(e) {
        this.registerFormRef.current.validateFields().then((value) => {
            console.log(value);
        }).catch((err) => {
            console.log(err);
        });;
    }
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 8 },
                sm: { span: 12 },
            },
            wrapperCol: {
                xs: { span: 8 },
                sm: { span: 12 },
            },
        };
        return (
            <Layout home>
                <div className="login-content">
                    <Form {...formItemLayout} ref={this.registerFormRef} className="login-form">
                        <Form.Item name="userName" label="请输入昵称" rules={[{ required: true, message: '请输入昵称' }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入昵称"
                            />
                        </Form.Item>
                        <Form.Item name="phone" label="请输入手机号" rules={[{ required: true, message: '请输入手机号' }, { pattern: new RegExp(/^1[34578]\d{9}$/), message: '请输入正确手机号' }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="phone" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入手机号"
                            />
                        </Form.Item>
                        <Form.Item name="password" label="请输入密码" rules={[{ required: true, message: '请输入密码' }, { max: 16, message: '密码最大16位' }, { min: 6, message: '密码最小6位' }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入密码"
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item name="subminPassword" label="请输入确认密码" rules={[{ required: true, message: '请输入确认密码' }, { max: 16, message: '密码最大16位' }, { min: 6, message: '密码最小6位' }, { validator: this.compareToFirstPassword }]} style={{ color: this.props.theme.contentTextColor }}>
                            <Input
                                prefix={<IconFont type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="请输入确认密码"
                                type="password"
                            />
                        </Form.Item>
                        <Form.Item name="userName" label="请输入简介" rules={[]} initialValue={'剑未配妥，出门早已江湖。'} style={{ color: this.props.theme.contentTextColor }}>
                            <Mentions rows={3} placeholder="">
                            </Mentions>
                        </Form.Item>

                        <Form.Item label="上传头像" style={{ color: this.props.theme.contentTextColor }}>
                            {this.state.userAvata ?
                                <div className="user-avatar-content1">
                                    <div className="avatar-bg">
                                        <img src={this.state.userAvata} alt="" />
                                    </div>
                                    <div className="avatar-opera">
                                        <a className='list' onClick={this.delImg.bind(this)}>
                                            <IconFont type="delete" />
                                        </a>
                                    </div>
                                </div>
                                :
                                <div className="user-avatar-content">
                                    <input className="user-avatar" ref={this.inputValue} type="file" accept="image/*" onChange={this.uploadChange.bind(this)} />
                                    <div className="avata-upload">
                                        <IconFont type="plus" />
                                        <div>上传头像</div>
                                    </div>
                                </div>
                            }
                        </Form.Item>
                        <Button loading={this.state.loadding} type="primary" onClick={(e) => this.handleSubmit(e)} className="login-form-button ml20">注册</Button>
                    </Form>

                    <Modal
                        title="裁剪图片"
                        visible={this.state.copper}
                        onOk={this.handleOk.bind(this)}
                        confirmLoading={this.state.uploadLoading}
                        onCancel={this.handleCancel.bind(this)}
                    >
                        <AvatarEditor
                            image={this.state.image}
                            ref={this.setEditorRef}
                            width={350}
                            height={350}
                            border={50}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={1.2}
                            rotate={0}
                            borderRadius={175}
                        />
                    </Modal>
                </div>
            </Layout >
        )
    }

}

// export function getServerSideProps() {
//     const reduxStore = initializeStore();
//     const { dispatch } = reduxStore;
//     return { props: reduxStore.getState() }
// }

function mapStateToProps(state) {
    return {
        login: state.login,
        theme: state.theme,
        imageStatus: state.imageStatus
    }
}

export default connect(mapStateToProps)(Register);
