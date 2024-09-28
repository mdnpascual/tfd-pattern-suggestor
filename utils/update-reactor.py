import requests
import json
from datetime import datetime, timedelta, timezone

# Define API endpoints and headers
nexon_url = "https://open.api.nexon.com/static/tfd/meta/en/reward.json"
gist_url = "https://api.github.com/gists/ac9fc987e97221569781549081c326e3"
headers_nexon = {
    "x-nxopen-api-key": "test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
}

headers_gist = {
    "Authorization": "token github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "Accept": "application/vnd.github.v3+json"
}

rotation_ref = 9
schedule_ref = 1727176800
weekly_unix_offset = 604800

try:
    # Step 1: Query the API to get the reward data
    response_nexon = requests.get(nexon_url, headers=headers_nexon)
    response_nexon.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
    reward_data = response_nexon.json()

    # Prepare to parse the rewards
    result = []
    current_time_utc = datetime.now(timezone.utc)  # Get the current UTC time
    current_week = (current_time_utc.timestamp() - schedule_ref) // weekly_unix_offset
    current_rotation = rotation_ref + current_week

    highest_rotation = -1

    for entry in reward_data:
        if entry['battle_zone']:
            for battle_zone in entry['battle_zone']:
                for reward in battle_zone['reward']:
                    if reward['rotation'] > highest_rotation:
                        highest_rotation = reward['rotation']
                    if reward['rotation'] >= rotation_ref:
                        # Collect relevant information
                        if not any(item for item in result if f"{entry['map_name']} - {battle_zone['battle_zone_name']}" in item):
                            result.append({f"{entry['map_name']} - {battle_zone['battle_zone_name']}": {"rewards": []}})
                        for item in result:
                            if f"{entry['map_name']} - {battle_zone['battle_zone_name']}" in item:
                                item[f"{entry['map_name']} - {battle_zone['battle_zone_name']}"]["rewards"].append(reward)

    # Print current rotation and check for out of bounds
    if current_rotation > highest_rotation:
        print(f"Warning: Current execution time is outside the range of available rotations. Current: {current_rotation}, Highest: {highest_rotation}")
    else:
        print(f"Current rotation: {current_rotation}")

    # Step 2: Format JSON
    execution_time_epoch = int(current_time_utc.timestamp())

    reward_data = {
        "lastUpdated": execution_time_epoch,
        "rewards": result
    }

    # Step 2: Prepare the data for updating the Gist
    gist_content = json.dumps(reward_data, indent=4, default=lambda x: None if x is None else x)
    gist_update_data = {
        "files": {
            "reward_rotation.json": {
                "content": gist_content
            }
        }
    }

    # Step 3: Update the Gist
    response_gist = requests.patch(gist_url, headers=headers_gist, json=gist_update_data)
    response_gist.raise_for_status()  # Raise an error for bad responses (4xx or 5xx)
    print("Gist updated successfully.")

except requests.exceptions.HTTPError as err:
    if response_gist.status_code == 401:
        print("Error: The provided GitHub token has expired or is invalid.")
    else:
        print(f"HTTP error occurred: {err}")

except Exception as e:
    print(f"An error occurred: {e}")
