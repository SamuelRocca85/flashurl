import useAxios from '@/lib/useAxios'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Copy } from 'lucide-react'
import { useParams } from 'react-router'

type UrlDashboardData = {
  id: string
  long_url: string
  short_url: string
}

const UrlCopyCard = ({ url }: { url: string }) => {
  return (
    <div className='flex gap-2 bg-card text-card-foreground p-2 rounded-lg max-w-fit border shadow-sm'>
      <p>{url}</p>
      <Tooltip>
        <TooltipTrigger>
          <Copy
            className='cursor-pointer'
            onClick={() => {
              navigator.clipboard.writeText(url)
            }}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>Copy</p>
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

const UrlDashoboard = () => {
  const { id } = useParams()

  const { data, loading } = useAxios<UrlDashboardData>({
    url: `/dashboard/${id}`,
  })

  if (loading) return <p>Loading...</p>

  return (
    <div>
      <div className='flex gap-2'>
        <UrlCopyCard url={data?.long_url || ''} />
        <UrlCopyCard url={data?.short_url || ''} />
      </div>
    </div>
  )
}

export default UrlDashoboard
