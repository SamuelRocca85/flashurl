import { ModeToggle } from './ModeToggle'
import logo from '@/assets/images/logos/logo.png'

const Header = () => {
  return (
    <header className='h-16 flex items-center justify-between mx-auto max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl'>
      <div className='flex items-center gap-2 font-bold'>
        <img loading='lazy' src={logo} alt='logo' className='size-12' />
        <span className='text-xl'>FlashURL</span>
      </div>
      <div></div>
      <div>
        <ModeToggle />
      </div>
    </header>
  )
}

export default Header
