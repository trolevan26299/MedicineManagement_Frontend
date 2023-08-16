import { Modal, Button } from 'react-bootstrap';

const CommonModal = ({
  show,
  onHide,
  data,
  onFnc,
  titleFooter,
  size,
}: {
  show: boolean;
  onHide: () => void;
  data: string | React.ReactNode;
  onFnc?: () => void;
  titleFooter?: string;
  size: 'sm' | 'lg' | 'xl';
}) => {
  return (
    <Modal show={show} onHide={onHide} centered size={size}>
      <Modal.Header closeButton>
        <Modal.Title>Common Modal</Modal.Title>
      </Modal.Header>
      <Modal.Body>{data}</Modal.Body>
      {onFnc && titleFooter && (
        <Modal.Footer>
          <Button onClick={onHide}>Close</Button>
          <Button className="btn-danger" onClick={onFnc}>
            {titleFooter}
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default CommonModal;
