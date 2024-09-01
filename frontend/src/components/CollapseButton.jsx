import React from 'react';

const CollapseButton = ({ isCollapsed, toggleCollapse }) => {
  return (
    <button
      type="button"
      onClick={toggleCollapse}
      style={{
        position: 'fixed', // Fixed position at the top
        top: '10px', // Adjust vertical position if needed
        left: '200px', // Adjust horizontal position if needed
        zIndex: 1050, // Ensure it's above other elements
        backgroundColor: 'black', // Transparent background
        border: 'none', // Remove border
        padding: '10px', // Add padding
        borderRadius: '50%', // Circular button
      }}
      className="d-flex align-items-center justify-content-center"
    >
      {isCollapsed ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-right" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M6.646 2.646a.5.5 0 0 1 .708 0l5 5a.5.5 0 0 1 0 .708l-5 5a.5.5 0 0 1-.708-.708L11.293 8 6.646 3.354a.5.5 0 0 1 0-.708z"/>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" className="bi bi-chevron-left" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M9.354 2.646a.5.5 0 0 0-.708 0L3.646 7.646a.5.5 0 0 0 0 .708l5 5a.5.5 0 0 0 .708-.708L5.707 8l4.647-4.646a.5.5 0 0 0 0-.708z"/>
        </svg>
      )}
    </button>
  );
};

export default CollapseButton;
