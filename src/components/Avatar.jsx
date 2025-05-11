function Avatar({ name, size = 40, bgColor = '#4A90E2', textColor = '#fff' }) {
    const initials = name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '30%',
          backgroundColor: bgColor,
          color: textColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: size / 2,
          userSelect: 'none',
        }}
      >
        {initials}
      </div>
    );
  }
  
  export default Avatar;
  