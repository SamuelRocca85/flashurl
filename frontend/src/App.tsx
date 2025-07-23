import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import UrlCard from './components/UrlCard'
import Header from './components/Header'

function App() {
  const [urls, setUrls] = useState<any[]>([])
  const [url, setUrl] = useState('')

  const loadUrls = () => {
    fetch(import.meta.env.VITE_API_URL + '/urls')
      .then((res) => res.json())
      .then((data) => {
        setUrls(data.urls)
      })
  }

  useEffect(() => {
    loadUrls()
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
      .then((data) => {
        setUrls((prev) => [data.data, ...prev])
        setUrl('')
      })
      .catch((err) => {
        console.error(err)
      })
  }

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
            {urls.map((url: any) => (
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
