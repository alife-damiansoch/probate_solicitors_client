import { motion } from 'framer-motion';
import { scaleHoverAnimation } from '../Functions/animationFunctions';

const CustomCard = ({
  children,
  backgroundColor,
  shape,
  width = '200px',
  height,
}) => {
  // Define classNames based on the props
  const classNames = `card my-3 rounded-${shape || 'circle'} bg-${
    backgroundColor || 'danger'
  } border-0`;

  // Define styles for width, height, and shadow
  const cardStyle = {
    width: width,
    height: height || '150px',
    boxShadow: '5px 6px 10px rgba(0, 0, 0, 0.5)', // Adjust the shadow as needed
  };

  const animationSettings = scaleHoverAnimation();

  return (
    <motion.div>
      <motion.div
        className={classNames}
        style={cardStyle}
        {...animationSettings}
      >
        <div className='card-body d-flex justify-content-center align-items-center'>
          <i className='text-dark text roboto-regular'>{children}</i>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default CustomCard;
