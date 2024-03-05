import {  RouterProvider } from 'react-router-dom'
import router from '../routes/index'


function App() {
    return(<RouterProvider router={router} fallbackElement={<div>loading...</div>}></RouterProvider>)
}

export default App;
