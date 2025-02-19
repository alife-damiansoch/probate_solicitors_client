import React, { cloneElement, isValidElement, Children } from 'react';
import {
  Modal as ReactstrapModal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

const CustomModal = ({ isOpen, toggle, children, title }) => {
  // Pass the toggle function as a prop only to elements that need it
  const childrenWithProps = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child);
    }
    return child;
  });

  return (
    <ReactstrapModal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader className='text-white' toggle={toggle}>
        {title}
      </ModalHeader>
      <ModalBody className='bg-light'>{childrenWithProps}</ModalBody>
      <ModalFooter>
        <button className='btn btn-danger' onClick={toggle}>
          Close
        </button>
        {/* You can add additional buttons here if needed */}
      </ModalFooter>
    </ReactstrapModal>
  );
};

export default CustomModal;
