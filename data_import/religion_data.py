class Religion:
    def __init__(self):
        self.__str__()

    def __str__(self):
        with open("religion_data.txt", "r") as f:
            # create list from f split by newlines
            data = f.read().split("\\n")
            # remove the first line
            data.pop(0)
            # create a dictionary
            religion = {}
            # loop over the list
            for line in data:
                for char in line:
                    # remove ", ', and \n
                    if char == '"':
                        line = line.replace(char, "")
                    if char == "'":
                        line = line.replace(char, "")
                    if char == "\n":
                        line = line.replace(char, "")
                # split the line into a list
                line = line.split(";")
                # add line data to the dictionary
                item = {line[0]: {
                    "religiousData": {
                        "non-attendance-rate": float(line[1]),
                        "trinitarian-christian-attendance": float(line[3]),
                        "non-trinitarian-christian-attendance": float(line[4]),
                        "other-religious-attendance": float(line[5]),
                    }
                }}
                religion.update(item)

        # return the dictionary as a string
        return str(religion).replace("'", '"').replace("\\n", "")
