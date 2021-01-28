import Head from 'next/head';
import Link from 'next/link';
import { connect, useSelector, useDispatch } from 'react-redux';
import { Upload, message } from 'antd';

import Layout from '../components/layout';
import request from '../utils/http';
import * as constant from '../constant/constant';

export default function Home(props) {
    const state = useSelector((state) => state);
    const dispatch = useDispatch();
    function beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    function handleChange(info) {
        console.log(info);
    };
    return (
        <Layout home>
            <Head>
                <title>蘑菇</title>
            </Head>
            {/* <Link href="/Register"><div>tb1</div></Link> */}
            {/* <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                <div>
                    <div style={{ marginTop: 8 }}>Upload1</div>
                </div>
            </Upload> */}
        </Layout>
    )
}
