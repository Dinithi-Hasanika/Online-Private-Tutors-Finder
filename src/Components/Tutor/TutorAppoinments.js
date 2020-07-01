import React, { Component } from "react";
import { Link } from "react-router-dom";
import apistudents from "../api/studentapi";
import api from "../api/tutorapi";
import apisappoinment from "../api/appoinmentapi";

class TutorAppoinments extends Component {
  constructor(props) {
    super(props);
    //const { user } = this.props.auth;
    this.state = {
      students: [],
      appoinments: [],
      myAppoinID: [],
      myAppoinStudents: [],
      accept: true,
      tutorID: this.props.match.params.value,
    };
  }

  componentDidMount = async () => {
    await apistudents.getAllStudent().then((students) => {
      this.setState({
        students: students.data.data,
      });
    });
    await apisappoinment.getAllAppoinment().then((appoinments) => {
      this.setState({
        appoinments: appoinments.data.data,
      });
    });
  };

  handleAccept = async (reqIndex, myreq) => {
    const { accept, myAppoinID } = this.state;
    const payload = { accept };
    console.log(myAppoinID[reqIndex]._id);
    await apisappoinment
      .updateAppoinmentById(myAppoinID[reqIndex]._id, payload)
      .then((res) => {
        window.confirm(
          `You have accepted the appoinment by ${myreq.firstname} ${myreq.lastname}`
        );
        window.location.reload();
      });
  };

  render() {
    const {
      students,
      appoinments,
      myAppoinID,
      myAppoinStudents,
      tutorID,
    } = this.state;

    appoinments.map((req) => {
      if (req.tutorID == tutorID && req.accept == false) {
        myAppoinID.push(req);
      }
    });

    myAppoinID.map((myr) => {
      students.map((student) => {
        if (student._id == myr.studentID) {
          const appoin = {
            id: student._id,
            firstname: student.firstname,
            lastname: student.lastname,
            email: student.email,
            address: student.address,
            username: student.username,
            dob: student.dob,
            contact_number: student.contact_number,
            gender: student.gender,
            date: myr.date,
            startTime: myr.startTime,
            endTime: myr.endTime,
            venue: myr.venue,
            subject: myr.subject,
          };
          myAppoinStudents.push(appoin);
        }
      });
    });

    return (
      <div>
        <div>
          <h4>
            <strong>
              <font color="blue">&nbsp;&nbsp;&nbsp;APPOINMENT REQUESTS</font>
            </strong>
          </h4>
        </div>
        <div>
          <table class="table table-stripe">
            <tr>
              <th>
                <font color="lightseagreen">Name</font>
              </th>
              <th>
                <font color="lightseagreen">Date</font>
              </th>

              <th>
                <font color="lightseagreen">Start Time</font>
              </th>
              <th>
                <font color="lightseagreen">End Time</font>
              </th>
              <th>
                <font color="lightseagreen">Venue</font>
              </th>
              <th>
                <font color="lightseagreen">Subject</font>
              </th>
            </tr>

            <tbody>
              {this.state.myAppoinStudents.map((myreq) => {
                if (myreq._id != "") {
                  const index = myAppoinStudents.indexOf(myreq);
                  return (
                    <tr>
                      <td>
                        {myreq.firstname} {myreq.lastname}
                      </td>

                      <td>{myreq.date}</td>

                      <td>{myreq.startTime}</td>

                      <td>{myreq.endTime}</td>

                      <td>{myreq.venue}</td>

                      <td>{myreq.subject}</td>
                      <Link
                        to={`/viewstudentprofile/${this.state.tutorID}/${myreq.id}`}
                      >
                        <button class="btn btn-primary">VIEW</button>
                      </Link>

                      <button
                        class="btn btn-primary"
                        color="primary"
                        onClick={this.handleAccept.bind(this, index, myreq)}
                      >
                        ACCEPT
                      </button>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default TutorAppoinments;
