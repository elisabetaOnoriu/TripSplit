import React from "react";
import { Api } from "../features/api.types.ts";
import InvitationItem from "./InvitationItem.tsx";

type InvitationListProps = {
  invitations: Api.Invitation[];
};

const InvitationList = ({ invitations }: InvitationListProps) => {
  return (
    <div>
      {invitations.map((invitation, index) => (
        <InvitationItem key={index} invitation={invitation} />
      ))}
    </div>
  );
};

export default InvitationList;
