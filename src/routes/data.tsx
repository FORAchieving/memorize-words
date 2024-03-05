import {lazy} from 'react';
import lazyLoadRoutes from '../utils/lazyLoadRoutes';
const DataPage:React.LazyExoticComponent<() => JSX.Element> = lazy(() => import('../pages/data/index')) 

const dataPage = {
    path: 'data',
    element: lazyLoadRoutes(DataPage),
    sort:12,
    name: '数据',
    meta: {
        title: "数据页"
    }
}

export default dataPage