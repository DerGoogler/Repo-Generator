import { Component } from "react";
import { TextField, TextFieldProps, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import Fab from "@mui/material/Fab";
import jszip from "jszip";
import { saveAs } from "file-saver";
import { workflow } from "./util/workflow";
import { generate_py } from "./util/generate.py";

interface State {
  repo_name: string;
  repo_title: string;
  user_name: string;
  user_email: string;
  [x: string]: any;
}

class App extends Component<{}, State> {
  public constructor(props: {}) {
    super(props);
    this.state = {
      repo_name: "Magisk-Modules-Alt-Repo",
      repo_title: "Magisk Modules Alt Repo",
      user_name: "mmar-json",
      user_email: "mmar-json@users.noreply.github.com",
      commit_message: "Update modules.json",
    };
  }

  public render() {
    const { repo_name, user_name, user_email, repo_title, commit_message } = this.state;
    this.state;
    return (
      <div style={{ padding: "8px" }}>
        <this.Input title="Repo Name" volumen={repo_name} state={"repo_name"} />
        <this.Input title="Repo Title" volumen={repo_title} state={"repo_title"} />
        <this.Input title="Commit Message" volumen={commit_message} state={"commit_message"} />
        <this.Input title="User Name" volumen={user_name} state={"user_name"} />
        <this.Input title="User E-Mail" volumen={user_email} state={"user_email"} />
        <Button
          fullWidth
          variant="contained"
          sx={{ marginTop: "8px" }}
          onClick={() => {
            const zip = new jszip();

            zip.file("generate.py", generate_py(repo_name, repo_title));

            const workflows = zip.folder(".github/workflows");
            workflows?.file("generate.yml", workflow(user_name, user_email, commit_message));

            zip.generateAsync({ type: "blob" }).then(function (content) {
              saveAs(content, `${repo_name}.zip`);
            });
          }}
        >
          Download
        </Button>
      </div>
    );
  }

  public Input = (props: { title: string; volumen: string; state: string } & TextFieldProps) => {
    const { title, volumen, state } = props;
    return (
      <TextField
        id="outlined-basic"
        fullWidth
        margin="dense"
        label={title}
        value={volumen}
        {...props}
        variant="outlined"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          this.setState({ [state]: event.target.value });
        }}
      />
    );
  };
}

export default App;
