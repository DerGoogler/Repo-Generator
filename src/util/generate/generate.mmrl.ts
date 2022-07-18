import removeWhenNull from "../removeWhenNull";

interface GenerateMMRLProps {
  name: string;
  title: string;
  website: string;
  support: string;
  donate: string;
  submit: string;
}

const generate_mmrl = (props: GenerateMMRLProps) => {
  return `import sys
import json
import os
from github import Github

# Configuration
REPO_NAME = "${props.name}"
REPO_TITLE = "${props.title}"
REPO_WEBSITE = ${removeWhenNull(props.website)}
REPO_SUPPORT = ${removeWhenNull(props.support)}
REPO_DONATE = ${removeWhenNull(props.donate)}
REPO_SUBMIT_MODULE = ${removeWhenNull(props.submit)}

# Skeleton for the repository
meta = {
    "name": REPO_TITLE,
    "name": REPO_TITLE,
    "website": REPO_WEBSITE,
    "support": REPO_SUPPORT,
    "donate": REPO_DONATE, 
    "submitModule": REPO_SUBMIT_MODULE,
    "modules": [],
    "last_update": ""
}

# Initialize the GitHub objects
g = Github(os.environ['GIT_TOKEN'])
user = g.get_user(REPO_NAME)
repos = user.get_repos()

# Fetch the last repository update
meta["last_update"] = int(user.updated_at.timestamp() * 1000)

# Iterate over all public repositories
for repo in repos:
    # It is possible that module.prop does not exist (meta repo)
    try:
        # Parse module.prop into a python object
        moduleprop_raw = repo.get_contents("module.prop").decoded_content.decode("UTF-8")
        moduleprop = {}
        for line in moduleprop_raw.splitlines():
            if "=" not in line:
                continue
            lhs, rhs = line.split("=", 1)
            moduleprop[lhs] = rhs

        def getProp(name):
            try:
                return moduleprop[name]
            except:
                return None

        # Isn't that way better?
        details = {
            "id": getProp("id"),
            "name": getProp("name"),
            "author": getProp("author"),
            "version": getProp("version"),
            "versionCode": getProp("versionCode"),
            "description": getProp("description"),
            "foxprops": {
                "minApi": getProp("minApi"),
                "maxApi": getProp("maxApi"),
                "minMagisk": getProp("minMagisk"),
                "needRamdisk": getProp("needRamdisk"),
                "support": getProp("support"),
                "donate": getProp("donate"),
                "config": getProp("config"),
                "changeBoot": getProp("changeBoot")
            }
        }

        # Create meta module information
        module = {
            "id": moduleprop["id"],
            "last_update": int(repo.updated_at.timestamp() * 1000),
            # "prop_url": f"https://raw.githubusercontent.com/{repo.full_name}/{repo.default_branch}/module.prop",
            "zip_url": f"https://github.com/{repo.full_name}/archive/{repo.default_branch}.zip",
            "notes_url": f"https://raw.githubusercontent.com/{repo.full_name}/{repo.default_branch}/README.md",
            # "stars": int(repo.stargazers_count),
            "prop_url": details,
        }

        # Append to skeleton
        meta["modules"].append(module)
    except:
        continue

# Return our final skeleton
print(json.dumps(meta, indent=4, sort_keys=True))`;
};

export { generate_mmrl, GenerateMMRLProps };
