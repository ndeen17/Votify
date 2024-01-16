import React from "react";
// Component Import
import Layout from "./components/Layout";
import Public from "./components/Public/Public";
import Form from "./features/auth/Form";
import DashLayout from "./components/Dash/DashLayout";
import Menu from "./components/menu/Menu";
import CreateElectionForm from "./components/createElectionForm/CreateElectionForm";
import ElectionLayout from "./features/election/ElectionLayout";
import Dashboard from "./features/election/Dashboard";
import VoteLayout from "./features/vote/VoteLayout";
import Vote from "./features/vote/Vote";
import LoginVote from "./features/vote/components/LoginVote";
import AdminPanel from "./features/election/adminPanel/AdminPanel";
import Profile from "./components/profile/Profile";
import ProtectedVoting from "./features/vote/ProtectVoting";
import VoteDashboard from "./features/vote/dashboard/VoteDashboard";

import Modal from "./components/modal/Modal";

import ProtectedVote from "./features/vote/ProtectedVote";

// Third Party Import
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Modal />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Public />} />
          <Route path="form" element={<Form />} />
          <Route path="dash" element={<DashLayout />}>
            <Route index element={<Menu />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<Profile />} />
            <Route path="createElectionForm" element={<CreateElectionForm />} />
            <Route path="vote" element={<VoteLayout />}>
              <Route index element={<Vote />} />
              <Route path="login-vote" element={<ProtectedVote />}>
                <Route index element={<LoginVote />} />
                <Route path="voting" element={<ProtectedVoting />}>
                  <Route index element={<VoteDashboard />} />
                </Route>
              </Route>
            </Route>
            {/* end of vote Route */}
            <Route path="election" element={<ElectionLayout />}>
              <Route index element={<AdminPanel />} />
              {/* <Route path="addVoterForm" element={<VoterForm />} /> */}
            </Route>
            {/* end of election Route */}
          </Route>
          {/* end of dash Route */}
        </Route>
      </Routes>
    </>
  );
}
