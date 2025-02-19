export const scaleHoverAnimation = () => ({
  whileHover: {
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  transition: {
    type: 'spring',
    stiffness: 300,
    damping: 20,
  },
});
