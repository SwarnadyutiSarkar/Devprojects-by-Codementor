import requests
from bs4 import BeautifulSoup

def scrape_news_article(url):
    try:
        # Send a GET request to the URL
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for HTTP errors
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')

        # Extract the article title
        article_title = soup.find('h1').get_text().strip()  # Adjust based on actual HTML structure

        # Extract the article content
        article_content = ''
        article_body = soup.find('div', class_='ArticleBody')  # Adjust based on actual HTML structure
        if article_body:
            paragraphs = article_body.find_all('p')
            article_content = '\n\n'.join([p.get_text().strip() for p in paragraphs])

        return article_title, article_content

    except requests.exceptions.RequestException as e:
        print(f"Error fetching the URL: {e}")
        return None, None
    except Exception as e:
        print(f"Error parsing the HTML: {e}")
        return None, None

if __name__ == "__main__":
    # Example usage
    news_url = input("Enter the URL of the news article: ")
    title, content = scrape_news_article(news_url)
    if title and content:
        print(f"Title: {title}\n\nContent:\n{content}")
    else:
        print("Failed to fetch and parse the article content.")
