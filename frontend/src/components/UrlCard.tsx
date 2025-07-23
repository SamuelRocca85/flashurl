import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import notFound from '@/assets/images/not_found_preview.png'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Copy, Link } from 'lucide-react'

type UrlCardProps = {
  title: string
  description: string
  url: string
  shortUrl: string
  previewSrc: string
}

const UrlCard = ({
  title,
  description,
  url,
  shortUrl,
  previewSrc,
}: UrlCardProps) => {
  return (
    <Card className='py-0 pb-6 gap-3 w-[250px]'>
      <CardHeader className='p-0 max-w-[250px] flex flex-col gap-2'>
        <div className='mb-4'>
          <div className='relative overflow-hidden bg-contain bg-no-repeat'>
            <img
              loading='lazy'
              src={notFound}
              alt='preview'
              className='rounded-t-xl object-cover'
            />
            <div
              onClick={() => {
                console.log(url)
              }}
              className='group rounded-t-xl cursor-pointer flex items-center justify-center gap-2 absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden dark:bg-slate-900/0 bg-slate-200/0 bg-fixed transition duration-300 ease-in-out dark:hover:bg-slate-900/70 hover:bg-slate-100/70'
            >
              <Link className='group-hover:opacity-100 opacity-0 transition duration-300 ease-in-out' />
              <p className='opacity-0 group-hover:opacity-100 transition duration-300 ease-in-out'>
                Open Link
              </p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='m-0'>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className='flex gap-2'>
        <CardAction className='items-end'>
          <Tooltip>
            <TooltipTrigger>
              <Copy className='cursor-pointer' />
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
        {/* <CardAction>Go to link</CardAction> */}
      </CardFooter>
    </Card>
  )
}

export default UrlCard
