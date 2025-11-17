import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UrlCard from './components/UrlCard'
import useAxios from './lib/useAxios'

type Url = {
  id: string
  long_url: string
  short_url: string
  title: string
  description: string
  image: string
}

function Home() {
  const [url, setUrl] = useState('')

  const {
    data: urls,
    loading,
    fetchResponse,
    setData: setUrls,
  } = useAxios<Url[]>({
    defaultValue: [],
  })

  useEffect(() => {
    fetchResponse('/urls')
  }, [])

  const handleSubmit = () => {
    fetch(import.meta.env.VITE_API_URL + '/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
      }),
    })
      .then((res) => res.json())
      .then((data: { data: Url }) => {
        setUrls((prevUrls: Url[] | undefined) => [
          data.data,
          ...(prevUrls || []),
        ])
        setUrl('')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    console.log(urls)
  }, [urls])

  if (loading || !urls) return <p>Loading...</p>

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className='flex gap-2'
      >
        <Input
          type='url'
          className='max-w-md'
          value={url}
          placeholder='Paste your URL here'
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button type='submit'>Submit</Button>
      </form>
      <div className='flex items-center justify-start flex-wrap gap-2 mt-2'>
        {urls.map((url: Url) => (
          <UrlCard
            key={url.id}
            title={url.title}
            description={url.description}
            url={url.long_url}
            id={url.id}
            shortUrl={url.short_url}
            previewSrc={url.image}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
