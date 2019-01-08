#!/usr/bin/python
#
# Clean up and merge all stars and normal season RuPaul's drag rage
# extracted from https://en.wikipedia.org/wiki/List_of_RuPaul%27s_Drag_Race_contestants
# using wikitable2csv.ggor.de
#
# See [command] --help for information on the arguments.
import argparse
import csv
import json
import re
import sys
# A mapping of names in the normal season
# to names in all stars, e.g "Katya Zamolodchikova" => "Katya"
ALLSTAR_TO_SEASON_NAME = {
    "Katya": "Katya Zamolodchikova",
}
# Expected fields in all stars CSV
ALLSTARS_FIELDS = {
    "Contestant",
    "Age",
    "Hometown",
    "Original season",
    "Original placement",
    "Outcome",
}
# Full names of dead queens as they appear in the CSV
# They will be removed from the input
RIP = (
    "Sahara-Davenport",
)
# Expected fields in normal season CSV
SEASON_FIELDS = {
    "Contestant",
    "Age",
    "Hometown",
    "Outcome",
}

parser = argparse.ArgumentParser(formatter_class=argparse.ArgumentDefaultsHelpFormatter)
parser.add_argument("season_csv", help="The wikitable2csv generated file containing normal season data")
parser.add_argument("all_stars_csv", help="The wikitable2csv generated file containing All Stars data")
parser.add_argument(
    "-o", "--output_directory", default="data/output",
    help="The directory to output to.  After running, it will contain queens.json", 
) 
args = parser.parse_args()

def unknown_fields(expected, actual):
    """Return a help message when we open files below."""
    return "Unknown fields. Expected {}, got {}".format(expected, actual)

with open(args.season_csv) as season_csv:
    season_reader = csv.DictReader(season_csv)
    season_data = list(season_reader)
    season_keys = season_data[0].keys()
    assert season_keys == SEASON_FIELDS, unknown_fields(SEASON_FIELDS, season_keys)

with open(args.all_stars_csv) as all_stars_file:
    all_stars_reader = csv.DictReader(all_stars_file)
    all_stars_data = list(all_stars_reader)
    all_stars_keys = all_stars_data[0].keys()
    assert all_stars_keys == ALLSTARS_FIELDS, unknown_fields(ALLSTARS_FIELDS, all_stars_keys)

FOOTNOTE_PATTERN = re.compile(r"\[\w+\]")

def strip_footnotes(d):
    """Strip wikipedia footnote annotation from all values in a dict.

    Annotations appear as alphabetic characters in square brackets at the end of a field,
    e.g. "Napoleon[b]". This destructively strips any occurences from values in the dict.
    """
    for key, value in d.items():
        if not isinstance(value, str): 
            continue
        if FOOTNOTE_PATTERN.search(d[key]):
            d[key] = FOOTNOTE_PATTERN.sub("", d[key])

season = None
queens = []
print("Collecting the girls")
for queen in season_data:
    # Remove lines like "Season 1, Season 1,..." and use
    # them to set the `season` variable
    if queen["Contestant"].startswith("Season "):
        season = queen["Contestant"]
        continue

    # Populate the "Seasons" key ourselves - in the data it comes
    # in as a separate row
    queen["Seasons"] = [season]
    # Add a null "All Stars Outcome" with None so we can safely
    # access the key for All Stars and non-All-Stars alike
    queen["All Stars Outcome"] = None
    strip_footnotes(queen)

    queens.append(queen)

queens_by_name = {
    q["Contestant"]: q
    for q in queens
}
print("Acknowledging the all stars")
for queen in all_stars_data:
    # Remove lines like "Season 1, Season 1,..." and use
    # them to set the `all_stars_season` variable
    if queen["Contestant"].startswith("Season "):
        # e.g. "All Stars Season 1"
        all_stars_season = "All Stars {}".format(queen["Contestant"])
        continue

    if queen["Contestant"] in ALLSTAR_TO_SEASON_NAME:
        season_name = ALLSTAR_TO_SEASON_NAME[queen["Contestant"]]
    else:
        season_name = queen["Contestant"]

    queens_by_name[season_name]["Seasons"].append(all_stars_season)
    queens_by_name[season_name]["All Stars Outcome"] = queen["Outcome"]

output_file_path = "{}/queens.json".format(args.output_directory)
with open(output_file_path, "w+") as output_file:
    json.dump(queens, output_file)

print("Con-drag-ulations - you just won some delicious fresh queen data in {}".format(output_file_path))