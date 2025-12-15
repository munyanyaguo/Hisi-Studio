// Utility component for placeholder images with colored backgrounds
// This will be replaced with actual images later

const PlaceholderImage = ({
    text = 'Image',
    width = 400,
    height = 300,
    bgColor = '#1a365d',
    textColor = '#ffffff',
    className = ''
}) => {
    return (
        <div
            className={`flex items-center justify-center ${className}`}
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: bgColor,
                color: textColor,
                fontSize: '1.5rem',
                fontWeight: 'bold',
            }}
        >
            {text}
        </div>
    )
}

export default PlaceholderImage
