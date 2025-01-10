import React from "react";
import { useAppSelector } from "../../features/store";
import { useGetUserInvitationsQuery } from "../../features/api";
import InvitationList from "./InvitationList";
import './Notifications.css'

const Notifications = () => {
  const userId = useAppSelector((state) => state.auth.userId);

  const { data: invitations, isLoading, isError } = useGetUserInvitationsQuery(userId!);

  if (isLoading) return <div>Loading notifications...</div>;
  if (isError) return <div>Failed to load notifications.</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1 className="notifications_title">Notifications</h1>
      {invitations?.length ? (
        <InvitationList invitations={invitations} />
      ) : (
        <p>No pending invitations.</p>
      )}
    </div>
  );
};

export default Notifications;
