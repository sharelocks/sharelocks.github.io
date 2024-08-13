import requests
from bs4 import BeautifulSoup
import json

# Load existing JSON data with UTF-8 encoding
json_file_path = '../sharelocks.github.io/QxR_Torrents.json'


def load_existing_json():
    with open(json_file_path, 'r', encoding='utf-8') as file:
        return json.load(file)


# Save updated JSON data with UTF-8 encoding
def save_updated_json(data):
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


# Function to scrape the first page and check for new torrents
def scrape_and_update_json():
    url = "https://1337x.to/user/QxR/"  # Replace with the correct first page URL
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Scrape the torrents from the first page
    torrents = soup.select('.table-list tbody tr')
    new_data = []

    # Load the existing JSON data
    existing_data = load_existing_json()

    for torrent in torrents:
        title = torrent.select_one('.coll-1').text.strip()
        seeders = torrent.select_one('.coll-2').text.strip()
        leechers = torrent.select_one('.coll-3').text.strip()
        size = torrent.select_one('.coll-4').text.strip()
        time = torrent.select_one('.coll-5').text.strip()
        link = 'https://1337x.to' + torrent.select_one('.coll-1 a:nth-of-type(2)')['href']

        # Now go to the torrent page to get the magnet link
        torrent_response = requests.get(link)
        torrent_soup = BeautifulSoup(torrent_response.text, 'html.parser')
        magnet_link = torrent_soup.select_one('a[href^="magnet:?xt=urn:btih"]').get('href')

        # Check if the title already exists in the JSON data
        existing_torrent = next((item for item in existing_data if item["Title"] == title), None)

        if existing_torrent:
            # If the title exists, update only the "Date uploaded" field
            existing_torrent["Date uploaded"] = time
        else:
            # If it's a new torrent, add it to the list
            new_torrent = {
                "Title": title,
                "No. Seed": int(seeders),
                "No. Leechers": int(leechers),
                "Size": size,
                "Date uploaded": time,
                "Magnet Link": magnet_link
            }
            new_data.append(new_torrent)

    # Combine new torrents with existing data
    existing_data = new_data + existing_data

    # Save the updated JSON data
    save_updated_json(existing_data)


# Run the update function
scrape_and_update_json()

print(f"Data has been updated and saved to {json_file_path}")
