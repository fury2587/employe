import { EditableCell } from './EditableCell.js';

export const DataTable = (props) => {
  const { createElement } = React;
  const { data, setData, selectedUserIds, setSelectedUserIds } = props;
  
  const updateCellValue = (rowIndex, columnId, value) => {
    const newData = [...data];
    newData[rowIndex] = {
      ...newData[rowIndex],
      [columnId]: value
    };
    setData(newData);
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUserIds(data.map(user => user.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleRowSelect = (userId) => {
    if (selectedUserIds.includes(userId)) {
      setSelectedUserIds(selectedUserIds.filter(id => id !== userId));
    } else {
      setSelectedUserIds([...selectedUserIds, userId]);
    }
  };
  
  // Table headers
  const headers = [
    { id: 'select', label: createElement('input', {
      type: 'checkbox',
      checked: data.length > 0 && selectedUserIds.length === data.length,
      onChange: handleSelectAll
    }) },
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
    { id: 'status', label: 'Status' }
  ];
  
  // Create table header row
  const headerRow = createElement(
    'tr',
    null,
    headers.map(header => 
      createElement(
        'th',
        { key: header.id },
        header.label
      )
    )
  );
  
  // Generate status options for dropdown
  const statusOptions = [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'pending', label: 'Pending' }
  ];
  
  // Create table body rows
  const bodyRows = data.map((row, rowIndex) => 
    createElement(
      'tr',
      { 
        key: row.id,
        className: selectedUserIds.includes(row.id) ? 'selected-row' : ''
      },
      [
        createElement(
          'td',
          { key: `${row.id}-select` },
          createElement('input', {
            type: 'checkbox',
            checked: selectedUserIds.includes(row.id),
            onChange: () => handleRowSelect(row.id)
          })
        ),
        ...headers.slice(1).map(header => {
          const columnId = header.id;
          return createElement(
            'td',
            { key: `${row.id}-${columnId}` },
            columnId === 'status' 
              ? createElement(
                  EditableCell, 
                  { 
                    value: row[columnId],
                    onUpdate: value => updateCellValue(rowIndex, columnId, value),
                    options: statusOptions,
                    type: 'select'
                  }
                )
              : createElement(
                  EditableCell,
                  {
                    value: row[columnId],
                    onUpdate: value => updateCellValue(rowIndex, columnId, value),
                    type: columnId === 'email' ? 'email' : 'text'
                  }
                )
          );
        })
      ]
    )
  );
  
  // Create and return the table
  return createElement(
    'table',
    { className: 'data-table' },
    createElement('thead', null, headerRow),
    createElement('tbody', null, ...bodyRows)
  );
};