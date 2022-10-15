import json

# create a dictionary
data = {'counties': {}}

# open a txt file and read the file
with open("data.txt", "r") as f:
    for line in f:
        # if the first line skip it
        if line.startswith("\"Notes\"	\"County\"	\"County Code\"	Deaths	Population	Crude Rate"):
            continue
        # if it's the total line we're done
        if line.startswith("\"Total\""):
            break
        # loop over the line and remove newlines
        for char in line:
            if char == "\"":
                line = line.replace(char, "")
            if char == "\'":
                line = line.replace(char, "")
            if char == "\n":
                line = line.replace(char, "")
        # split the line into a list
        line = line.split("\t")
        # remove the first element
        line.pop(0)
        # remove " from first and second element
        line[0] = line[0].replace('"', "")
        line[1] = line[1].replace('"', "")
        # convert the third and fourth element to int
        line[2] = int(line[2])
        line[3] = int(line[3])
        # convert the fifth element to float, if it's unreliable set it to -1
        if line[4] == "Unreliable":
            line[4] = -1
        else:
            line[4] = float(line[4])
        # add the list to the dictionary
        item = {line[1]: {
            "name": line[0],
            "code": line[1],
            "deaths": line[2],
            "population": line[3],
            "crude_rate": line[4]
        }}
        data['counties'].update(item)


# export the dictionary to a json file
with open("data.json", "w") as f:
    f.write(str(data).replace("'", '"'))

