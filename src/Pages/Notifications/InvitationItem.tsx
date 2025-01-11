import React, { useState } from "react";
import { Api } from "../../features/api.types";
import { useRespondToInvitationMutation } from "../../features/api";
import "./InvitationItem.css";

type InvitationItemProps = {
  invitation: Api.Invitation;
};

const InvitationItem = ({ invitation }: InvitationItemProps) => {
  const [respondToInvitation, { isLoading }] = useRespondToInvitationMutation();
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const handleAccept = async () => {
    try {
      await respondToInvitation({
        tripId: invitation.tripId,
        userId: invitation.userId,
        isAccepted: true,
      }).unwrap();
      // Set success message instead of alert
      setNotificationMessage("Invitation accepted!");
    } catch (error) {
      // Set error message instead of alert
      setNotificationMessage("Failed to accept invitation.");
    }
  };

  const handleDecline = async () => {
    try {
      await respondToInvitation({
        tripId: invitation.tripId,
        userId: invitation.userId,
        isAccepted: false,
      }).unwrap();
      // Set success message instead of alert
      setNotificationMessage("Invitation declined!");
    } catch (error) {
      // Set error message instead of alert
      setNotificationMessage("Failed to decline invitation.");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        margin: "10px",
        padding: "15px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h3 style={{ margin: "0 0 10px" }}>{invitation.tripName}</h3>
      <p style={{ margin: "5px 0" }}>
        Destination: {invitation.tripDestination}
      </p>
      <div style={{ marginTop: "10px" }}>
        <button
          className="handle_request_button"
          onClick={handleAccept}
          disabled={isLoading}
          style={{
            marginRight: "10px",
            padding: "5px 10px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Processing..." : "Accept"}
        </button>
        <button
          className="handle_request_button"
          onClick={handleDecline}
          disabled={isLoading}
          style={{
            padding: "5px 10px",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isLoading ? "Processing..." : "Decline"}
        </button>
      </div>

      {/* Show success/error message (notification) */}
      {notificationMessage && (
        <div
          style={{
            marginTop: "10px",
            backgroundColor: "#f0f0f0",
            padding: "8px 12px",
            borderRadius: "4px",
          }}
        >
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default InvitationItem;
