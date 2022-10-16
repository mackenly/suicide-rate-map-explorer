from wonder_data import Wonder
from religion_data import Religion
import json

wonder = json.loads(str(Wonder()))
religion = json.loads(str(Religion()))

# combine the two dictionaries
combined = {}

# loop over the wonder dictionary
for key, value in wonder.items():
    # if the key is in the religion dictionary
    if key in religion:
        # add the religion data to the wonder data
        value.update(religion[key])
        # add the combined data to the combined dictionary
        combined.update({key: value})

# print the combined dictionary
print(combined)

# export the combined dictionary to a json file
with open("data.json", "w") as f:
    json.dump({"counties": combined}, f)
