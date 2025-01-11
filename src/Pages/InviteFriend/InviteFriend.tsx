import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useInviteUserMutation } from "../../features/api";
import './InviteFriend.css'

const InviteFriend = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [email, setEmail] = useState("");
  const [inviteUser, { isLoading }] = useInviteUserMutation();
  const [notificationMessage, setNotificationMessage] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !tripId) {
      setNotificationMessage("Please provide the user's email.");
      //alert("");
      return;
    }

    try {
      await inviteUser({ tripId: Number(tripId), email }).unwrap();
      setNotificationMessage("Invitation sent successfully!");
      //alert("Invitation sent successfully!");
      setEmail("");
    } catch (error) {
      setNotificationMessage("Failed to send invitation. Please try again.");
      //alert("Failed to send invitation. Please try again.");

    }
  };

  return (
    <div>
      <h1>Invite a Friend</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Friend's Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className="inviting_button_form"type="submit" disabled={isLoading}>
          {isLoading ? "Sending..." : "Send Invitation"}
        </button>
      </form>
    </div>
  );
};

export default InviteFriend;
