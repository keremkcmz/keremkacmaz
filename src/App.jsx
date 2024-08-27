import { useEffect, useState } from 'react';
import './App.css';

function Modal({ children, onClose }) {
  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        <button className="closeBtn" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

function AddStudentForm({ addRecord, onClose }) {
  const [ad, setAd] = useState('');
  const [soyad, setSoyad] = useState('');
  const [ePosta, setEPosta] = useState('');
  const [dogumTarihi, setDogumTarihi] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const newRecord = {
      id: Date.now(), 
      ad,
      soyad,
      ePosta,
      dogumTarihi
    };
    addRecord(newRecord);
    onClose();
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Ad</label>
        <input type="text" required value={ad} onChange={(e) => setAd(e.target.value)} />
      </div>
      <div>
        <label>Soyad</label>
        <input type="text" required value={soyad} onChange={(e) => setSoyad(e.target.value)} />
      </div>
      <div>
        <label>E-Posta Adresi</label>
        <input type="email" required value={ePosta} onChange={(e) => setEPosta(e.target.value)} />
      </div>
      <div>
        <label>Doğum Tarihi</label>
        <input type="date" required value={dogumTarihi} onChange={(e) => setDogumTarihi(e.target.value)} />
      </div>
      <div>
        <button type="button" onClick={onClose}>Vazgeç</button>
        <button type="submit">Ekle</button>
      </div>
    </form>
  );
}

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
    if (foundRecord) {
      Object.assign(foundRecord, record);
      setData([...data]);
      save();
    }
  }

  function deleteRecord(id) {
    if (!confirm('Emin misiniz?')) { return; }
    const updatedData = data.filter(x => x.id !== id);
    setData(updatedData);
    save();
  }

  function addRecord(record) {
    const updatedData = [...data, record];
    setData(updatedData);
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
        {data.map(x => (
          <StudentRow 
            key={x.id} 
            {...x} 
            deleteRecord={deleteRecord} 
            updateRecord={updateRecord} 
          />
        ))}
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
