import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";
import React, { useState, useEffect } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import { Card, CardBody, CardTitle, CardText, Table } from "reactstrap"; // Bootstrap components
import ToggleSwitch from "./ToggleSwitch";
import { useWebSocketContext } from "../hooks/WebSocketProvider";

const GroupDetails = ({ group }) => {
  if (!group || !group.data || group.data.length === 0) {
    return <div>Loading...</div>;
  }
  if (group.type !== "initial") {
    console.log("GroupDetails: Invalid group type", group);
    return null;
  }
  const [offLineData, setOffLineData] = useState("custom-bg");
  const [timeRange, setTimeRange] = useState({ start: "08:00", end: "22:00" });

  useEffect(() => {
    if (group.offLineData) {
      setOffLineData("custom-bg-offline");
    }
  }, []);

  const [toggleStates, setToggleStates] = useState({});

  const { sendMessage } = useWebSocketContext();

  const setToggleState = (groupId, state) => {
    // Update state locally
    setToggleStates((prev) => ({ ...prev, [groupId]: state }));

    // Sync with WebSocket
    if (sendMessage) {
      const message = {
        type: "toggle-update",
        groupId,
        state,
      };
      sendMessage(message);
    }
  };

  return (
    <div className={`container-fluid my-4 custom-bg ${offLineData}`}>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {group.data.map((groupItem, index) => {
          const { coordinator, members } = groupItem;
          const { roomName, state } = coordinator;
          const { volume, mute, playbackState } = state;
          const toggleKey = groupItem.uuid;
          const isToggled = groupItem.keepPlaying;
          const cardBodyClassZone = group.offLineData
            ? "custom-bg-offlineCard"
            : groupItem.offLineZone
            ? "custom-bg-offlineCard"
            : "custom-bg-2";

          return (
            <div className="col custom-bg-4" key={index}>
              <Card className="h-100">
                <CardBody className={cardBodyClassZone}>
                  <CardTitle
                    className="custom-text-1"
                    tag="h5"
                  >{`Group: ${roomName}`}</CardTitle>
                  <CardText className="custom-text-1">
                    <strong>Volume:</strong> {volume}
                  </CardText>
                  <CardText className="custom-text-1">
                    <strong>Mute:</strong> {mute ? "Yes" : "No"}
                  </CardText>
                  <CardText className="custom-text-1">
                    <strong>Playback State:</strong> {playbackState}
                  </CardText>
                  <ToggleSwitch
                    label="Always Keep Playing"
                    defaultChecked={isToggled}
                    onToggle={(newState) => setToggleState(toggleKey, newState)}
                  />
                  <Table bordered responsive className="custom-bg-3">
                    <thead>
                      <tr className="custom-bg-4">
                        <th>Room</th>
                        <th>Volume</th>
                        <th>Mute</th>
                        <th>Playback</th>
                      </tr>
                    </thead>
                    <tbody className="custom-bg-4">
                      {members && members.length > 0 ? (
                        members.map((member) => (
                          <tr key={member.uuid}>
                            <td>{member.roomName}</td>
                            <td>{member.state.volume}</td>
                            <td>{member.state.mute ? "Yes" : "No"}</td>
                            <td>{member.state.playbackState}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            No members available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GroupDetails;
0;
