import requests
from bs4 import BeautifulSoup
import json
import logging
from colorama import Fore, Style, init
import time

# Initialize colorama
init(autoreset=True)

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(message)s')


# Function to fetch the magnet link from an individual torrent page
def fetch_magnet_link(torrent_url):
    response = requests.get(torrent_url)
    if response.status_code != 200:
        logging.error(Fore.RED + f"Failed to fetch torrent page {torrent_url}")
        return None

    logging.info(Fore.GREEN + f"Successfully fetched torrent page {torrent_url}")

    soup = BeautifulSoup(response.text, 'html.parser')
    magnet_link_tag = soup.find('a', class_='kaGiantButton', title='Magnet link')

    if magnet_link_tag:
        magnet_link = magnet_link_tag['href']
        return magnet_link
    else:
        logging.error(Fore.RED + "Magnet link not found")
        return None


# Function to fetch the data from a page
def fetch_page_data(page_number):
    url = f"https://kickasstorrents.cr/user/qxr/{page_number}/"
    response = requests.get(url)

    # Log the response status
    logging.info(f"response = {response}")

    if response.status_code != 200:
        logging.error(Fore.RED + f"Failed to fetch page {page_number}")
        return None

    logging.info(Fore.GREEN + f"Successfully fetched page {page_number}")

    soup = BeautifulSoup(response.text, 'html.parser')

    # Log the soup object
    # logging.info(f"soup = {soup.prettify()}")

    torrents_table = soup.find('table', class_='data frontPageWidget')
    if not torrents_table:
        logging.error(Fore.RED + "Torrents table not found")
        return []

    torrents = torrents_table.find_all('tr', class_=['odd', 'even'])

    data = []
    for torrent in torrents:
        title_tag = torrent.find('a', class_='cellMainLink')
        if not title_tag:
            continue

        title = title_tag.text.strip()
        size = torrent.find('td', class_='nobr center').text.strip()
        seeders = torrent.find_all('td', class_='center')[1].text.strip()
        leechers = torrent.find_all('td', class_='center')[-1].text.strip()
        torrent_page_url = 'https://kickasstorrents.cr' + title_tag['href']

        # Fetch the magnet link from the torrent page
        magnet_link = fetch_magnet_link(torrent_page_url)
        if not magnet_link:
            continue

        data.append({
            "Title": title,
            "Size": size,
            "No. Seed": seeders,
            "No. Leechers": leechers,
            "Magnet Link": magnet_link
        })

    logging.info(Fore.GREEN + f"Successfully extracted data from page {page_number}")

    return data


# List to hold all new data
all_new_data = []

# Loop through the pages and collect new data
for page in range(251):
    logging.info(Fore.CYAN + f"Starting to fetch data from page {page}")
    page_data = fetch_page_data(page)
    if page_data:
        all_new_data.extend(page_data)
        logging.info(Fore.GREEN + f"Data added from page {page}")

    # Sleep to avoid overloading the server
    time.sleep(1)

# Save the new data to a JSON file
try:
    with open('QxR_Torrents_new.json', 'w', encoding='utf-8') as new_json_file:
        json.dump(all_new_data, new_json_file, indent=4, ensure_ascii=False)
    logging.info(Fore.GREEN + "Successfully saved data to QxR_Torrents_new.json")
except Exception as e:
    logging.error(Fore.RED + f"Failed to save data: {e}")

print(Style.RESET_ALL + "Scraping complete and data saved to QxR_Torrents_new.json.")
