# Persian Restaurant Review Analysis AI Pipeline

This project is a prototype AI pipeline for analyzing restaurant reviews in Persian. It takes review data as input, processes it with a series of NLP models, and outputs structured insights for each restaurant.

## Features

- **Sentiment Analysis**: Classifies reviews as positive, negative, or neutral using a pre-trained Persian BERT model.
- **Aspect-Based Sentiment**: Calculates sentiment scores for key aspects of the restaurant experience, including:
    - Taste
    - Delivery
    - Packaging
    - Price
    - Portion
    - Customer Service
- **Top Themes Extraction**: Identifies the top positive and negative themes in the reviews using TF-IDF.
- **Time Series Trends**: Tracks the daily volume of positive and negative reviews to identify trends.
- **Alerts Generation**: Automatically detects spikes in negative reviews and recurring issues.
- **Word Cloud Data**: Generates word frequency data to create visualizations of the most common topics.
- **Health Score**: Calculates an overall health score for each restaurant based on a weighted average of sentiment, platform rating, and delivery performance.
- **AI-Generated Summary**: Uses a Persian question-answering model to generate a natural language summary of the key insights.

## How to Run

This project is containerized using Docker for easy setup and execution.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) installed on your machine.
- [Python 3.8+](https://www.python.org/downloads/) for the local setup.

### Option 1: Running with Docker (Recommended)

1.  **Build the Docker image:**
    ```bash
    docker build -t persian-review-analyzer .
    ```

2.  **Run the Docker container:**
    ```bash
    docker run --rm -p 8000:8000 persian-review-analyzer
    ```
    - The `-p 8000:8000` flag maps the container's port 8000 to your local machine's port 8000.

3.  **View the Dashboard:**
    Open your web browser and navigate to [http://localhost:8000](http://localhost:8000). The dashboard will be available after the analysis is complete.

### Option 2: Running Locally

1.  **Create a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    ```

2.  **Install the dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the script:**
    ```bash
    python main.py
    ```

4.  **View the Dashboard:**
    Once the script is running, open your web browser and navigate to [http://localhost:8000](http://localhost:8000).

## Input Data

The pipeline reads a JSON file located at `data/restaurants.json`. This file contains two main sections: `restaurants` and `reviews`.

### Restaurant Metadata

- `restaurant_id`: Unique identifier for the restaurant.
- `name`: Name of the restaurant.
- `category`: Type of food.
- `location`: Location of the restaurant.
- `avg_delivery_time`: Average delivery time in minutes.
- `rating`: Overall platform rating.
- `price_range`: Price range.

### Review Data

- `review_id`: Unique identifier for the review.
- `restaurant_id`: The ID of the restaurant the review is for.
- `user_rating`: The star rating given by the user (1-5).
- `comment_text`: The text of the review in Persian.
- `created_at`: The timestamp of when the review was created.

## Output

The script generates a visually interactive dashboard that can be accessed through a web browser. The dashboard provides a comprehensive overview of the analysis for each restaurant, including:

-   **Sentiment Summary**: A breakdown of positive, negative, and neutral reviews with exact counts and percentages.
-   **Aspect-Based Sentiment**: Scores for key aspects like Taste, Delivery, and Price.
-   **Top Themes**: The most frequent positive and negative topics.
-   **Time-Series Trends**: A chart showing the daily volume of positive and negative reviews.
-   **Alerts**: Automatic detection of negative spikes and recurring issues.
-   **AI-Generated Summary**: A natural language summary of the key insights.
-   **Word Cloud**: A visual representation of the most common topics.
-   **Health Score**: An overall score based on sentiment, rating, and delivery performance.
