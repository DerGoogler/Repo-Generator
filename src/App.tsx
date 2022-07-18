import { Component } from "react";
import {
  TextField,
  TextFieldProps,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  ListSubheader,
  AppBar,
  Tab,
  Tabs,
  Box,
} from "@mui/material";
import jszip from "jszip";
import { saveAs } from "file-saver";
import { workflow } from "./util/workflow";
import SwipeableViews from "react-swipeable-views";
import { generate_legacy } from "./util/generate/generate.legacy";
import { RepoType } from "./util/Constants";
import { generate_mmrl } from "./util/generate/generate.mmrl";
import { generate_foxmmm } from "./util/generate/generate.foxmmm";
import Giscus from "@giscus/react";
import { TabPanel } from "./components/TabPanel";
import theme from "./theme";

interface State {
  repo_name: string;
  repo_title: string;
  user_name: string;
  user_email: string;
  commit_message: string;
  repo_type: RepoType;

  // If only MMRL or FoxMMM
  repo_website: string;
  repo_support: string;
  repo_donate: string;
  repo_submit: string;
  tabIndex: number;
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
      repo_type: RepoType.Legacy_MMAR,
      repo_website: "",
      repo_support: "",
      repo_donate: "",
      repo_submit: "",
      tabIndex: 0,
    };
    this.handleRepoChange = this.handleRepoChange.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleTabIndexChange = this.handleTabIndexChange.bind(this);
  }

  private a11yProps(index: number) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  private handleRepoChange(event: SelectChangeEvent) {
    this.setState({ repo_type: event.target.value as RepoType });
  }

  private handleTabChange(event: React.SyntheticEvent, newValue: number) {
    this.setState({ tabIndex: newValue });
  }

  private handleTabIndexChange(index: number) {
    this.setState({ tabIndex: index });
  }

  public render() {
    const { repo_name, user_name, user_email, repo_title, commit_message } = this.state;
    const { repo_website, repo_support, repo_donate, repo_submit, repo_type } = this.state;
    const { tabIndex } = this.state;
    this.state;
    return (
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <AppBar position="static">
          <Tabs
            value={tabIndex}
            onChange={this.handleTabChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
          >
            <Tab label="Builder" {...this.a11yProps(0)} />
            <Tab label="Comments" {...this.a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={tabIndex}
          onChangeIndex={this.handleTabIndexChange}
        >
          <TabPanel value={tabIndex} index={0} dir={theme.direction}>
            <FormControl fullWidth margin="dense">
              <InputLabel id="select-repo-type-label">Repo Type</InputLabel>
              <Select
                defaultValue={RepoType.Legacy_MMAR}
                labelId="select-repo-type-label"
                id="select-repo-type"
                value={repo_type}
                label="Repo Type"
                onChange={this.handleRepoChange}
              >
                <ListSubheader>W/Request</ListSubheader>
                <MenuItem value={RepoType.Legacy_MMAR}>Legacy (MMAR)</MenuItem>
                <MenuItem value={RepoType.FoxMMM}>FoxMMM</MenuItem>
                <ListSubheader>W/O Requests</ListSubheader>
                <MenuItem value={RepoType.MMRL}>MMRL</MenuItem>
              </Select>
            </FormControl>
            <this.Input title="Repo Name" volumen={repo_name} state={"repo_name"} />
            <this.Input title="Repo Title" volumen={repo_title} state={"repo_title"} />
            <this.Input title="Commit Message" volumen={commit_message} state={"commit_message"} />
            <this.Input title="User Name" volumen={user_name} state={"user_name"} />
            <this.Input title="User E-Mail" volumen={user_email} state={"user_email"} />

            {this.repo_t}

            <Button
              fullWidth
              variant="contained"
              sx={{ marginTop: "8px" }}
              onClick={() => {
                const zip = new jszip();

                switch (repo_type) {
                  case "Legacy (MMAR)":
                    zip.file("generate.py", generate_legacy(repo_name, repo_title));
                    break;
                  case "FoxMMM":
                    zip.file(
                      "generate.py",
                      generate_foxmmm({
                        name: repo_name,
                        title: repo_title,
                        website: repo_website,
                        support: repo_support,
                        donate: repo_donate,
                        submit: repo_submit,
                      })
                    );
                    break;
                  case "MMRL":
                    zip.file(
                      "generate.py",
                      generate_mmrl({
                        name: repo_name,
                        title: repo_title,
                        website: repo_website,
                        support: repo_support,
                        donate: repo_donate,
                        submit: repo_submit,
                      })
                    );
                    break;
                  default:
                    break;
                }

                const workflows = zip.folder(".github/workflows");
                workflows?.file("generate.yml", workflow(user_name, user_email, commit_message));

                zip.generateAsync({ type: "blob" }).then(function (content) {
                  saveAs(content, `${repo_name}.zip`);
                });
              }}
            >
              Download
            </Button>
          </TabPanel>
          <TabPanel value={tabIndex} index={1} dir={theme.direction}>
            <div>
              <Giscus
                repo="DerGoogler/MMRL"
                repoId="R_kgDOHO8GRQ"
                category="Repo Generator"
                categoryId="DIC_kwDOHO8GRc4CQS0j"
                mapping="specific"
                term="Main"
                reactionsEnabled="1"
                emitMetadata="1"
                inputPosition="bottom"
                theme="light"
                lang="en"
              />
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
    );
  }

  private get repo_t() {
    const { repo_type, repo_website, repo_support, repo_donate, repo_submit } = this.state;

    const temp = (): JSX.Element => {
      return (
        <>
          <this.Input title="Website URL" volumen={repo_website} state={"repo_website"} />
          <this.Input title="Support URL" volumen={repo_support} state={"repo_support"} />
          <this.Input title="Donate URL" volumen={repo_donate} state={"repo_donate"} />
          <this.Input title="Submit Module URL" volumen={repo_submit} state={"repo_submit"} />
        </>
      );
    };

    switch (repo_type) {
      case RepoType.FoxMMM:
        return temp();
      case RepoType.MMRL:
        return temp();
      default:
        return null;
    }
  }

  private Input = (props: { title: string; volumen: string; state: string } & TextFieldProps) => {
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
