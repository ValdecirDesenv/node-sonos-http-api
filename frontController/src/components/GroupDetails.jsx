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
  const [isTimeEnabled, setIsTimeEnabled] = useState(false);
  const [toggleStates, setToggleStates] = useState({});
  const { sendMessage } = useWebSocketContext();

  const setToggleState = (groupId, state) => {
    setToggleStates((prev) => ({ ...prev, [groupId]: state }));

    if (sendMessage) {
      const message = {
        type: "toggle-update",
        groupId,
        state,
      };
      sendMessage(message);
    }
  };

  const setTimeRangeForGroup = (groupId, start, end) => {
    setTimeRange((prev) => ({ ...prev, [groupId]: { start, end } }));
    // if (sendMessage) {
    //   const message = {
    //     type: "time-range-update",
    //     groupId,
    //     start,
    //     end,
    //   };
    //   sendMessage(message);
    // }
  };

  const handleIsTimeToggleEnable = (status) => {
    setIsTimeEnabled(status);
  };

  useEffect(() => {
    if (group.offLineData) {
      setOffLineData("custom-bg-offline");
    }
  }, []);

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

          const [localTimeRange, setLocalTimeRange] = useState(timeRange);
          const [localIsTimeEnabled, setLocalIsTimeEnabled] =
            useState(isTimeEnabled);

          const handleLocalTimeToggle = (status) => {
            setLocalIsTimeEnabled(status);
          };

          const handleLocalTimeRangeChange = (start, end) => {
            setLocalTimeRange({ start, end });
            setTimeRangeForGroup(toggleKey, start, end);
          };

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
                  <ToggleSwitch
                    label="Audio System"
                    defaultChecked={localIsTimeEnabled}
                    onToggle={handleLocalTimeToggle}
                  />
                  {localIsTimeEnabled && (
                    <TimeRangeSelector
                      label="Select Time Range"
                      defaultStart={localTimeRange.start}
                      defaultEnd={localTimeRange.end}
                      onTimeChange={handleLocalTimeRangeChange}
                    />
                  )}
                  <Table bordered responsive className="custom-bg-3">
                    <thead>
                      <tr className="custom-bg-4">
                        <th className="custom-text-3">Room</th>
                        <th className="custom-text-3">Volume</th>
                        <th className="custom-text-3">Mute</th>
                        <th className="custom-text-3">Playback</th>
                      </tr>
                    </thead>
                    <tbody className="custom-bg-4 custom-text-3">
                      {members && members.length > 0 ? (
                        members.map((member) => (
                          <tr key={member.uuid}>
                            <td className="custom-text-3">{member.roomName}</td>
                            <td className="custom-text-3">
                              {member.state.volume}
                            </td>
                            <td className="custom-text-3">
                              {member.state.mute ? "Yes" : "No"}
                            </td>
                            <td className="custom-text-3">
                              {member.state.playbackState}
                            </td>
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
