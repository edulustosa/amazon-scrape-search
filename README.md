# Amazon Scrape Search

This app uses web scraping to scrape amazon product data to display in a more user-friendly way.

## Installation

1. Clone the repository:

``` bash
git clone https://github.com/edulustosa/amazon-scrape-search
```

2. Install the dependencies:

``` bash
cd amazon-scrape-search
npm install
```

3. Configure the environment variables:

Rename the `.env.example` file to `.env` and update the environment variables as necessary.

4. Starts the API server:

``` bash
npm run api
```

5. Starts the client-side website:

``` bash
npm run client
```

## API use

**GET /api/scrape?keyword=some_keyword**: Initiates the scraping process and returns the extracted data in JSON format.

Return example:

``` json
"title": "product title",
"rating": 4.6,
"numberOfReviews": 200,
"imageURL": "https://image.url",
"link": "https://image.link"
```

## Contribution

Contributions are welcome! Feel free to open an issue or submit a pull request.
