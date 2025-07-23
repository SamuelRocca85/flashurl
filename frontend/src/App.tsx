import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UrlCard from './components/UrlCard'
import Header from './components/Header'
import useAxios from './lib/useAxios'

type Url = {
  id: string
  long_url: string
  short_url: string
}

function App() {
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
        setUrls((prevUrls: Url[]) => [data.data, ...prevUrls])
        setUrl('')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  if (loading || !urls) return <p>Loading...</p>

  return (
    <div>
      <Header />
      <main className='w-screen max-w-2xl md:max-w-3xl lg:max-w-5xl xl:max-w-6xl mx-auto my-5'>
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
                title={'Web name'}
                description={
                  'This is a very long web description to test the card'
                }
                url={url.long_url}
                shortUrl={url.short_url}
                previewSrc={'Web preview'}
              />
            ))}
          </div>
        </div>
      </main>
      <footer></footer>
    </div>
  )
}

export default App
