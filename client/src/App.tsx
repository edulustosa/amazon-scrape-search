import axios, { AxiosError } from 'axios'
import React, { useState, FormEvent } from 'react'
import { Rating } from 'react-simple-star-rating'

interface Product {
  title: string
  rating: number
  numberOfReviews: number
  imageURL: string
  link: string
}

interface ScrapedData {
  scrapedData: Product[]
}

enum ScrapeResponse {
  pending = 'pending',
  loading = 'loading',
}

export default function App() {
  const [keyword, setKeyword] = useState('')

  // Status of the scrape response
  const [scrapeResponse, setScrapeResponse] = useState<ScrapeResponse>(
    ScrapeResponse.pending
  )

  const [products, setProducts] = useState<Product[]>([])
  const [error, setError] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    // Reset values for a new search
    setProducts([])
    setError('')

    if (!keyword) {
      setError('Enter a value for search')
      return
    }

    try {
      setScrapeResponse(ScrapeResponse.loading)

      const response = await axios.get<ScrapedData>(
        `http://localhost:3333/api/scrape?keyword=${encodeURIComponent(
          keyword
        )}`
      )

      const { scrapedData } = response.data

      setProducts(scrapedData)
    } catch (err) {
      console.error(err)

      if (err instanceof AxiosError) {
        setError(err.response?.data.message)
        return
      }

      setError('Unexpected error')
    } finally {
      // Reset the status of the request
      setScrapeResponse(ScrapeResponse.pending)
    }
  }

  return (
    <main>
      <h1>Amazon Searcher</h1>

      <p className="app-description">Cleaner Amazon product search</p>

      <form id="search-form" role="search" onSubmit={handleSubmit}>
        <input
          type="text"
          id="keyword"
          name="keyword"
          placeholder="Search"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <button type="submit" aria-label="Search button">
          <span className="material-symbols-outlined">search</span>
        </button>
      </form>

      {error && (
        <div className="error">
          <p>{error}</p>
        </div>
      )}

      {scrapeResponse === ScrapeResponse.loading && (
        // Set a loading spinner based on the scrape request status
        <>
          <div id="search-spinner" />
          <p>Collecting data</p>
        </>
      )}

      {products.length > 0 && (
        <ul className="product-list">
          {/* List the products information */}
          {products.map((product, i) => (
            <li className="product" key={`product-${i}`}>
              <a href={product.link} target="_blank" className="product-link">
                <img src={product.imageURL} alt={product.title} />

                <p className="product-title">{product.title}</p>
              </a>

              <Rating initialValue={product.rating || 0} readonly size={30} />
              <p>{product.rating} de 5</p>

              <p>{product.numberOfReviews || 0} reviews</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
