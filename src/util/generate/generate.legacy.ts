export const generate_legacy = (name: string, title: string) => {
  return `import sys
import json
import os
from github import Github

# Configuration
REPO_NAME = "${name}"
REPO_TITLE = "${title}"

# Skeleton for the repository
meta = {
    "name": REPO_TITLE,
    "last_update": "",
    "modules": []
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

        # Create meta module information
        module = {
            "id": moduleprop["id"],
            "last_update": int(repo.updated_at.timestamp() * 1000),
            "prop_url": f"https://raw.githubusercontent.com/{repo.full_name}/{repo.default_branch}/module.prop",
            "zip_url": f"https://github.com/{repo.full_name}/archive/{repo.default_branch}.zip",
            "notes_url": f"https://raw.githubusercontent.com/{repo.full_name}/{repo.default_branch}/README.md",
            "stars": int(repo.stargazers_count)
        }

        # Append to skeleton
        meta["modules"].append(module)
    except:
        continue

# Return our final skeleton
print(json.dumps(meta, indent=4, sort_keys=True))`;
};
