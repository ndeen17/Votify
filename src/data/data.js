import createBallot from "../assets/election.svg";
import addVoters from "../assets/upvote.svg";
import launchElection from "../assets/launch.svg";
import monitorResults from "../assets/surveillance.svg";

const stacksData = [
  {
    name: "Create the Ballot",
    data: `Add questions (i.e. positions) 
          to your ballot and add options (candidates, measures, write-in fields, etc.) 
          to your questions. Add a photo and/or short bio.`,
    img: createBallot,
  },
  {
    name: "Add Voters",
    data: `You control who is eligible to vote in your elections. 
    Add voters one-by-one, or import them from a spreadsheet.`,
    img: addVoters,
  },
  {
    name: "Launch the Election",
    data: `When you're done customizing the election, 
    you can schedule a start/end date or immediately launch it.`,
    img: launchElection,
  },
  {
    name: "Monitor Results",
    data: `Watch the results of your election in real-time. 
    At the end of the election you have the option to publish and share the results with your voters.`,
    img: monitorResults,
  },
];

const loginData = [
  {
    name: "",
    type: "",
    placeholder: "",
  },
];

const RegisterData = [
  {
    name: "",
    type: "",
    placeholder: "",
  },
];

export { stacksData, loginData, RegisterData };
