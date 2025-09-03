
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  text = 'Loading...', 
  variant = 'default',
  fullScreen = false,
  color = '#4a6fa5'
}) => {
  const sizeClass = `spinner-${size}`;
  const textSizeClass = `text-${size}`;
  const variantClass = `spinner-${variant}`;
  
  const spinnerStyle = {
    borderColor: '#f3f3f3',
    borderTopColor: color
  };

  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className={`loading-spinner ${sizeClass} ${variantClass}`}>
          <div className="spinner" style={spinnerStyle}></div>
        </div>
        {text && <p className={`loading-text ${textSizeClass}`} style={{ color }}>{text}</p>}
      </div>
    );
  }

  return (
    <div className={`loading-container ${variant === 'inline' ? 'loading-inline' : ''}`}>
      <div className={`loading-spinner ${sizeClass} ${variantClass}`}>
        <div className="spinner" style={spinnerStyle}></div>
      </div>
      {text && <p className={`loading-text ${textSizeClass}`} style={{ color }}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;