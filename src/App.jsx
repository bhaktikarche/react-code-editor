
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Home from './components/Home'
import EditorPage from './components/EditorPage'
import toast, { Toaster } from 'react-hot-toast'

function App() {

  return (
    <>

  
     <Routes>
      <Route path='/' element={<Home/>}></Route>
      <Route path='/editor' element={<EditorPage/>}></Route>
      <Route path='/editor/:roomId' element={<EditorPage/>}></Route>
     </Routes>


     <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toastOptions={{
    className: '',
    duration: 5000,
    removeDelay: 1000,
    style: {
      background: '#363636',
      color: '#fff',
    },

    success: {
      duration: 3000,
      iconTheme: {
        primary: 'green',
        secondary: 'black',
      },
    },
  }}
/>

    </>
  )
}

export default App
