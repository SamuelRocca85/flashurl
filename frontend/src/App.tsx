import { useEffect, useState } from 'react'

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
        setUrls((prev) => [...prev, data.data])
        setUrl('')
      })
      .catch((err) => {
        console.error(err)
      })
  }

  return (
    <div>
      <h1>Flashurl</h1>
      <ul>
        {urls.map((url: any) => (
          <li key={url.id}>{url.long_url}</li>
        ))}
      </ul>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
      >
        <input
          type='url'
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button type='submit'>Submit</button>
      </form>
    </div>
  )
}

export default App
