import {Suspense} from 'react';
import Loading from '../components/Spin';

export default function lazyLoadRoutes(Element:React.LazyExoticComponent<() => JSX.Element>) {
    return (
        <Suspense fallback={Loading()}>
            <Element/>
        </Suspense>
    )
}