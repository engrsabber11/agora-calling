import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CreateMeeting: React.FC = () => {
  const [meetingLink, setMeetingLink] = useState<string>("");

  const createMeeting = () => {
    const meetingId = uuidv4();
    const link = `${window.location.origin}/meeting/${meetingId}`;
    setMeetingLink(link);
  };

  return (
    <div>
      <button onClick={createMeeting}>Create Meeting</button>
      {meetingLink && (
        <div>
          <p>
            Meeting Link: <a href={meetingLink}>{meetingLink}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;
