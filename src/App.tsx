import { useState, useEffect } from "react";
import List from "./List";
import Alert from "./Alert";

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if(list){
    return JSON.parse(list)
  }else{
    return []
  }
}

const App = () => {

  const [name, setName] = useState('');
  const [list, setList] = useState<any>(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<any>(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  const handleSubmit = (e: any) => {
    e.preventDefault()
    if (!name) {

      showAlert(true, "please enter a value", "danger")

    } else if (name && isEditing) {

      setList(
        list.map((item: any) => {

          if (item.id === editId) {
            return { ...item, title: name }
          }

          return item
        })
      )
      setEditId(null)
      setName('')
      setIsEditing(false)
      showAlert(true, "updated item", "success")
    } else {

      showAlert(true, "new item added", "success")

      const newItem = {
        id: new Date().getTime().toString(),
        title: name
      }

      setList([...list, newItem])
      setName('')
    }
  }

  const showAlert = (show = false, message = "", type = "") => {
    setAlert({ show, message, type })
  }

  const clearList = () => {
    showAlert(true, "all items removed", "danger")
    setList([])
    setIsEditing(false)
    setEditId(null)
    setName('')
  }

  const removeItem = (id: string) => {
    showAlert(true, 'item removed', 'danger')
    setList(list.filter((item: any) => id !== item.id))
  }

  const editItem = (id: string) => {
    const specificItem = list.find((item: any) => item.id === id)
    setIsEditing(true)
    setEditId(id)
    setName(specificItem.title)
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list))
  },[list])

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list} />}
        <h3>Shopping Buddy</h3>
        <div className="form-control">
          <input type="text" className="grocery" placeholder="e.g flour" value={name} onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="submit-btn">{isEditing ? 'Edit' : 'Submit'}</button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>clear items</button>
        </div>
      )}
    </section>
  );
}

export default App;
