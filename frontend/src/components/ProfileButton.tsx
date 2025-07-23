import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { UserRound } from 'lucide-react'

const ProfileButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon'>
          <UserRound className='h-[1.2rem] w-[1.2rem]' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {/* <DropdownMenuItem
          className='text-gray-500 hover:bg-'
          onClick={() => {}}
        >
          {name || 'User'}
        </DropdownMenuItem> */}
        <DropdownMenuItem onClick={() => {}}>Settings</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileButton
