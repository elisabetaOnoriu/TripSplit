import React from "react";
import { Api } from "../features/api.types.ts";
import { useRespondToInvitationMutation } from "../features/api.ts";

type InvitationItemProps = {
  invitation: Api.Invitation;
};

const InvitationItem = ({ invitation }: InvitationItemProps) => {
  const [respondToInvitation, { isLoading }] = useRespondToInvitationMutation();

  const handleAccept = async () => {
    try {
      await respondToInvitation({ tripId: invitation.tripId, userId: invitation.userId, isAccepted: true }).unwrap();
      alert("Invitation accepted!");
    } catch (error) {
      alert("Failed to accept invitation.");
    }
  };

  const handleDecline = async () => {
    try {
      await respondToInvitation({ tripId: invitation.tripId, userId: invitation.userId, isAccepted: false }).unwrap();
      alert("Invitation declined!");
    } catch (error) {
      alert("Failed to decline invitation.");
    }
  };

  return (
    <div style={{ border: "1px solid #ddd", margin: "10px", padding: "10px" }}>
      <h3>{invitation.tripName}</h3>
      <p>Destination: {invitation.tripDestination}</p>
      <div>
        <button onClick={handleAccept} disabled={isLoading}>
          {isLoading ? "Processing..." : "Accept"}
        </button>
        <button onClick={handleDecline} disabled={isLoading}>
          {isLoading ? "Processing..." : "Decline"}
        </button>
      </div>
    </div>
  );
};

export default InvitationItem;
