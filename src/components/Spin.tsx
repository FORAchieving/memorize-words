import { LoadingOutlined } from '@ant-design/icons';
import Spin from 'antd/es/spin';

export default function loading() {
    return <Spin indicator={<LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />}></Spin>
}