import {useState, useEffect} from "react";
//
import db from "./firebase/db";
//
import "./App.scss";
import TableItem from "./TableItem";
import {Link} from "react-router-dom"

function App() {
  const [userList, setUserList] = useState([]);
  const [isChecked, setIsChecked] = useState(null);
  const [filteredItems, setFilteredItems] = useState([]);


  const [registered, setRegistered] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [guest, setGuest] = useState([]);

  const handleCheck = (e) => {
    setIsChecked(e.target.checked);
  }


 


  function userStatistic1(){
      db.collection('qualification-exam').where("role", ">", "regisztrált felhasználó").onSnapshot((snapshot) => {
          const items = [];
  
          snapshot.docs.forEach((item) => {
            const docItem = item.data();
            docItem["docId"] = item.id;
  
            items.push(docItem.quantityOfStock);
          });
         
          setRegistered(items)
        });
  }

userStatistic1();

  function userStatistic2(){
    db.collection('qualification-exam').where("role", ">", "admin").onSnapshot((snapshot) => {
        const items = [];

        snapshot.docs.forEach((item) => {
          const docItem = item.data();
          docItem["docId"] = item.id;

          items.push(docItem.quantityOfStock);
        });
       
        setAdmin(items)
      });
}

userStatistic2();

function userStatistic3(){
  db.collection('qualification-exam').where("role", ">", "vendég").onSnapshot((snapshot) => {
      const items = [];

      snapshot.docs.forEach((item) => {
        const docItem = item.data();
        docItem["docId"] = item.id;

        items.push(docItem.quantityOfStock);
      });
     
      setGuest(items)
    });
}

userStatistic3();

console.log(registered.length)
console.log(guest.length)
console.log(admin.length)

const userSum = registered.length + guest.length + admin.length;



  useEffect(() => {
    const unsubscribe = db.collection('qualification-exam').where("role", '==', "regisztrált felhasználó").onSnapshot((snapshot) => {
      const items = [];

      snapshot.docs.forEach(item => {
        const docItem = item.data();
        docItem["docId"] = item.id;

        items.push(docItem);
      })
      setFilteredItems(items);
    });
    return () => {
      unsubscribe();
    }

  }, [isChecked])

  const processUsers = (querySnapshot) => {
    const tableDataCache = [];
    querySnapshot.forEach((doc) => {
      const row = {
        ...doc.data(),
        id: doc.id,
      };

      tableDataCache.push(row);
    });
    setUserList(tableDataCache);
  };

  useEffect(() => {
    db.collection("qualification-exam").onSnapshot(processUsers);
  }, []);
  
 

  function handleUserChange(e) {
    const value = e.target.value;
    const ref = db.collection("qualification-exam");
    if (value !== "") {
      ref.where("role", "==", value).get().then(processUsers);
    } else {
      ref.get().then(processUsers);
    }
  }


  function handleDeleteItem(e) {
    console.log(e.target.id)
    db.collection("qualification-exam")
      .doc(e.target.dataset.id)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }
  

  /*
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
  */

  return (<>
    <header className="container mt-3 mb-3">
      <h1>Regisztráció admin</h1>
    </header>
    <div className="mb-3">
        <label htmlFor="citySelector" className="form-label">
        Szűrés jogkörre
        </label>
        <select
          id="citySelector"
          className={"form-select"}
          onChange={handleUserChange}
        >
          <option value={""}>Válassz!</option>
          <option value="admin">admin</option>
          <option value="vendég">vendég</option>
          <option value="regisztrált felhasználó">regisztrált felhasználó</option>
        
        </select>
      </div>

      <div className="form-check">
          <input onChange={handleCheck} className="form-check-input" type="checkbox" value="" id="flexCheckDefault"/>
          <label className="form-check-label" htmlFor="flexCheckDefault">
          Aktív felhasználók
          </label>

        </div>
        <button>
          <Link to="users/new">Új felhasználó</Link>
        </button>
         
    <section className="container">
      <table className="table table-striped">
        <thead>
        <tr>
          <th>Név</th>
          <th>Születési év</th>
          <th>Jogkör</th>
          
          <th>Aktív</th>
          <th>Email</th>
          <th>Műveletek</th>
        </tr>
        </thead>
        <tbody>

        {isChecked ? filteredItems.map((user, index) => (
                <tr key={index}>
                  <td>{user.fullName}</td>
                  <td>{user.yearOfBirth}</td>
                  <td>{user.role}</td>
                  <td>{user.isActive ? "✔️" : "❌"}</td>
                  <td>{user.email}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    <button
                      type="button"
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteItem(user.id)}
                    >
                      Törlés
                    </button>
                  </td>
                </tr>
            
            )) :
            userList.map((user, index) => (
              <tr key={index}>
                <td>{user.fullName}</td>
                <td>{user.yearOfBirth}</td>
                <td>{user.role}</td>
                <td>{user.isActive ? "✔️" : "❌"}</td>
                <td>{user.email}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteItem(user.id)}
                  >
                    Törlés
                  </button>
                </td>
              </tr>
            ))
          }

      
        </tbody>
      </table>
      <table>
      <thead>
        <tr>
          <th>Jogkör</th>
          <th>Darab</th>
        </tr>
        </thead>
        <tbody>
          <tr>
             <td>admin</td>
             <td>{admin.length}</td>
          </tr>
          <tr>
             <td>vendég</td>
             <td>{guest.length}</td>
          </tr>
         <tr>
           <td>regisztrált felhasználó</td> 
           <td>{registered.length}</td>
         </tr>
          <tr>
             <td> <strong>Összesen</strong> </td> 
             <td>{userSum}</td>
          </tr>
       
        
        </tbody>
      </table>
    </section>
  </>
  );
}





export default App;
