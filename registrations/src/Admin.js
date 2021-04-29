import {useState, useEffect} from "react";
//
import db from "./firebase/db";
//
import "./App.scss";
import TableItem from "./components/TableItem";

function App() {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("qualification-exam")
      .onSnapshot((snapshot) => {
        const data = [];

        snapshot.docs.forEach((person) => {
          const docItem = person.data();
          docItem["docId"] = person.id;

          data.push(docItem);
        });
        setUserList(data);
      });
    return () => {
      unsubscribe();
    };
  }, []);

  return (<>
      <header  className="container mt-3 mb-3">
        <h1>Regisztráció admin</h1>
      </header>
    <section className="container">

      <table className="table table-striped">
        <thead>
        <tr>
          <th>Név</th>
          <th>Email</th>
          <th>Jogkör</th>
          <th>Születési év</th>
        </tr>
        </thead>
        <tbody>
        {userList.map((user) => (
          <TableItem
            key={user.docId}
            fullName={user.fullName}
            yearOfBirth={user.yearOfBirth}
            role={user.role}
            email={user.email}
          />
        ))}
        </tbody>
      </table>
    </section>
    </>
  );
}

export default App;
