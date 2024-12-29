import React from "react";
import { useAppSelector } from "../../features/store";
import { useGetUserInvitationsQuery } from "../../features/api";
import InvitationList from "../../Components/InvitationList";

const Notifications = () => {
  const userId = useAppSelector((state) => state.auth.userId);

  const { data: invitations, isLoading, isError } = useGetUserInvitationsQuery(userId!);

  if (isLoading) return <div>Loading notifications...</div>;
  if (isError) return <div>Failed to load notifications.</div>;

  return (
    <div>
      <h1>Notifications</h1>
      {invitations?.length ? (
        <InvitationList invitations={invitations} />
      ) : (
        <p>No pending invitations.</p>
      )}
    </div>
  );
};

export default Notifications;
