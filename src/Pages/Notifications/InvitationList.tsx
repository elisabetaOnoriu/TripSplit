import React, { useState } from "react";
import { Api } from "../../features/api.types";
import InvitationItem from "./InvitationItem";
import './InvitationItem.css'

type InvitationListProps = {
  invitations: Api.Invitation[];
};

const InvitationList = ({ invitations }: InvitationListProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(invitations.length / itemsPerPage);

  const paginatedInvitations = invitations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <div>
        {paginatedInvitations.map((invitation, index) => (
          <InvitationItem key={index} invitation={invitation} />
        ))}
      </div>

      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button className="handle_request_button"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            margin: "0 10px",
            padding: "5px 10px",
            cursor: currentPage === 1 ? "not-allowed" : "pointer",
          }}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button className="handle_request_button"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            margin: "0 10px",
            padding: "5px 10px",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InvitationList;
