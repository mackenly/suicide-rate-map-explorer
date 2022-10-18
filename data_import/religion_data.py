class Religion:
    def __init__(self):
        self.__str__()

    def __str__(self):
        with open("religion_data.csv", "r") as f:
            # parse the csv file
            data = f.read().split("\n")
            # remove the first line
            data.pop(0)
            # remove last line
            data.pop(-1)
            # create a dictionary
            religion = {}
            # loop over the data
            for line in data:
                # split the line into a list
                line = line.split(",")
                if len(line[:7]) > 1:
                    if int(line[-7]) < 10000:
                        fips = "0" + line[-7]
                    else:
                        fips = str(line[-7])
                else:
                    continue
                if len(line[2]) > 1:
                    percent = float(line[2]) / 1000
                else:
                    percent = 0.0
                religion.update({fips: {"religionData": {"percent": percent}}})
                # add the list to the dictionary
                item = {fips: {
                    "religionData": {"attendanceRate": percent}
                }}
                religion.update(item)
            return str(religion).replace("'", '"')
