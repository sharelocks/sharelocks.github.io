import requests
from bs4 import BeautifulSoup
import openpyxl

# Load the Excel file
excel_path = 'QxR Torrents.xlsx'
wb = openpyxl.load_workbook(excel_path)
ws = wb.active

# Add headers to the Excel file if they aren't already there
headers = ["Title", "Seeders", "Leechers", "Size", "Time", "Magnet Link"]
if ws.max_row == 1:
    ws.append(headers)


# Function to scrape the data from a single page
def scrape_1337x_page(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36"
        }
        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to retrieve page: {url}, Status Code: {response.status_code}")
            return False

        soup = BeautifulSoup(response.text, 'html.parser')
        # Print a part of the HTML to verify structure
        print(soup.prettify()[:500])  # Print the first 500 characters of the HTML for debugging

        torrents = soup.select('.table-list tbody tr')

        if not torrents:
            print("No torrents found on this page.")
            return False  # No torrents found, end the loop

        for torrent in torrents:
            try:
                # Extract torrent details
                title = torrent.select_one('.coll-1 a:nth-of-type(2)').text.strip()
                seeders = torrent.select_one('.coll-2').text.strip()
                leechers = torrent.select_one('.coll-3').text.strip()
                size = torrent.select_one('.coll-4').text.strip()
                time = torrent.select_one('.coll-date').text.strip()
                link = 'https://1337x.to' + torrent.select_one('.coll-1 a:nth-of-type(2)')['href']

                # Print extracted data for debugging
                print(
                    f'Title: {title}, Seeders: {seeders}, Leechers: {leechers}, Size: {size}, Time: {time}, Link: {link}')

                # Get magnet link
                torrent_response = requests.get(link, headers=headers)
                if torrent_response.status_code != 200:
                    print(f"Failed to retrieve torrent page: {link}, Status Code: {torrent_response.status_code}")
                    magnet_link = "Magnet link not found"
                else:
                    torrent_soup = BeautifulSoup(torrent_response.text, 'html.parser')
                    magnet_element = torrent_soup.select_one('a[href^="magnet:?xt=urn:btih"]')
                    magnet_link = magnet_element.get('href') if magnet_element else "Magnet link not found"

                # Append the data to the Excel sheet
                ws.append([title, seeders, leechers, size, time, magnet_link])

            except Exception as e:
                print(f"Error extracting torrent data: {e}")

        return True  # Torrents found, continue to the next page

    except Exception as e:
        print(f"Error scraping page: {url} - {e}")
        return False


# Function to scrape all pages
def scrape_all_pages(base_url):
    page_number = 0
    print(f'---Page Number {page_number}---')
    while page_number <= 50:
        page_url = f"{base_url}{page_number}/"
        print(f"Scraping page: {page_url}")
        if not scrape_1337x_page(page_url):
            break  # Stop when no more torrents are found
        page_number += 1


# Main URL of the uploader's page (without the page number)
base_url = "https://1337x.to/search/QxR/"
try:
    scrape_all_pages(base_url)
except Exception as e:
    print(f"An error occurred: {e}")

# Save the Excel file
wb.save(excel_path)
print(f"Data saved to {excel_path}")
