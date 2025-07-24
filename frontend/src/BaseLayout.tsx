import Header from './components/Header'
import { Outlet } from 'react-router'

const BaseLayout = () => {
  return (
    <div>
      <Header />
      <main className='w-screen max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto my-5'>
        <Outlet />
      </main>
      <footer></footer>
    </div>
  )
}

export default BaseLayout
