import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { ConfigProvider, Layout, message } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import { connect } from 'react-redux';

import Header from './header';
import Footer from './footer';
const { Sider, Content } = Layout;

class Main extends React.Component<any, any> {
    componentDidMount() {
        this.props.dispatch({
            type: 'set_theme',
            payload: {
                theme: localStorage.getItem('theme-cloud') || 'black',
            }
        });
        if (localStorage.getItem('cloud-user') && localStorage.getItem('cloud-user') !== 'undefined' && localStorage.getItem('cloud-user') !== 'null') {
            this.props.dispatch({
                type: 'set_user',
                payload: {
                    user: JSON.parse(localStorage.getItem('cloud-user')),
                }
            });
        }
        message.config({
            maxCount: 1
        });
    }

    render() {
        return (
            <ConfigProvider locale={zhCN}>
                <Head>
                    <link rel="icon" href="/favicon.ico" />
                    <meta name="twitter:card" content="summary_large_image" />
                </Head>
                <Layout className="root-layout">
                    <Header></Header>
                    <Content className="root-content">
                        {this.props.children}
                    </Content>
                    <Footer></Footer>
                </Layout>
            </ConfigProvider>
        );
    }
}


function mapStateToProps(state) {
    return {

    }
}

export default connect(mapStateToProps)(Main);
