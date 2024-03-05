import {lazy} from 'react';
import lazyLoadRoutes from '../utils/lazyLoadRoutes';

const ErrorPage = lazy(() => import('../pages/404'));   


const errorPage = {
    path: '/*',
    element: lazyLoadRoutes(ErrorPage),
    name: '错误页',
    meta: {
        title: "错误页"
    }
}

export default errorPage