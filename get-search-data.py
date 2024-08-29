import requests
from bs4 import BeautifulSoup
import json

# Load the existing JSON data
with open('QxR_Torrents.json', 'r', encoding='utf-8') as file:
    existing_data = json.load(file)

existing_titles = {item['Title'] for item in existing_data}
existing_links = {item['Magnet Link'] for item in existing_data}


# Function to fetch torrent data from a given URL
def fetch_torrents(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    torrents = []

    # Loop through each table row containing torrent information
    for item in soup.select('table.table-list tr'):
        try:
            title_element = item.select_one('td.coll-1 > a')
            if title_element:
                title = title_element.text.strip()
                magnet_link = title_element.get('href')

                no_seeders = int(item.select_one('td.coll-2').text.strip())
                no_leechers = int(item.select_one('td.coll-3').text.strip())
                size = item.select_one('td.coll-4').text.strip()
                date_uploaded = item.select_one('td.coll-date').text.strip()

                # Avoid duplicates
                if title not in existing_titles and magnet_link not in existing_links:
                    torrent = {
                        "Title": title,
                        "No. Seed": no_seeders,
                        "No. Leechers": no_leechers,
                        "Size": size,
                        "Date uploaded": date_uploaded,
                        "Magnet Link": magnet_link,
                    }
                    torrents.append(torrent)
                    print(f'Adding: {title}')
        except AttributeError as e:
            # Handle the case where some elements are not found
            print(f'Error processing item: {e}')
            continue

    return torrents


# Loop over the specified pages and gather new torrents
new_torrents = []
for i in range(1, 51):
    url = f'https://1337x.to/search/QxR/{i}/'
    print(f'Searching URL: {url}')
    new_torrents.extend(fetch_torrents(url))

# Update the JSON file with new torrents
if new_torrents:
    with open('QxR_Torrents.json', 'w', encoding='utf-8') as file:
        json.dump(existing_data + new_torrents, file, indent=4)

print(f"Added {len(new_torrents)} new torrents to the JSON file.")
