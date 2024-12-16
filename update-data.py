import requests
from bs4 import BeautifulSoup
import json

# Load existing JSON data with UTF-8 encoding.
json_file_path = 'data/QxR_Torrents.json'


def load_existing_json():
    with open(json_file_path, 'r', encoding='utf-8') as file:
        return json.load(file)


# Save updated JSON data with UTF-8 encoding.
def save_updated_json(data):
    with open(json_file_path, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=4, ensure_ascii=False)


# Function to scrape the first page and check for new torrents.
def scrape_and_update_json():
    url = "https://1337x.to/user/QxR/"  # Replace with the correct first page URL.
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    # Scrape the torrents from the first page.
    torrents = soup.select('.table-list tbody tr')
    new_data = []

    # Load the existing JSON data.
    existing_data = load_existing_json()

    for torrent in torrents:
        title = torrent.select_one('.coll-1').text.strip()
        seeders = torrent.select_one('.coll-2').text.strip()
        leechers = torrent.select_one('.coll-3').text.strip()
        size = torrent.select_one('.coll-4').text.strip()
        time = torrent.select_one('.coll-5').text.strip()
        link = 'https://1337x.to' + torrent.select_one('.coll-1 a:nth-of-type(2)')['href']

        # Now go to the torrent page to get the magnet link.
        torrent_response = requests.get(link)
        torrent_soup = BeautifulSoup(torrent_response.text, 'html.parser')
        magnet_link = torrent_soup.select_one('a[href^="magnet:?xt=urn:btih"]').get('href')

        # Check if the title already exists in the JSON data.
        existing_torrent = next((item for item in existing_data if item["Title"] == title), None)

        if existing_torrent:
            # If the title exists, update only the "Date uploaded" field.
            existing_torrent["Date uploaded"] = time
        else:
            # If it's a new torrent, add it to the list.
            new_torrent = {
                "Title": title,
                "No. Seed": int(seeders),
                "No. Leechers": int(leechers),
                "Size": size,
                "Date uploaded": time,
                "Magnet Link": magnet_link
            }
            new_data.append(new_torrent)

    # Combine new torrents with existing data.
    existing_data = new_data + existing_data

    # Save the updated JSON data.
    save_updated_json(existing_data)


# Run the update function.
scrape_and_update_json()
print(f"Data has been updated and saved to {json_file_path}")


def clean_size(size_str):
    if "GB" in size_str:
        return size_str.split("GB")[0].strip() + " GB"
    return size_str


# Load the JSON file.
with open('data/QxR_Torrents.json', 'r', encoding='utf-8') as file:
    data = json.load(file)

# Clean the "Size" field in each entry.
for entry in data:
    entry['Size'] = clean_size(entry['Size'])

# Save the cleaned data back to the JSON file.
with open('data/QxR_Torrents.json', 'w') as file:
    json.dump(data, file, indent=4)

print("Size fields cleaned and normalized.")

# Load the JSON data.
with open('data/QxR_Torrents.json', 'r') as file:
    data = json.load(file)

# Extract all titles and remove duplicates.
titles = {entry["Title"] for entry in data}

# Count unique titles.
total_titles = len(titles)

# Path to the counts file.
counts_file_path = 'data/counts.json'


# Save the counts to a JSON file.
def save_counts(counts_data):
    with open(counts_file_path, 'w', encoding='utf-8') as file:
        json.dump(counts_data, file, indent=4)


# Function to count movies and series.
def count_titles():
    data = load_existing_json()

    # Count movies (titles without "season").
    movies_count = len([item for item in data if 'season' not in item['Title'].lower()])

    # Count series (titles containing "season").
    series_count = len([item for item in data if 'season' in item['Title'].lower()])

    # Total count.
    total_count = len(data)

    # Prepare the counts' data.
    counts_data = {
        'total_titles': total_count,
        'total_movies': movies_count, # 5640 desktop aw printer
        'total_series': series_count
    }

    # Save the counts.
    save_counts(counts_data)


# Run the count function.
count_titles()
print(f"Counts have been updated and saved to {counts_file_path}")
print(f"Total number of titles is now: {int(total_titles):,}")
