import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";
import { useState, useEffect } from "react";
import TimeRangeSelector from "./TimeRangeSelector";
import { Card, CardBody, CardTitle, CardText, Table } from "reactstrap"; // Bootstrap components
import ToggleSwitch from "./ToggleSwitch";
import { useWebSocketContext } from "../hooks/WebSocketProvider";

const GroupDetails = ({ group }) => {
  if (!group || !group.data || group.data.length === 0) {
    return <div>Loading...</div>;
  }

  const [offLineData, setOffLineData] = useState("custom-bg");
  const [hasWorksHours, sethasWorksHours] = useState({});
  const [keepPlayingStates, setKeepPlayingStates] = useState({});
  const { sendMessage } = useWebSocketContext();

  useEffect(() => {
    if (group.type === "initial" && group.data.length > 0) {
      const updatedWorkHours = group.data.reduce(
        (acc, { hasTimePlay, uuid, timeStart, timeStop }) => {
          acc[uuid] = { hasTimePlay, timeStart, timeStop };
          return acc;
        },
        {}
      );

      sethasWorksHours(updatedWorkHours);
    }
  }, [group.data]);

  const setKeepPlayingState = ({ uuid, isKeepPlaying }) => {
    setKeepPlayingStates((prev) => ({ ...prev, [uuid]: isKeepPlaying }));
    if (sendMessage) {
      const message = {
        type: "toggle-update",
        uuid,
        isKeepPlaying,
      };
      sendMessage(message);
    }
  };

  const updateProp = (data) => {
    const { uuid, ...updatedProps } = data;
    sethasWorksHours((prev) => ({
      ...prev,
      [uuid]: {
        ...prev[uuid], // Preserve existing properties
        ...updatedProps,
      },
    }));
  };

  const setEnableTimeWorkHour = (data) => {
    const { hasTimePlay, uuid, timeStart, timeStop } = data;
    if (sendMessage) {
      const message = {
        type: "time-range-update",
        uuid,
        timeStart,
        timeStop,
        hasTimePlay,
      };
      sendMessage(message);
    }
  };

  useEffect(() => {
    if (group.offLineData) {
      setOffLineData("custom-bg-offline");
    }
  }, []);

  useEffect(() => {
    console.log("prop", hasWorksHours);
  }, [hasWorksHours]);

  return (
    <div className={`container-fluid my-4 custom-bg ${offLineData}`}>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {group.data.map((groupItem, index) => {
          const { coordinator, members } = groupItem;
          const { roomName, state } = coordinator;
          const { volume, mute, playbackState } = state;
          const uuid = groupItem.uuid;
          console.log("Props hasWorksHours:", hasWorksHours[uuid]);
          console.log("Props groupItem.hasTimePlay:", groupItem.hasTimePlay);

          const isKeepPlaying = groupItem.keepPlaying;
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
                    defaultChecked={isKeepPlaying}
                    onToggle={(isKeepPlaying) =>
                      setKeepPlayingState({ uuid, isKeepPlaying })
                    }
                  />

                  <ToggleSwitch
                    label="Audio System"
                    defaultChecked={groupItem.hasTimePlay}
                    onToggle={(hasTimePlay) => {
                      updateProp({
                        uuid: groupItem.uuid,
                        hasTimePlay,
                      });
                      setEnableTimeWorkHour({
                        uuid,
                        hasTimePlay: hasTimePlay,
                      });
                    }}
                  />
                  {hasWorksHours[uuid]?.hasTimePlay && (
                    <TimeRangeSelector
                      label="Select Time Range"
                      defaultStart={groupItem.timeStart}
                      defaultEnd={groupItem.timeStop}
                      onTimeChange={(start, end) =>
                        setEnableTimeWorkHour({
                          uuid,
                          timeStart: start,
                          timeStop: end,
                          hasTimePlay: true,
                        })
                      }
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
                        members.map((member, memberIndex) => (
                          <tr key={member.uuid || `member-${memberIndex}`}>
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
