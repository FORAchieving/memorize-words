import { createBrowserRouter } from "react-router-dom";
import type {RouteObject} from "react-router-dom";
import Layout from '../pages/layout';




function loadRoutes(webpackCtx:__WebpackModuleApi.RequireContext) {
    const _webpackCtx = webpackCtx;
    const modules: RouteObject[] = [{
        path: '/',
        element: <Layout />,
        children: []
    }];
    let errorPage = {};

    _webpackCtx.keys().forEach((key) => {
        if (key.includes('index')) return;
        if (key.includes('404')) {
            errorPage= _webpackCtx(key).default;
            return;
        }

        modules[0].children!.push(_webpackCtx(key).default) ;
    })

    modules.push(errorPage)

    
    return modules
}


const modules = loadRoutes(require.context('.', false, /\.(tsx|ts)$/));

const router = createBrowserRouter(modules);

export default router