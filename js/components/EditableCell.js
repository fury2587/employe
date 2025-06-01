export const EditableCell = (props) => {
  const { createElement, useState, useRef, useEffect } = React;
  const { value, onUpdate, type = 'text', options = [] } = props;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef(null);
  
  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  // Handle click to start editing
  const handleClick = () => {
    setIsEditing(true);
  };
  
  // Handle input change
  const handleChange = (e) => {
    setEditValue(e.target.value);
  };
  
  // Handle blur (clicking outside)
  const handleBlur = () => {
    finishEditing();
  };
  
  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      finishEditing();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };
  
  // Finish editing and save if changed
  const finishEditing = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onUpdate(editValue);
    }
  };
  
  // Render display mode
  const renderDisplay = () => {
    if (type === 'select' && options.length > 0) {
      const selectedOption = options.find(opt => opt.value === value);
      const statusClass = `status status-${value}`;
      
      return createElement(
        'span',
        { 
          className: statusClass,
          onClick: handleClick 
        },
        selectedOption ? selectedOption.label : value
      );
    }
    
    return createElement(
      'span',
      { onClick: handleClick },
      value
    );
  };
  
  // Render edit mode
  const renderEdit = () => {
    if (type === 'select' && options.length > 0) {
      return createElement(
        'select',
        {
          ref: inputRef,
          value: editValue,
          onChange: handleChange,
          onBlur: handleBlur,
          onKeyDown: handleKeyDown
        },
        options.map(option => 
          createElement(
            'option',
            { 
              key: option.value,
              value: option.value 
            },
            option.label
          )
        )
      );
    }
    
    return createElement(
      'input',
      {
        ref: inputRef,
        type: type,
        value: editValue,
        onChange: handleChange,
        onBlur: handleBlur,
        onKeyDown: handleKeyDown
      }
    );
  };
  
  // Render the editable cell
  return createElement(
    'div',
    { className: 'editable-cell' },
    isEditing ? renderEdit() : renderDisplay()
  );
};