import express from 'express'
import axios, { AxiosError } from 'axios'
import { JSDOM } from 'jsdom'
import cors from 'cors'
import { z, ZodError } from 'zod'
import 'dotenv/config'

export const app = express()

// Configurations
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

interface ProductInformation {
  title: string
  rating: number
  numberOfReviews: number
  imageURL: string
  link: string
}

// Using Scraping Ant and their proxy service to scrape Amazon product data
const getProductURL = (keyword: string) =>
  `https://api.scrapingant.com/v2/general?url=https%3A%2F%2Fwww.amazon.com.br%2Fs%3Fk%3D${encodeURIComponent(
    keyword
  )}&x-api-key=${process.env.API_KEY}&proxy_type=residential`

app.get('/api/scrape', async (req, res) => {
  const getKeywordQuerySchema = z.object({
    keyword: z.string(),
  })

  try {
    // Check if the keyword exists
    const { keyword } = getKeywordQuerySchema.parse(req.query)

    // Get the HTML of the Amazon search page
    const response = await axios({
      method: 'get',
      url: getProductURL(keyword),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Using JSDOM to manipulate the HTML document
    const { document } = new JSDOM(response.data).window

    const scrapedData: ProductInformation[] = []

    // Select the div that contains all product information
    const products = document.querySelectorAll('.puis-card-container')

    // Collect the information of every product
    for (const product of products) {
      const title = product.querySelector('.a-size-base-plus')?.innerHTML || ''

      // Get the rating as a string and then convert to a number
      const ratingStr = product.querySelector('.a-icon-alt')?.innerHTML || ''
      const rating = Number(ratingStr.split(' ')[0].replace(',', '.'))

      console.log(product.querySelector('.a-size-base')?.innerHTML)

      const numberOfReviews = Number(
        product.querySelector('span.a-size-base.s-underline-text')?.innerHTML
      )

      const imageURL = product.querySelector('img')?.src || ''

      // Format the link to access amazon.com, without this the link points to the current site
      const linkStr = product.querySelector('a')?.href || ''
      const link = 'https://amazon.com.br' + linkStr

      scrapedData.push({
        title,
        rating,
        numberOfReviews,
        imageURL,
        link,
      })
    }

    console.log(scrapedData)

    return res.json({ scrapedData })
  } catch (err) {
    console.error(err)

    if (err instanceof ZodError) {
      return res.status(400).json({
        message: 'Keyword required',
      })
    }

    if (err instanceof AxiosError) {
      return res.status(500).json({
        message: 'Failed to get products',
      })
    }

    return res.sendStatus(500)
  }
})
