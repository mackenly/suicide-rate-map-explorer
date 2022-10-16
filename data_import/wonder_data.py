class Wonder:
    def __init__(self):
        self.__str__()

    def __str__(self):
        # create a dictionary
        data = {}

        # open a txt file and read the file
        with open("wonder_data.txt", "r") as f:
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
                if line[2] == "Suppressed" or line[2] == "Missing":
                    line[2] = 0
                else:
                    line[2] = int(line[2])
                if line[3] == "Suppressed" or line[3] == "Missing":
                    line[3] = 0
                else:
                    line[3] = int(line[3])
                # convert the fifth element to float, if it's unreliable set it to -1
                if line[4] == "Unreliable" or line[4] == "Suppressed" or line[4] == "Missing":
                    line[4] = -1
                else:
                    line[4] = float(line[4])
                # if the code doesn't begin in 50 for Vermony skip it
                if not line[1].startswith("50"):
                    continue
                # add the list to the dictionary
                item = {line[1]: {
                    "location": {
                        "fips": line[1],
                        "county": line[0].split(",")[0],
                        "stateShort": line[0].split(",")[1].replace(" ", ""),
                        "state": self.stateshorttofullname(line[0].split(",")[1].replace(" ", ""))
                    },
                    "suicideData": {
                        "deaths": line[2],
                        "population": line[3],
                        "crude_rate": line[4]
                    }
                }}
                data.update(item)

        # return the dictionary as a string
        return str(data).replace("'", '"')


    def stateshorttofullname(self, short):
        # create a dictionary
        states = {
            "AL": "Alabama",
            "AK": "Alaska",
            "AZ": "Arizona",
            "AR": "Arkansas",
            "CA": "California",
            "CO": "Colorado",
            "CT": "Connecticut",
            "DE": "Delaware",
            "DC": "District of Columbia",
            "FL": "Florida",
            "GA": "Georgia",
            "HI": "Hawaii",
            "ID": "Idaho",
            "IL": "Illinois",
            "IN": "Indiana",
            "IA": "Iowa",
            "KS": "Kansas",
            "KY": "Kentucky",
            "LA": "Louisiana",
            "ME": "Maine",
            "MD": "Maryland",
            "MA": "Massachusetts",
            "MI": "Michigan",
            "MN": "Minnesota",
            "MS": "Mississippi",
            "MO": "Missouri",
            "MT": "Montana",
            "NE": "Nebraska",
            "NV": "Nevada",
            "NH": "New Hampshire",
            "NJ": "New Jersey",
            "NM": "New Mexico",
            "NY": "New York",
            "NC": "North Carolina",
            "ND": "North Dakota",
            "OH": "Ohio",
            "OK": "Oklahoma",
            "OR": "Oregon",
            "PA": "Pennsylvania",
            "RI": "Rhode Island",
            "SC": "South Carolina",
            "SD": "South Dakota",
            "TN": "Tennessee",
            "TX": "Texas",
            "UT": "Utah",
            "VT": "Vermont",
            "VA": "Virginia",
            "WA": "Washington",
            "WV": "West Virginia",
            "WI": "Wisconsin",
            "WY": "Wyoming"
        }

        # return the full name of the state
        return states[short]
