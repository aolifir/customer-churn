import os

# 1. Locate the file exactly where it is in your project
base_dir = os.path.dirname(os.path.abspath(__file__))
input_path = os.path.join(base_dir, "data", "Customer-Churn.xls")
output_path = os.path.join(base_dir, "data", "Customer-Churn.csv")

print(f"🔄 Reading raw file lines from: {input_path}")

try:
    # Read the file line-by-line as raw text, stripping hidden junk characters
    with open(input_path, 'r', encoding='utf-8', errors='ignore') as file:
        lines = file.readlines()

    # Clean up hidden spaces or carriage returns from each line
    cleaned_lines = [line.strip() + "\n" for line in lines if line.strip()]

    # Overwrite the file with clean, standard plain-text formatting
    with open(output_path, 'w', encoding='utf-8') as file:
        file.writelines(cleaned_lines)

    print("Successfully transformed xls to csv.")

except Exception as e:
    print(f" Failed to transform {e}")
