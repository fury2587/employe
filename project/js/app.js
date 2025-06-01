import { DataTable } from './components/DataTable.js';
import { initialData } from './data/initialData.js';

// Create the App component
const App = () => {
  const { createElement, useState } = React;
  
  const [data, setData] = useState(initialData);
  const [savedData, setSavedData] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  
  const handleSave = () => {
    console.log('Saving data:', JSON.stringify(data, null, 2));
    setSavedData(new Date().toLocaleTimeString());
  };
  
  const handleReset = () => {
    setData(initialData);
    setSavedData(null);
    setSelectedUserIds([]);
  };

  const handleAddUser = () => {
    const newId = String(Math.max(...data.map(user => parseInt(user.id))) + 1);
    const newUser = {
      id: newId,
      name: '',
      email: '',
      role: '',
      status: 'pending'
    };
    setData([...data, newUser]);
  };

  const handleDeleteUsers = () => {
    if (selectedUserIds.length === 0) return;
    const newData = data.filter(user => !selectedUserIds.includes(user.id));
    setData(newData);
    setSelectedUserIds([]);
  };
  
  return createElement(
    'div',
    { className: 'app-container' },
    createElement(
      'header', 
      { className: 'app-header' },
      createElement('h1', null, 'Employee Directory'),
      createElement(
        'div',
        { className: 'button-group' },
        createElement(
          'button',
          { onClick: handleAddUser },
          'Add User'
        ),
        createElement(
          'button',
          { 
            onClick: handleDeleteUsers,
            className: 'danger',
            disabled: selectedUserIds.length === 0
          },
          `Delete Selected (${selectedUserIds.length})`
        ),
        createElement(
          'button',
          { onClick: handleSave },
          'Save Changes'
        ),
        createElement(
          'button',
          { 
            className: 'secondary',
            onClick: handleReset 
          },
          'Reset'
        )
      )
    ),
    createElement(DataTable, { 
      data: data, 
      setData: setData,
      selectedUserIds: selectedUserIds,
      setSelectedUserIds: setSelectedUserIds
    }),
    savedData && createElement(
      'p',
      { 
        style: { 
          color: 'var(--color-success)',
          fontStyle: 'italic'
        }
      },
      `Data saved at ${savedData}`
    )
  );
};

// Render the App
const domContainer = document.getElementById('root');
const root = ReactDOM.createRoot(domContainer);
root.render(React.createElement(App));