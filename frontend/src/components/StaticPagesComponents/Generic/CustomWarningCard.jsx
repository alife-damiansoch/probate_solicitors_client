
import { Alert, Card, CardText } from 'reactstrap';

const CustomWarningCard = ({ text }) => {
  return (
    <Alert className=' mt-3 bg-info text-center'>
      <Card className=' m-1 bg-dark  w-lg-75 border-3 border-warning'>
        <CardText className=' text-info p-3 '>{text}</CardText>
      </Card>
    </Alert>
  );
};

export default CustomWarningCard;
