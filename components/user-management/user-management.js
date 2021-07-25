import { useState, useEffect } from "react";
import { signOut, getSession } from "next-auth/client";
import { useRouter } from "next/router";

function UserManagement() {
  const [users, setUsers] = useState([{}]);
  const router = useRouter();

  //main api to update the table with each changes as the second parameter is omitted.
  useEffect(() => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  });

  //all checkboxes' handler
  function selectAll(e) {
    const checkboxes = document.getElementsByName("foo");
    if (e.target.checked === true) {
      for (let i in checkboxes) {
        if (checkboxes[i].type == "checkbox") {
          checkboxes[i].checked = true;
        }
      }
    } else {
      for (let i in checkboxes) {
        if (checkboxes[i].type == "checkbox") {
          checkboxes[i].checked = false;
        }
      }
    }
  }

  //handle the block button
  function handleBlock() {
    const selectedUsers = [];
    const checkboxes = document.getElementsByName("foo");
    for (let i in checkboxes) {
      if (checkboxes[i].checked == true) {
        selectedUsers.push(checkboxes[i].id);
      }
    }
    if (selectedUsers.length !== 0) {
      statusChanging(selectedUsers, "blocked");
    }
    const session = getSession();
    session.then((data) => isToBeLoggedOut(data.user.email));
  }

  //handle the unblock button
  function handleUnBlock() {
    const selectedUsers = [];
    const checkboxes = document.getElementsByName("foo");
    for (let i in checkboxes) {
      if (checkboxes[i].checked == true) {
        selectedUsers.push(checkboxes[i].id);
      }
    }
    if (selectedUsers.length !== 0) {
      statusChanging(selectedUsers, "unblocked");
    }
  }

  function handleDelete() {
    const selectedUsers = [];
    const checkboxes = document.getElementsByName("foo");
    for (let i in checkboxes) {
      if (checkboxes[i].checked == true) {
        selectedUsers.push(checkboxes[i].id);
      }
    }
    if (selectedUsers.length !== 0) {
      deleteUsers(selectedUsers);
    }
    const session = getSession();
    session.then((data) => isToBeLoggedOut(data.user.email));
  }

  //patch request to block/unblock
  async function statusChanging(selectedUsers, status) {
    const response = await fetch("/api/user-statuses", {
      method: "PATCH",
      body: JSON.stringify({ selectedUsers, status }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
  }

  function isToBeLoggedOut(ourEmail) {
    const checkBox = document.getElementById(ourEmail);
    const found = users.some((user) => user.email == ourEmail);
    if (!found || (found && checkBox.checked == true)) {
      router.replace("/");
      signOut();
    }
  }

  async function deleteUsers(selectedUsers) {
    const response = await fetch("/api/users", {
      method: "DELETE",
      body: JSON.stringify({ selectedUsers }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Something went wrong!");
    }
  }

  return (
    <>
      {/* Toolbar */}
      <div className="text-center">
        <h1>Toolbar</h1>
        <div
          className="btn-group"
          role="toolbar"
          aria-label="Toolbar to manage users"
        >
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={handleBlock}
          >
            Block
          </button>
          <button type="button" className="btn" onClick={handleUnBlock}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-unlock"
              viewBox="0 0 16 16"
            >
              <path d="M11 1a2 2 0 0 0-2 2v4a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5V3a3 3 0 0 1 6 0v4a.5.5 0 0 1-1 0V3a2 2 0 0 0-2-2zM3 8a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V9a1 1 0 0 0-1-1H3z" />
            </svg>
          </button>
          <button type="button" className="btn" onClick={handleDelete}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill="currentColor"
              className="bi bi-trash"
              viewBox="0 0 16 16"
            >
              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
              <path
                fillRule="evenodd"
                d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"
              />
            </svg>
          </button>
        </div>
      </div>
      <br />
      {/* TABLE */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th scope="col" className="mouseOver">
                <input
                  type="checkbox"
                  name="isAllSelected"
                  onClick={selectAll}
                />
              </th>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Registered</th>
              <th scope="col">Last Visited</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => {
              return (
                <tr key={index + 1}>
                  <td scope="row" key={index + 2}>
                    <input
                      key={index + 3}
                      type="checkbox"
                      className="mouseOver"
                      name="foo"
                      id={user.email}
                    />
                  </td>
                  <td key={index + 4} scope="row">
                    {user._id}
                  </td>
                  <td key={index + 5} scope="row">
                    {user.name}
                  </td>
                  <td key={index + 6} scope="row">
                    {user.email}
                  </td>
                  <td key={index + 7} scope="row">
                    {user.registerDate}
                  </td>
                  <td key={index + 8} scope="row">
                    {user.lastVisit}
                  </td>
                  <td key={index + 9} scope="row">
                    {user.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default UserManagement;
