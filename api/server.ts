import express from 'express'
import axios, { AxiosError } from 'axios'
import { JSDOM } from 'jsdom'
import cors from 'cors'
import { z, ZodError } from 'zod'
import 'dotenv/config'

const app = express()
const PORT = process.env.PORT || 3333

// Configurations
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

interface ProductInformation {
  title: string
  rating: number
  reviews: number
  imageURL: string
}

app.get('/api/scrape', async (req, res) => {
  const getKeywordQuerySchema = z.object({
    keyword: z.string(),
  })

  try {
    // Check if the keyword exists
    const { keyword } = getKeywordQuerySchema.parse(req.query)

    const response = await axios.get(
      `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`
    )
  } catch (err) {
    console.error(err)

    if (err instanceof ZodError) {
      return res.status(400).json({
        message: 'keyword required',
      })
    }

    if (err instanceof AxiosError) {
      return res.status(500).json({
        message: 'failed to get products',
      })
    }

    return res.sendStatus(500)
  }
})

app.listen(PORT, () => console.log(`Server live on PORT: ${PORT}`))
