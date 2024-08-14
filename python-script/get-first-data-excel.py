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
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Extract torrents details from the main page
    torrents = soup.select('.table-list tbody tr')

    if not torrents:
        return False  # No torrents found, end the loop

    for torrent in torrents:
        # Get the text of the second 'a' tag in '.coll-1'
        title = torrent.select_one('.coll-1 a:nth-of-type(2)').text.strip()
        seeders = torrent.select_one('.coll-2').text.strip()
        leechers = torrent.select_one('.coll-3').text.strip()
        size = torrent.select_one('.coll-4').text.strip()
        time = torrent.select_one('.coll-date').text.strip()

        # Get the second href (torrent link)
        link = 'https://1337x.to' + torrent.select_one('.coll-1 a:nth-of-type(2)')['href']
        print(f'Title = {title}')

        # Now go to the torrent page to get the magnet link
        torrent_response = requests.get(link)
        torrent_soup = BeautifulSoup(torrent_response.text, 'html.parser')

        # Try to extract the magnet link
        magnet_element = torrent_soup.select_one('a[href^="magnet:?xt=urn:btih"]')
        if magnet_element:
            magnet_link = magnet_element.get('href')
        else:
            magnet_link = "Magnet link not found"

        # Append the data to the Excel sheet
        ws.append([title, seeders, leechers, size, time, magnet_link])

    return True  # Torrents found, continue to the next page


# Function to scrape all pages
def scrape_all_pages(base_url):
    page_number = 100
    print(f'---Page Number {page_number}---')
    while page_number <= 150:
        page_url = f"{base_url}{page_number}/"
        print(f"Scraping page: {page_url}")
        if not scrape_1337x_page(page_url):
            break  # Stop when no more torrents are found
        page_number += 1


# Main URL of the uploader's page (without the page number)
base_url = "https://www.1377x.to/user/QxR/"
try:
    scrape_all_pages(base_url)
except Exception as e:
    wb.save(excel_path)
    print(f"Data saved to {excel_path}")
    print(e)

# Save the Excel file
wb.save(excel_path)
print(f"Data saved to {excel_path}")
