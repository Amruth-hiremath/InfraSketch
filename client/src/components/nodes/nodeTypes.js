import AWSNode from './AWSNode';

// All AWS services use the same node component but with different data
const nodeTypes = {
  awsService: AWSNode,
};

export default nodeTypes;
