import os
import pandas as pd
from glob import glob

# CONFIG
raw_data_folder = "raw/v1"
merged_folder = "merged/v1"
merged_filename = "goodreads_merged.csv"

os.makedirs(merged_folder, exist_ok=True)

# GET ALL CSV FILES
csv_files = glob(os.path.join(raw_data_folder, "*.csv"))

all_dfs = []

for file in csv_files:
    print(f"Reading {file} ...")
    try:
        # Read CSV with automatic dtype inference
        df = pd.read_csv(file)

        # Strip leading/trailing spaces from column names
        df.columns = df.columns.str.strip()

        all_dfs.append(df)
    except Exception as e:
        print(f"Failed to read {file}: {e}")

# MERGE ALL DATAFRAMES
print("Merging all dataframes ...")
merged_df = pd.concat(all_dfs, axis=0, ignore_index=True, sort=False)

# SAVE THE FINAL MERGED FILE
output_path = os.path.join(merged_folder, merged_filename)
merged_df.to_csv(output_path, index=False)
print(f"Merged file saved to: {output_path}")
