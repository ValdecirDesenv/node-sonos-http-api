import "bootstrap/dist/css/bootstrap.min.css";
import "../css/styles.css";
import React from "react";
import { Card, CardBody, CardTitle, CardText, Table } from "reactstrap"; // Bootstrap components

const GroupDetails = ({ group }) => {
  if (!group || !group.data || group.data.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid my-4 custom-bg">
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {group.data.map((groupItem) => {
          const { coordinator, members } = groupItem;
          const { roomName, state } = coordinator;
          const { volume, mute, playbackState } = state;

          return (
            <div className="col custom-bg-4" key={groupItem.uuid}>
              <Card className="h-100">
                <CardBody className="custom-bg-2">
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

                  {/* Members Table */}
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
