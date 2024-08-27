import { useEffect, useState } from 'react';
import './App.css';
import Modal from './Modal';
import AddStudentForm from './AddStudentForm';

function App() {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const storedData = localStorage.data ? JSON.parse(localStorage.data) : [];
    setData(storedData);
  }, []);

  function save() {
    localStorage.data = JSON.stringify(data);
  }

  function updateRecord(record) {
    let foundRecord = data.find(x => x.id === record.id);
    Object.assign(foundRecord, record);
    setData([...data]);
    save();
  }

  function deleteRecord(id) {
    if (!confirm('Emin misiniz?')) { return; }
    setData(data.filter(x => x.id !== id));
    save();
  }

  function addRecord(record) {
    setData([...data, record]);
    save();
  }

  return (
    <div className='container'>
      <h1>Öğrenci bilgi sistemi <button onClick={() => setModalOpen(true)}>yeni</button></h1>
      <div className="studentTable">
        <ul className="studentTableTitles">
          <li>Ad</li>
          <li>Soyad</li>
          <li>E-Posta Adresi</li>
          <li>Doğum Tarihi</li>
          <li>#</li>
        </ul>
        {data.map(x => <StudentRow key={x.id} {...x} deleteRecord={deleteRecord} updateRecord={updateRecord} />)}
      </div>

      {isModalOpen && (
        <Modal onClose={() => setModalOpen(false)}>
          <AddStudentForm addRecord={addRecord} onClose={() => setModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}

function StudentRow({ id, ad, soyad, ePosta, dogumTarihi, updateRecord, deleteRecord }) {
  const [isEditing, setEditing] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);
    formObj.id = id;
    updateRecord(formObj);
    setEditing(false);
  }

  return (
    <form onSubmit={handleSubmit} onDoubleClick={() => setEditing(true)}>
      {isEditing ? 
        <>
          <div className="studentTableCol">
            <input type="text" required name='ad' defaultValue={ad} />
          </div>
          <div className="studentTableCol">
            <input type="text" required name='soyad' defaultValue={soyad} />
          </div>
          <div className="studentTableCol">
            <input type="email" required name='ePosta' defaultValue={ePosta} />
          </div>
          <div className="studentTableCol">
            <input type="date" required name='dogumTarihi' defaultValue={dogumTarihi} />
          </div>
          <div className="studentTableCol">
            <button type='button' onClick={() => setEditing(false)}>vazgeç</button>
            <button className='saveBtn' type='submit'>kaydet</button>
          </div>
        </>
        :
        <>
          <div className="studentTableCol">{ad}</div>
          <div className="studentTableCol">{soyad}</div>
          <div className="studentTableCol">{ePosta}</div>
          <div className="studentTableCol">{dogumTarihi.split('-').reverse().join('.')}</div>
          <div className="studentTableCol">
            <button type='button' onClick={() => setEditing(true)}>düzenle</button>
            <button className='delBtn' type='button' onClick={() => deleteRecord(id)}>sil</button>
          </div>
        </>
      }
    </form> 
  );
}

export default App;
